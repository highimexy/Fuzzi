# Deploy — Hetzner + Cloudflare

The stack runs as four containers: `nginx` (public 80/443) → `frontend` (Next.js)
+ `backend` (Go API) → `db` (Postgres). Uploads and the DB live on named volumes.

## 1. Prerequisites on the server

```bash
# Docker + compose plugin (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
```

## 2. Configure

```bash
git clone <repo> && cd Fuzzi
cp .env.example .env
nano .env            # fill in every value (see notes below)
```

Key points:
- `NEXT_PUBLIC_*` are **baked into the frontend image at build time**. Changing
  them later requires `docker compose build frontend` again, not just a restart.
- `ALLOWED_ORIGIN` and `NEXT_PUBLIC_API_URL` should both be your public domain
  (e.g. `https://twojadomena.pl`); the API is reached at the same origin under
  `/api/v1` via nginx.
- **Rotate `FINNHUB_API_KEY`** — the old value is in git history.

## 3. Auth0 dashboard (manual)

In the Auth0 application settings add the production URLs:
- **Allowed Callback URLs:** `https://twojadomena.pl/en/auth/callback`, `https://twojadomena.pl/pl/auth/callback`
- **Allowed Web Origins / CORS:** `https://twojadomena.pl`
- **Allowed Logout URLs:** `https://twojadomena.pl`

(Optional optimization noted in `backend/internal/auth/sync.go`: add a Login
Action that injects the email as a namespaced custom claim to avoid a `/userinfo`
roundtrip per request.)

## 4. Bring it up

```bash
docker compose up -d --build
docker compose run --rm backend /app/seed          # seed lessons/quests data
docker compose run --rm backend /app/seed-admin <your-email>   # grant admin
```

The backend runs GORM AutoMigrate on boot, so the schema is created automatically.

## 5. Cloudflare + DNS

1. Point an `A` record for the domain at the server's public IP (proxied / orange cloud).
2. **SSL/TLS mode:** start with *Flexible* (works with the default nginx `:80`).
   For real end-to-end TLS use *Full (strict)*:
   - Create an **Origin Certificate** (SSL/TLS → Origin Server).
   - Save it as `nginx/certs/origin.pem` and `nginx/certs/origin.key`.
   - Uncomment the `:443` block in `nginx/conf.d/fuzzi.conf`, switch the `:80`
     server to `return 301 https://$host$request_uri;`, then
     `docker compose restart nginx`.

## 6. Harden ingress (recommended)

nginx trusts the `CF-Connecting-IP` header for the real visitor IP. To stop
anyone bypassing Cloudflare and spoofing it, allow inbound 80/443 **only from
Cloudflare IP ranges** (https://www.cloudflare.com/ips/) via the Hetzner Cloud
Firewall or ufw.

## Operations

```bash
docker compose logs -f backend          # tail logs
docker compose up -d --build            # redeploy after git pull
docker compose run --rm backend /app/seed   # re-seed after editing lesson data
```

Volumes `postgres-data` and `uploads` persist across rebuilds — uploaded avatars
survive redeploys (this is why uploads must NOT be served from the image).
