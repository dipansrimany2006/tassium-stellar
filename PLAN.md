# Implementation Plan: Tassium API

## 1. Drizzle + Neon Setup

### 1.1 Install deps
```bash
cd api
npm i drizzle-orm @neondatabase/serverless
npm i -D drizzle-kit dotenv
```

### 1.2 Create schema (`api/src/db/schema.ts`)
Tables based on `models.types.ts`:

```ts
// projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 20 }).notNull().unique(),
  url: text('url').notNull(),
  port: integer('port').default(3000),
  status: varchar('status', { enum: ['success', 'failed', 'processing', 'pending'] }).default('pending'),
  github: text('github').notNull(),
  replicas: integer('replicas').default(1),
  creator: varchar('creator', { length: 42 }).notNull(), // wallet address
  createdAt: timestamp('created_at').defaultNow(),
})

// payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  amount: varchar('amount', { length: 78 }).notNull(), // uint256 as string
  creator: varchar('creator', { length: 42 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// workers table
export const workers = pgTable('workers', {
  walletAddress: varchar('wallet_address', { length: 42 }).primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
})

// worker_uptime_records table
export const workerUptimeRecords = pgTable('worker_uptime_records', {
  id: serial('id').primaryKey(),
  workerAddress: varchar('worker_address', { length: 42 }).notNull().references(() => workers.walletAddress),
  timeFrom: timestamp('time_from').notNull(),
  timeTo: timestamp('time_to').notNull(),
})
```

### 1.3 Create drizzle config (`api/drizzle.config.ts`)
```ts
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

### 1.4 Add scripts to `package.json`
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate"
```

### 1.5 Create db client (`api/src/db/index.ts`)
```ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export const createDb = (url: string) => {
  const sql = neon(url);
  return drizzle(sql);
};
```

---

## 2. Cloudflare Bindings Setup

### 2.1 Update `wrangler.jsonc`
```jsonc
{
  "kv_namespaces": [
    { "binding": "WORKER_HEARTBEATS", "id": "<KV_ID>" }
  ],
  "vars": {
    "DATABASE_URL": "" // set in dashboard or .dev.vars
  }
}
```

### 2.2 Create types (`api/src/types/env.ts`)
```ts
export type Env = {
  Bindings: {
    WORKER_HEARTBEATS: KVNamespace;
    DATABASE_URL: string;
  }
}
```

---

## 3. KV Schema for Heartbeats

Keys:
- `{walletAddress}:time` -> `{ startTime: string, endTime: string }`
- `{walletAddress}:containers` -> `ActiveContainerRecord[]`

### 3.1 Types (`api/src/types/heartbeat.types.ts`)
```ts
export interface HeartbeatTimeRecord {
  startTime: string; // ISO timestamp
  endTime: string;   // ISO timestamp
}

export interface ActiveContainerRecord {
  containerName: string;
  port: string;
}

export interface HeartbeatPayload {
  walletAddress: string;
  timestamp: string;
  containers: ActiveContainerRecord[];
}
```

---

## 4. API Routes Structure

```
api/src/
├── index.ts
├── db/
│   ├── index.ts          # db client
│   └── schema.ts         # drizzle tables
├── routes/
│   ├── index.ts          # router aggregator
│   ├── deployments.ts    # deployment CRUD
│   ├── heartbeat.ts      # worker heartbeats
│   └── workers.ts        # worker management
├── services/
│   ├── deployment.service.ts
│   ├── heartbeat.service.ts
│   └── worker.service.ts
├── types/
│   ├── env.ts
│   ├── models.types.ts
│   ├── heartbeat.types.ts
│   └── realtime.types.ts
└── utils/
    └── validation.ts
```

---

## 5. Deployment Controller

### 5.1 Routes (`api/src/routes/deployments.ts`)
- `POST /deployments` - create deployment record
- `PATCH /deployments/:name/status` - update status
- `GET /deployments` - list all
- `GET /deployments/:name` - get single
- `DELETE /deployments/:name` - delete

### 5.2 Status Flow
```
pending -> processing -> success | failed
```

### 5.3 Create deployment flow
1. Validate request (app_name, github_repo, creator wallet)
2. Insert to `projects` table with status `pending`
3. Return deployment record
4. (App UI will call deployer API separately, then update status via PATCH)

---

## 6. Heartbeat System

### 6.1 Route (`api/src/routes/heartbeat.ts`)
`POST /heartbeat`

### 6.2 Logic
```
1. Receive: { walletAddress, timestamp, containers[] }
2. Get existing time record from KV
3. If no record:
   - Create new: { startTime: timestamp, endTime: timestamp }
4. If record exists:
   - Check if gap > 30 mins between endTime and timestamp
   - If yes:
     - Flush: save old record to WorkerUptimeRecord table
     - Create new time record
   - If no:
     - Update endTime to timestamp
5. Update containers KV
6. Return success
```

### 6.3 Background job consideration
Cloudflare Workers don't support cron for checking stale heartbeats easily. Options:
- **Option A**: Check staleness on next heartbeat (simpler)
- **Option B**: Use Cloudflare Cron Triggers to check every 30 mins

I'll implement **Option A** (check on heartbeat) + add cron trigger scaffold.

---

## 7. Worker Client Heartbeat Script

### 7.1 Modify `worker-client/src/app/api/setup/route.ts`
Add to bash script:
```bash
# Start heartbeat daemon
nohup bash -c '
  WALLET_ADDRESS="$1"
  API_URL="https://api.tassium.roydevelops.tech"

  while true; do
    CONTAINERS=$(docker ps --format "{{.Names}}:{{.Ports}}" | jq -R -s -c "split(\"\n\") | map(select(length > 0)) | map(split(\":\") | {containerName: .[0], port: .[1]})")

    curl -X POST "$API_URL/heartbeat" \
      -H "Content-Type: application/json" \
      -d "{\"walletAddress\": \"$WALLET_ADDRESS\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"containers\": $CONTAINERS}"

    sleep 300  # 5 minutes
  done
' _ "$WALLET_ADDRESS" &
```

### 7.2 Pass wallet address
Setup script needs wallet address param. Add query param: `/api/setup?wallet=0x...`

---

## 8. Implementation Order

1. **Phase 1**: DB setup
   - Install deps
   - Create schema
   - Create drizzle config
   - Add npm scripts
   - Test migration locally

2. **Phase 2**: API structure
   - Create env types
   - Create routes structure
   - Setup KV binding in wrangler

3. **Phase 3**: Deployment routes
   - CRUD for projects table
   - Status update endpoint

4. **Phase 4**: Heartbeat system
   - Heartbeat route
   - KV read/write logic
   - Staleness check + DB flush

5. **Phase 5**: Worker script
   - Modify setup script
   - Add heartbeat daemon

---

## Unresolved Questions

1. **KV namespace ID** - need to create via `wrangler kv:namespace create WORKER_HEARTBEATS`?
2. **Neon DB URL** - where stored? .dev.vars for local, CF dashboard for prod?
3. **Wallet validation** - should validate wallet signature for heartbeat auth or trust?
4. **Deployer integration** - should api call deployer internally or keep separate (current)?
5. **Setup script wallet** - how is wallet passed to setup script? query param or prompt?
