# Worker Monitoring Upgrade

## Steps
- [x] Step 1: DB Schema — added `workerMetrics`, `containerMetrics` tables + extended `workers` with cpuCores, ramTotalGb, storageTotalGb, status, lastPing
- [x] Step 2: Types — added `SystemMetrics`, `PingPayload`, updated `ContainerInfo` (name+cpu+mem, dropped port)
- [x] Step 3: Ping route — `POST /heartbeat/ping` KV-only liveness
- [x] Step 4: Heartbeat service — resource-aware credit formula, metrics insertion
- [x] Step 5: Worker routes — `GET /:wallet/metrics`, `GET /:wallet/status`, extended `GET /:wallet`
- [x] Step 6: Bash agent — 30s ping loop + 300s full heartbeat with system/container metrics
- [x] Step 7: Dashboard — real metrics charts, resource capacity cards, per-container CPU/mem

## Verification
- [x] `drizzle-kit generate` — migration `0001_high_paper_doll.sql` generated
- [x] `drizzle-kit migrate` — applied successfully
- [x] `wrangler deploy --dry-run` — compiles clean (520KB)
- [x] `tsc --noEmit` on worker-client — no errors
- [ ] Deploy API to CF Workers + re-setup a worker node to test e2e
