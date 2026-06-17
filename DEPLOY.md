# Deploy — Hetzner (Docker + nginx + Let's Encrypt)

The stack runs as five containers: `nginx` (public 80/443) → `frontend` (Next.js)
+ `backend` (Go API) → `db` (Postgres), plus `certbot` for TLS. Uploads, the DB
and the Let's Encrypt certs live on named volumes.

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

## 5. DNS

Point an `A` record for `fuzzi.<domain>` at the server's public IP. The cert
issuance in step 6 needs this resolving and port 80 reachable from the internet.

## 6. HTTPS with Let's Encrypt

The stack ships a `certbot` service and an inert `:443` vhost
(`nginx/conf.d/fuzzi-ssl.conf.disabled`). The flow is **two-phase** because nginx
won't start if its config references a cert that doesn't exist yet.

**Order matters — never enable the SSL vhost before the cert exists.**

```bash
# 1. nginx must already be serving :80 (the ACME challenge lives there)
curl -I http://localhost          # expect 307

# 2. Issue the cert. NOTE: --entrypoint certbot is required — the certbot
#    service's default entrypoint is the renewal loop, which would ignore
#    `certonly` and hang.
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  -d fuzzi.<domain> --email you@example.com --agree-tos --no-eff-email
# wait for: "Successfully received certificate"

# 3. Only now enable the HTTPS vhost (it's gitignored, so pulls stay clean)
cp nginx/conf.d/fuzzi-ssl.conf.disabled nginx/conf.d/fuzzi-ssl.conf
docker compose restart nginx
curl -I https://fuzzi.<domain>    # expect 307/200, valid cert
```

Renewal is automatic: the always-on `certbot` service runs `certbot renew` every
12h, and nginx reloads every 6h to pick up renewed certs.

**If nginx crash-loops with `cannot load certificate ... No such file`:** the SSL
vhost was enabled without a cert. Recover with:
```bash
rm -f nginx/conf.d/fuzzi-ssl.conf
docker compose up -d --force-recreate nginx   # back on :80, then redo step 2
```

Optionally force HTTP→HTTPS: in `fuzzi.conf`, replace the proxy `location` blocks
of the `:80` server with `return 301 https://$host$request_uri;` (keep the
`/.well-known/acme-challenge/` location so renewals keep working).

## 7. Harden ingress (recommended)

Restrict inbound 80/443 to expected sources via the Hetzner Cloud Firewall or ufw,
and keep SSH (22) open only for yourself. If you later put Cloudflare in front,
nginx already prefers the `CF-Connecting-IP` header for the real visitor IP — then
allow 80/443 only from Cloudflare's ranges (https://www.cloudflare.com/ips/).

## Operations

```bash
docker compose logs -f backend          # tail logs
docker compose up -d --build            # redeploy after git pull
docker compose run --rm backend /app/seed   # re-seed after editing lesson data
```

Volumes `postgres-data` and `uploads` persist across rebuilds — uploaded avatars
survive redeploys (this is why uploads must NOT be served from the image).
