# Tassium - Distributed Container Deployment Platform

## Overview

Tassium is a self-hosted container deployment platform that allows users to deploy applications via a simple UI. It uses Docker Swarm for orchestration, Tailscale for secure mesh networking, and Traefik for automatic routing and SSL.

**Think of it as a simplified Vercel/Railway that you own.**

---

## Architecture

```
                         Internet
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  DigitalOcean VPS (Manager Node)                             │
│  Public IP: [VPS_IP]                                         │
│  Tailscale IP: 100.x.x.x                                     │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │  Traefik    │  │  Registry   │  │  Deploy API │           │
│  │  :80/:443   │  │  :5000      │  │  :8000      │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
└──────────────────────────────────────────────────────────────┘
                            │
                      Tailscale Mesh
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Worker Node 1       │    │  Worker Node 2       │
│  Tailscale IP: 100.x │    │  Tailscale IP: 100.x │
│                      │    │                      │
│  [App Containers]    │    │  [App Containers]    │
└──────────────────────┘    └──────────────────────┘
```

---

## Infrastructure (Already Set Up)

### VPS (Manager Node)

- **Provider**: DigitalOcean
- **OS**: Ubuntu 24.04
- **Role**: Swarm Manager
- **Running Services**:
  - Traefik (reverse proxy, SSL termination)
  - Docker Registry (localhost:5000)
  - Deploy API (to be built)

### Worker Nodes

- Connected via Tailscale
- Joined to Docker Swarm
- Labeled with `type=worker`
- Where deployed apps actually run

### Networking

- **Tailscale**: Mesh VPN connecting all nodes
- **Docker Overlay Network**: `traefik-public` (for inter-service communication)
- **Domain**: `roydevelops.tech`
- **App Subdomain Pattern**: `*.tassium.roydevelops.tech`

### DNS Configuration

| Type | Name        | Value  |
| ---- | ----------- | ------ |
| A    | `tassium`   | VPS_IP |
| A    | `*.tassium` | VPS_IP |

---

## Deploy API Specification

### Location

- Runs on VPS (manager node)
- URL: `https://deploy.tassium.roydevelops.tech`
- Must have access to Docker socket
- Must run on manager node (placement constraint)

### Endpoints

#### 1. Deploy Application

```
POST /deploy
Content-Type: application/json

Request:
{
  "github_repo": "username/repo",
  "app_name": "myapp",
  "branch": "main",
  "port": 3000,
  "env_vars": {
    "DATABASE_URL": "postgres://...",
    "API_KEY": "secret123"
  }
}

Response (Success):
{
  "status": "success",
  "url": "https://myapp.tassium.roydevelops.tech",
  "app_name": "myapp",
  "build_id": "abc123"
}

Response (Error):
{
  "status": "error",
  "message": "Build failed: npm install error"
}
```

#### 2. Remove Application

```
DELETE /apps/{app_name}

Response:
{
  "status": "success",
  "message": "myapp removed"
}
```

#### 3. List Applications

```
GET /apps

Response:
{
  "apps": [
    {
      "name": "myapp",
      "url": "https://myapp.tassium.roydevelops.tech",
      "replicas": 2,
      "status": "running"
    }
  ]
}
```

#### 4. Get Application Status

```
GET /apps/{app_name}/status

Response:
{
  "name": "myapp",
  "status": "running",
  "replicas": {
    "desired": 2,
    "running": 2
  },
  "nodes": ["worker1", "worker2"],
  "url": "https://myapp.tassium.roydevelops.tech"
}
```

#### 5. Get Application Logs

```
GET /apps/{app_name}/logs?lines=100

Response:
{
  "logs": "2024-01-15T10:30:00Z Starting server...\n..."
}
```

---

## Deploy Flow

When a user submits a deploy request:

```
1. CLONE
   git clone --depth 1 --branch {branch} https://github.com/{github_repo}.git /tmp/builds/{app_name}-{build_id}

2. DOCKERFILE CHECK
   - If Dockerfile exists in repo: use it
   - If not: generate appropriate Dockerfile (see templates below)

3. BUILD
   docker build -t localhost:5000/{app_name}:{build_id} /tmp/builds/{app_name}-{build_id}

4. PUSH
   docker push localhost:5000/{app_name}:{build_id}

5. GENERATE STACK YAML
   Create docker-compose stack file with Traefik labels

6. DEPLOY
   docker stack deploy -c /tmp/stacks/{app_name}.yml {app_name}

7. CLEANUP
   rm -rf /tmp/builds/{app_name}-{build_id}

8. RETURN
   Return URL to user
```

---

## Stack YAML Template

Generated for each deployed app:

