# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tassium - self-hosted container deployment platform. Deploy apps via Docker Swarm + Tailscale mesh + Traefik routing. Like Vercel/Railway but self-hosted.

## Architecture

```
stellar/
├── app/          # Admin UI (Next.js 16) - deploy interface
├── client/       # Public landing (Next.js) - 3D portfolio site
├── deployment/   # Deploy API (Bun + Hono) - core backend
├── api/          # Cloudflare Workers API (Hono)
├── worker/       # Worker node setup scripts
├── worker-client/# Worker status dashboard (Next.js)
├── manager/      # Manager node Docker Swarm config
```

**Deployment Flow**: UI → `/api/v1/deploy` → clone repo → detect/generate Dockerfile → buildx multi-arch (amd64+arm64) → push to registry → generate stack YAML → deploy to Swarm → `{app}.tassium.roydevelops.tech`

**Infrastructure**: Manager node (Traefik, Registry, Deployer) → Worker nodes (run app containers) via Tailscale mesh

## Commands

**App UI** (`cd app`):
```bash
npm run dev       # :3000
npm run build && npm run start
```

**Deployment API** (`cd deployment`):
```bash
bun run --hot src/index.ts  # dev w/ hot reload
bun run src/index.ts        # prod
```

**Cloudflare API** (`cd api`):
```bash
wrangler dev                # local
wrangler deploy --minify    # deploy
```

**Client** (`cd client`):
```bash
pnpm dev/build/start
```

## Key Files

- `deployment/src/routes/deployer.controller.ts` - main deploy endpoint
- `deployment/src/services/docker.service.ts` - build/push/deploy
- `deployment/src/services/stack.service.ts` - generate docker-compose YAML
- `deployment/src/services/dockerfile.service.ts` - auto-generate Dockerfiles
- `app/src/app/(root)/page.tsx` - deployed apps grid
- `app/src/components/deploy-dialog.tsx` - deploy form

## API Endpoints (`/api/v1`)

- `POST /deploy` - create deployment
- `DELETE /apps/{name}` - remove app
- `GET /apps` - list apps
- `GET /apps/{name}/status` - app status
- `GET /apps/{name}/logs` - view logs
- `GET /github/{org}/{repo}/branches` - list branches

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind v4, Radix UI, React Hook Form + Zod
- **Backend**: Bun, Hono
- **Infra**: Docker Swarm, Traefik v3, Tailscale, Docker Buildx

## Conventions

- App names: lowercase, alphanumeric + hyphens, max 20 chars, starts with letter
- Default port: 3000, default branch: main
- Temp builds: `/tmp/builds`, stack files: `/tmp/stacks`
- Registry: `100.75.8.67:5000`
