# Tassium

**Self-hosted container deployment platform powered by Stellar blockchain.**

Deploy apps from GitHub with a single click. Scale with on-chain payments via Stellar. Own your infrastructure.

[![Deploy Dashboard](https://img.shields.io/badge/Deploy_Dashboard-Live-blue)](https://deploy-beta.tassium.roydevelops.tech/)
[![Worker Dashboard](https://img.shields.io/badge/Worker_Dashboard-Live-green)](https://worker.tassium.roydevelops.tech/)
[![Docs](https://img.shields.io/badge/Docs-GitBook-orange)](https://silone-labs.gitbook.io/tassium/)

---

## What is Tassium?

Tassium is a **Vercel/Railway alternative** that you fully own. Push a GitHub repo, pick an app name, and Tassium handles the rest — Dockerfile detection, multi-arch builds, Swarm orchestration, automatic SSL, and subdomain routing.

Scaling beyond the free tier is paid via **Stellar (XLM)** through a Soroban smart contract, enabling trustless, on-chain infrastructure billing.

### Live Links

| Resource | URL |
|----------|-----|
| Deploy Dashboard | [deploy-beta.tassium.roydevelops.tech](https://deploy-beta.tassium.roydevelops.tech/) |
| Worker Dashboard | [worker.tassium.roydevelops.tech](https://worker.tassium.roydevelops.tech/) |
| Documentation | [silone-labs.gitbook.io/tassium](https://silone-labs.gitbook.io/tassium/) |

---

## Architecture

```
                         Internet
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│  Manager Node (VPS)                                      │
│                                                          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│  │  Traefik  │  │  Registry │  │ Deploy API│            │
│  │  :80/:443 │  │  :5000    │  │  :8000    │            │
│  └───────────┘  └───────────┘  └───────────┘            │
└──────────────────────────────────────────────────────────┘
                            │
                      Tailscale Mesh
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Worker Node 1       │    │  Worker Node 2       │
│  [App Containers]    │    │  [App Containers]    │
└──────────────────────┘    └──────────────────────┘
```

**Flow:** UI → Deploy API → Clone repo → Detect/generate Dockerfile → Build (amd64 + arm64) → Push to registry → Deploy to Swarm → `{app}.tassium.roydevelops.tech`

---

## Project Structure

```
tassium/
├── app/            # Deploy Dashboard (Next.js) — deploy & manage apps
├── client/         # Landing page (Next.js) — 3D portfolio site
├── deployment/     # Deploy API (Bun + Hono) — core backend
├── api/            # Cloudflare Workers API (Hono) — edge functions
├── contracts/      # Soroban smart contract (Rust) — on-chain payments
├── worker/         # Worker node setup scripts
├── worker-client/  # Worker status dashboard (Next.js)
└── manager/        # Manager node Docker Swarm config
```

---

## Stellar Integration

Tassium uses a **Soroban smart contract** on Stellar mainnet for scaling payments.

| Detail | Value |
|--------|-------|
| Contract ID | `CCCWT7J2AUNY34BYT3MVJZGZKTKFHXSTA2H7IAE4UWP7OJS4CXEVJUMG` |
| Network | Stellar Mainnet |
| Wallet | [Freighter](https://www.freighter.app/) |

### Scaling Model

| Scale | Cost |
|-------|------|
| 1–2X | Free |
| 3–10X | `scale × 0.1` XLM per operation |

The contract acts as a **router** — a single Freighter signature transfers XLM to the project wallet and records the deposit on-chain in one atomic transaction.

### Contract Functions

| Function | Description |
|----------|-------------|
| `deposit(wallet, amount, date)` | Transfers XLM + records deposit |
| `get_deposits(wallet)` | Returns full deposit history |
| `get_last_subscription_date(wallet)` | Returns most recent deposit timestamp |

> View on Stellar Expert: [Explorer Link](https://stellar.expert/explorer/public/contract/CCCWT7J2AUNY34BYT3MVJZGZKTKFHXSTA2H7IAE4UWP7OJS4CXEVJUMG)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Radix UI |
| Backend | Bun, Hono |
| Edge API | Cloudflare Workers, Hono |
| Smart Contract | Rust, Soroban SDK v22 |
| Infrastructure | Docker Swarm, Traefik v3, Tailscale |
| Blockchain | Stellar Mainnet, Freighter Wallet |

---

## Getting Started

### Deploy Dashboard

```bash
cd app
npm install
npm run dev        # http://localhost:3000
```

### Deploy API

```bash
cd deployment
bun install
bun run --hot src/index.ts   # dev with hot reload
```

### Cloudflare Workers API

```bash
cd api
wrangler dev       # local development
wrangler deploy --minify
```

### Smart Contract

```bash
cd contracts
stellar contract build
stellar contract deploy --wasm target/wasm32v1-none/release/subscription.wasm \
  --source-account <DEPLOYER> \
  --network-passphrase "Public Global Stellar Network ; September 2015" \
  --rpc-url "https://mainnet.sorobanrpc.com"
```

---

## API Endpoints

Base: `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/deploy` | Create a new deployment |
| `GET` | `/apps` | List all deployed apps |
| `GET` | `/apps/:name/status` | Get app status & replicas |
| `GET` | `/apps/:name/logs` | View application logs |
| `DELETE` | `/apps/:name` | Remove an app |
| `PATCH` | `/deployments/:name/replicas` | Update replica count |
| `GET` | `/github/:org/:repo/branches` | List repo branches |

---

## How It Works

1. **Deploy** — Paste a GitHub repo URL, pick an app name, and hit deploy
2. **Build** — Tassium clones the repo, detects the framework, generates a Dockerfile if needed, and builds a multi-arch image
3. **Ship** — The image is pushed to a private registry and deployed across worker nodes via Docker Swarm
4. **Route** — Traefik automatically provisions an SSL certificate and routes `{app}.tassium.roydevelops.tech` to the running containers
5. **Scale** — Scale from 1X to 10X replicas. Free up to 2X, paid via Stellar XLM for 3X+

---

## Documentation

For full setup guides, API reference, and tutorials, visit the **[Tassium Docs](https://silone-labs.gitbook.io/tassium/)**.

---

## License

MIT