```yaml
version: "3.8"

services:
  { app_name }:
    image: localhost:5000/{app_name}:{build_id}
    environment:
      - KEY1=value1
      - KEY2=value2
    networks:
      - traefik-public
    deploy:
      replicas: 2
      placement:
        constraints:
          - node.role == worker
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.{app_name}.rule=Host(`{app_name}.tassium.roydevelops.tech`)"
        - "traefik.http.routers.{app_name}.entrypoints=websecure"
        - "traefik.http.routers.{app_name}.tls.certresolver=letsencrypt"
        - "traefik.http.services.{app_name}.loadbalancer.server.port={port}"

networks:
  traefik-public:
    external: true
```

---

## Deploy API Implementation Requirements

### Must Have Access To

- Docker socket (`/var/run/docker.sock`)
- `/tmp` directory for builds
- Network access to `localhost:5000` (registry)

### Placement Constraint

Must run on manager node:

```yaml
deploy:
  placement:
    constraints:
      - node.role == manager
```

### Deploy API's Own Stack File

```yaml
version: "3.8"

services:
  deployer:
    image: localhost:5000/tassium-deployer:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp:/tmp
    networks:
      - traefik-public
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.deployer.rule=Host(`deploy.tassium.roydevelops.tech`)"
        - "traefik.http.routers.deployer.entrypoints=websecure"
        - "traefik.http.routers.deployer.tls.certresolver=letsencrypt"
        - "traefik.http.services.deployer.loadbalancer.server.port=8000"

networks:
  traefik-public:
    external: true
```

---

## App Name Validation Rules

- Lowercase only
- Alphanumeric and hyphens only
- Max 20 characters
- Must start with a letter
- No consecutive hyphens

```
Valid: myapp, my-app, app123, my-cool-app
Invalid: MyApp, my_app, -myapp, my--app, 123app
```

---

## Commands Reference

### Swarm Management

```bash
docker node ls                          # List nodes
docker service ls                       # List services
docker stack ls                         # List stacks
docker stack deploy -c file.yml name    # Deploy stack
docker stack rm name                    # Remove stack
```

### Service Management

```bash
docker service ps service_name          # Where is it running?
docker service logs -f service_name     # View logs
docker service scale service_name=N     # Scale replicas
docker service update --force name      # Force restart
```

### Registry

```bash
curl http://localhost:5000/v2/_catalog  # List images
curl http://localhost:5000/v2/app/tags/list  # List tags
```

---

## Error Handling

The API should handle these scenarios:

| Error               | Response                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Invalid GitHub repo | `{"status": "error", "message": "Repository not found"}`                                                |
| Build failure       | `{"status": "error", "message": "Build failed: [error details]"}`                                       |
| App already exists  | `{"status": "error", "message": "App 'myapp' already exists"}`                                          |
| Invalid app name    | `{"status": "error", "message": "Invalid app name. Use lowercase letters, numbers, and hyphens only."}` |
| App not found       | `{"status": "error", "message": "App 'myapp' not found"}`                                               |

---

## UI Requirements (Separate from API)

The UI should provide:

1. **Deploy Form**
   - GitHub repo input
   - App name input
   - Branch selection (default: main)
   - Port input (default: 3000)
   - Environment variables (key-value pairs, add/remove)
   - Deploy button

2. **Apps List**
   - Show all deployed apps
   - Status indicator (running/stopped/error)
   - URL link
   - Delete button
   - View logs button

3. **App Detail View**
   - Status
   - Replicas
   - Nodes
   - Logs viewer
   - Environment variables (masked)
   - Delete option

---

## File Structure for Deploy API

```
/opt/deployer/
├── main.py              # API entry point
├── deploy.py            # Deploy logic
├── templates/
│   ├── nextjs.Dockerfile
│   ├── node.Dockerfile
│   ├── python.Dockerfile
│   └── static.Dockerfile
├── requirements.txt     # Python dependencies
├── Dockerfile           # For the API itself
└── docker-compose.yml   # Stack file for the API
```

---

## Testing

### Test Deploy API Locally

```bash
# Build
docker build -t localhost:5000/tassium-deployer:latest .

# Push
docker push localhost:5000/tassium-deployer:latest

# Deploy
docker stack deploy -c docker-compose.yml deployer
```

### Test a Deployment

```bash
curl -X POST https://deploy.tassium.roydevelops.tech/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "github_repo": "vercel/next.js",
    "app_name": "nextjs-test",
    "branch": "canary",
    "port": 3000
  }'
```

---

## Security Considerations (Future)

- [ ] API key authentication
- [ ] Rate limiting
- [ ] Build timeouts (max 10 minutes)
- [ ] Resource limits on containers
- [ ] Private repo support (GitHub tokens)
- [ ] Input sanitization

---

## Summary

Tassium is a container deployment platform with:

1. **VPS** running Traefik, Registry, and Deploy API
2. **Worker nodes** connected via Tailscale running the actual apps
3. **Deploy API** that builds and deploys apps from GitHub repos
4. **Automatic SSL** via Traefik and Let's Encrypt
5. **Apps available at** `{app_name}.tassium.roydevelops.tech`

The user provides a GitHub repo and app name, and Tassium handles everything else.
