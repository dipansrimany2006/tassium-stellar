# Deployment API Reference

Base URL: `https://deploy.tassium.roydevelops.tech/api/v1`

---

## Health

### `GET /health`

Returns service status.

**Response** `200`
```json
{ "status": "ok" }
```

---

## Deploy

### `POST /deploy/new`

Create a new app deployment. Clones repo, builds multi-arch Docker image, pushes to registry, deploys as Swarm stack.

**Request Body**
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `github_repo` | string | yes | - | GitHub repo path (`owner/repo`) |
| `app_name` | string | yes | - | Lowercase alphanumeric + hyphens, max 20 chars, starts with letter |
| `branch` | string | no | `main` | Git branch to deploy |
| `port` | number | no | `3000` | Container port to expose |
| `env_vars` | object | no | `{}` | Key-value env vars injected into container |

**Request Example**
```json
{
  "github_repo": "user/my-app",
  "app_name": "my-app",
  "branch": "main",
  "port": 3000,
  "env_vars": {
    "NODE_ENV": "production",
    "DATABASE_URL": "postgres://..."
  }
}
```

**Response `200`** - Success
```json
{
  "status": "success",
  "url": "https://my-app.tassium.roydevelops.tech",
  "app_name": "my-app",
  "build_id": "abc123"
}
```

**Response `400`** - Invalid input
```json
{ "status": "error", "message": "Invalid app name" }
```

**Response `400`** - No Dockerfile
```json
{ "status": "error", "message": "No Dockerfile found in repository" }
```

**Response `404`** - Repo/branch not found
```json
{ "status": "error", "message": "Repository not found" }
```

**Response `409`** - App already exists
```json
{ "status": "error", "message": "App 'my-app' already exists" }
```

**Response `422`** - Build failed
```json
{ "status": "error", "message": "Build failed: <docker build output>" }
```

**Response `500`** - Deploy failed
```json
{ "status": "error", "message": "Stack deploy failed: <error>" }
```

---

## GitHub

### `POST /github/check-dockerfile`

Check if a Dockerfile exists in a GitHub repository.

**Request Body**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `github_url` | string | yes | Full GitHub URL (e.g. `https://github.com/user/repo`) |

**Request Example**
```json
{
  "github_url": "https://github.com/user/my-app"
}
```

**Response `200`** - Found
```json
{
  "exists": true,
  "url": "https://github.com/user/my-app",
  "branch": "main"
}
```

**Response `200`** - Not found
```json
{
  "exists": false,
  "url": "https://github.com/user/my-app",
  "branch": "main"
}
```

**Response `400`** - Invalid URL
```json
{ "error": "Invalid GitHub URL" }
```

---

## Deploy Pipeline

What happens when you call `POST /deploy/new`:

1. Validate `github_repo` format and `app_name` constraints
2. Check app doesn't already exist in Swarm
3. `git clone --depth 1 --branch <branch>` into `/tmp/builds/<app>-<buildId>`
4. Verify `Dockerfile` exists in repo root
5. `docker buildx build --platform linux/amd64,linux/arm64` - multi-arch build
6. Push image to registry at `100.75.8.67:5000/<app>:<buildId>`
7. Generate stack YAML with Traefik labels, 2 replicas, start-first update order, node spread placement
8. `docker stack deploy` to Swarm
9. Cleanup build directory
10. Return app URL: `https://<app>.tassium.roydevelops.tech`

---

## Background: Rebalancer

The deployer runs a background node watcher that auto-rebalances services when Swarm nodes join/leave.

- Streams `docker events --filter type=node` in real-time
- On `ready`/`down` events: debounce 5s then `docker service update --force` all services
- Uses `--update-order start-first --update-parallelism 1 --update-delay 10s` for zero-downtime
- Auto-restarts event stream on failure
- Logs prefixed with `[rebalancer]`

---

## Stack Template

Generated YAML for each deployed app:

```yaml
version: "3.8"
services:
  <app_name>:
    image: 100.75.8.67:5000/<app_name>:<build_id>
    environment:
      - KEY=value
    networks:
      - traefik-public
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
        failure_action: rollback
      placement:
        preferences:
          - spread: node.id
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      labels:
        - traefik.enable=true
        - traefik.http.routers.<app>.rule=Host(`<app>.tassium.roydevelops.tech`)
        - traefik.http.routers.<app>.entrypoints=websecure
        - traefik.http.routers.<app>.tls.certresolver=letsencrypt
        - traefik.http.services.<app>.loadbalancer.server.port=<port>
networks:
  traefik-public:
    external: true
```

---

## Validation Rules

**App Name**: `^[a-z][a-z0-9-]{0,19}$` - lowercase, starts with letter, alphanumeric + hyphens, max 20 chars

**GitHub Repo**: Must match `owner/repo` format
