# 🚀 Deployment & Infrastructure

> Consolidated from the real infra files (Dockerfile, compose, nginx, deploy scripts, GitHub workflows) — treated as ground truth over the older scattered docs. See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index and [MAP-ENV.md](MAP-ENV.md) for env vars.

## Target & topology

- **Self-hosted on a VPS via Docker Compose** (not Vercel — a legacy `vercel.json` exists but is unused).
- Reverse proxy: **nginx** terminates TLS (Let's Encrypt/certbot) and proxies to the app on `127.0.0.1:3000`.
- Domain: `gluhoman.com.ua` + `www` (per [[project-domain-plan]]: this domain is legacy; a final domain attaches later).

> ⚠️ **Host IP is ambiguous — confirm before deploying.** The committed scripts hardcode **`72.60.16.73`** (13 references). But a server migration happened ~May 2026 ("old hosting died"), and recent ops notes reference **`185.230.64.192`** (multi-site VPS). The repo scripts have *not* been updated. Verify the live host first.

## Stack (`docker-compose.prod.yml`)

| Service | Image | Notes |
|---------|-------|-------|
| `postgres` | postgres:16-alpine | Prod DB; `postgres-data` volume; `pg_isready` healthcheck |
| `redis` | redis:7-alpine | Cache/queue, AOF + LRU 256MB; `redis-data` volume |
| `site` | gluhoman-site (this app) | Bound to `127.0.0.1:3000`; non-root `nextjs` (uid 1001); `depends_on` postgres healthy |
| `bot` | gluhoman-bot | **Separate Telegraf bot** in `bot/` (own package + Dockerfile + prisma). `profiles: [bot]` → only starts with `--profile bot` |
| `backup` | postgres:16-alpine | `profiles: [backup]`; `pg_dump -Fc` → `./backups/`, 7-day retention |

Volumes also mount `./uploads:/app/public/uploads` (admin image uploads — must `mkdir -p uploads` first).

## Build & run

- **next.config.ts**: `output: "standalone"` (emits `.next/standalone/server.js`), Sentry wrapped **prod-only**, AVIF/WebP images, remote pattern `static.shaketopay.com.ua`, 30-day immutable cache on `/images/*` and the optimizer.
- **Dockerfile** (multi-stage, node:20-alpine, ~100MB final):
  1. `deps` — `npm ci` + `prisma generate --schema=prisma/schema.postgres.prisma`
  2. `builder` — removes Sentry instrumentation stubs, `npm run build`
  3. `runner` — non-root; copies `standalone` + `static` + **prisma CLI/client** (needed for in-container migrations); `CMD ["node","server.js"]`
- **Prod start:** `docker compose -f docker-compose.prod.yml up -d`

### ⚠️ Healthcheck gotcha (do not regress)
Healthchecks MUST use `http://127.0.0.1:3000/`, **never `localhost`** — BusyBox wget on Alpine resolves `localhost`→IPv6 `::1` first, but Node listens on IPv4 `0.0.0.0`, so `localhost` → permanent connection-refused → container marked unhealthy forever. (This is the [[project-prod-outage-root-cause]] — that, plus a missing `env_file`, not OOM.)

## Database in prod

- Dual schema (see [MAP-DATA.md](MAP-DATA.md#prisma--dual-schema)): dev = SQLite, prod = **Postgres** (`schema.postgres.prisma`).
- Apply migrations in-container:
  ```bash
  docker compose -f docker-compose.prod.yml exec site \
    npx prisma migrate deploy --schema=prisma/schema.postgres.prisma
  ```
- Seed: `npm run db:seed` (or `node scripts/seed-admin.mjs` for the admin user in CI).
- One-time data move: `scripts/migrate-sqlite-to-postgres.mjs` (supports `--dry-run`).

## CI/CD (`.github/workflows/`)

- **ci.yml** (push to main/develop, PRs): lint → `tsc --noEmit` (blocking) → `npm run build` → Playwright e2e (chromium, seeded ci.db) → bot image build. Concurrency cancels superseded runs.
- **deploy.yml** (`workflow_dispatch`): builds & pushes `site` + `bot` images to **GHCR** (`ghcr.io/...:latest` + `:sha`). **Does not deploy to the VPS** — the VPS deploy is manual.
- **security.yml**: weekly dependency + secret scan.
- **dependabot.yml**: weekly npm (grouped next/react/prisma), monthly actions.

### Ongoing manual deploy
```bash
cd /opt/gluhoman && git pull
docker compose -f docker-compose.prod.yml build site
docker compose -f docker-compose.prod.yml up -d site
docker compose -f docker-compose.prod.yml exec site \
  npx prisma migrate deploy --schema=prisma/schema.postgres.prisma
```

## nginx / TLS (`scripts/nginx-gluhoman.conf`)

- :80 → 301 to HTTPS (keeps Let's Encrypt HTTP-01 path); :443 proxies to `127.0.0.1:3000`.
- HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy.
- Caching: `/_next/static/` 365d immutable; `/images`,`/videos`,`og-*` 7d. API rate-limit 10 r/s/IP (burst 20). `client_max_body_size 10M`.
- TLS 1.2/1.3, ECDHE ciphers, certbot certs at `/etc/letsencrypt/live/gluhoman.com.ua/`.

## Bootstrap scripts (`scripts/`)

- `vps-bootstrap.sh` — apt base, Docker, non-root `gluhoman` user, SSH hardening, UFW (22/80/443), fail2ban, unattended-upgrades.
- `vps-deploy-remote.sh` — one-shot: clone → generate `.env` (random secrets, hardcoded IP) → build → migrate/seed → nginx vhost → certbot → backup cron.
- `backup-postgres.sh`, `nginx-gluhoman.conf`, `seed-admin.mjs`, `migrate-sqlite-to-postgres.mjs`.

## Backups

Manual: `docker compose -f docker-compose.prod.yml --profile backup run --rm backup` → `./backups/gluhoman-<ts>.dump`. Cron daily 03:00, 7-day retention. Restore via `pg_restore --clean --if-exists`.

## Production gotchas

1. **Healthcheck `127.0.0.1` not `localhost`** (above) — the documented outage cause.
2. **Schema drift risk** — keep `schema.prisma` and `schema.postgres.prisma` in sync manually.
3. **Sentry instrumentation files removed in build** — prod uses no-op stubs; Sentry only active when `NODE_ENV=production` + DSN set.
4. **`env_file` is `required: false`** in prod compose — stack starts even if `.env` is missing (falls back to inline `environment:`); set true to fail fast.
5. **Bot needs `--profile bot`** — easy to forget; bot won't start otherwise, no error if `BOT_TOKEN` missing.
6. **nginx enforces API rate-limiting** — bypassed if you hit port 3000 directly (Next has no built-in limiter).
7. **30-day image cache is per-path** — changing an image at the same path serves stale up to 30 days; rename to bust.

## Source files

`next.config.ts`, `Dockerfile`, `docker-compose.yml` (dev), `docker-compose.prod.yml`, `.dockerignore`, `vercel.json` (unused), `scripts/{vps-bootstrap,vps-deploy-remote,backup-postgres}.sh`, `scripts/nginx-gluhoman.conf`, `scripts/{seed-admin,migrate-sqlite-to-postgres}.mjs`, `.github/workflows/{ci,deploy,security}.yml`, `.github/dependabot.yml`, `bot/` (separate service). Older prose: `docs/{DEPLOYMENT,VPS-SETUP,PRODUCTION,CI-CD,OPERATIONS,BOT-DEPLOY}.md` (accurate but scattered; this file consolidates them).
