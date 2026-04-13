#!/bin/bash
# Скрипт який виконується НА VPS після SSH підключення.
# Повний первинний деплой Глухомань на чистий Ubuntu 24.04.
set -euo pipefail

GREEN='\033[1;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${BLUE}==>${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠${NC} $*"; }

REPO_URL="${REPO_URL:-https://github.com/gluhdev/gluhoman-land.git}"
APP_DIR="/opt/gluhoman"

# ---- 1. System update ----
info "Оновлюємо apt..."
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq >/dev/null
ok "apt updated"

# ---- 2. Essentials ----
info "Встановлюємо базові пакети..."
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  curl wget git ufw fail2ban htop nano unzip cron ca-certificates gnupg lsb-release \
  openssl jq rsync >/dev/null
ok "base packages installed"

# ---- 3. Docker CE ----
if ! command -v docker >/dev/null 2>&1; then
  info "Встановлюємо Docker CE..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null
  systemctl enable --now docker
  ok "Docker $(docker --version)"
else
  ok "Docker already installed"
fi

# ---- 4. Nginx + certbot ----
if ! command -v nginx >/dev/null 2>&1; then
  info "Встановлюємо nginx + certbot..."
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx certbot python3-certbot-nginx >/dev/null
  systemctl enable --now nginx
  ok "nginx + certbot installed"
else
  ok "nginx already installed"
fi

# ---- 5. UFW ----
info "Налаштовуємо firewall..."
ufw --force reset >/dev/null
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw allow 22/tcp comment 'SSH' >/dev/null
ufw allow 80/tcp comment 'HTTP' >/dev/null
ufw allow 443/tcp comment 'HTTPS' >/dev/null
ufw --force enable >/dev/null
ok "UFW active: 22, 80, 443"

# ---- 6. Timezone ----
timedatectl set-timezone Europe/Kyiv
ok "timezone: Europe/Kyiv"

# ---- 7. Clone repo ----
if [ ! -d "$APP_DIR/.git" ]; then
  info "Клонуємо репозиторій..."
  mkdir -p "$APP_DIR"
  git clone "$REPO_URL" "$APP_DIR"
  ok "repo cloned to $APP_DIR"
else
  info "Оновлюємо репозиторій..."
  cd "$APP_DIR"
  git fetch origin
  git reset --hard origin/main
  ok "repo updated"
fi

cd "$APP_DIR"

# ---- 8. .env setup ----
if [ ! -f .env ]; then
  info "Створюємо .env з дефолтами..."
  POSTGRES_PW=$(openssl rand -base64 24 | tr -d '/=+' | cut -c1-24)
  NEXTAUTH_SEC=$(openssl rand -base64 32)

  cat > .env <<EOF
# Auto-generated at $(date -u +%Y-%m-%dT%H:%M:%SZ)
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=http://72.60.16.73
PORT=3000

# Postgres
POSTGRES_USER=gluhoman
POSTGRES_PASSWORD=${POSTGRES_PW}
POSTGRES_DB=gluhoman
DATABASE_URL=postgresql://gluhoman:${POSTGRES_PW}@postgres:5432/gluhoman

# NextAuth
NEXTAUTH_SECRET=${NEXTAUTH_SEC}
AUTH_SECRET=${NEXTAUTH_SEC}
NEXTAUTH_URL=http://72.60.16.73

# Admin seed
ADMIN_EMAIL=admin@gluhoman.com.ua
ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '/=+' | cut -c1-18)

# Telegram
TELEGRAM_BOT_TOKEN=8758642838:AAG5F7rEWKpI6AVqMnjbTZpe6ieKbBTuruQ
TELEGRAM_CHAT_ID=1394061721

# Optional email
RESEND_API_KEY=
BOOKING_EMAIL_FROM=
BOOKING_EMAIL_TO=

# Optional monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
EOF
  chmod 600 .env
  ok ".env created with random POSTGRES_PASSWORD, NEXTAUTH_SECRET, ADMIN_PASSWORD"
else
  ok ".env already exists"
fi

# ---- 9. Build and start Docker stack ----
info "Building Docker images (це займе 3-5 хвилин)..."
docker compose -f docker-compose.prod.yml build --progress=plain 2>&1 | tail -20

info "Starting stack..."
docker compose -f docker-compose.prod.yml up -d

# ---- 10. Wait for Postgres ----
info "Waiting for Postgres to be healthy..."
for i in 1 2 3 4 5 6 7 8 9 10; do
  if docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U gluhoman >/dev/null 2>&1; then
    ok "Postgres ready"
    break
  fi
  sleep 3
done

# ---- 11. Run migrations ----
info "Running Prisma migrations..."
docker compose -f docker-compose.prod.yml exec -T site sh -c '
  npx prisma migrate deploy --schema=prisma/schema.postgres.prisma 2>&1 | tail -10 || true
  npx prisma db push --schema=prisma/schema.postgres.prisma --accept-data-loss 2>&1 | tail -5 || true
'

# ---- 12. Seed data ----
info "Seeding menu + admin user..."
docker compose -f docker-compose.prod.yml exec -T site sh -c '
  node prisma/seed.ts 2>&1 | tail -10 || node --experimental-strip-types prisma/seed.ts 2>&1 | tail -10 || true
  node scripts/seed-demo-data.mjs 2>&1 | tail -5 || true
' || warn "seed skipped — manual run may be needed"

# ---- 13. Nginx vhost ----
info "Configuring nginx reverse proxy..."
cat > /etc/nginx/sites-available/gluhoman <<'NGINX'
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name _;

  client_max_body_size 10M;

  access_log /var/log/nginx/gluhoman-access.log;
  error_log  /var/log/nginx/gluhoman-error.log warn;

  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

  location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, immutable, max-age=31536000" always;
    proxy_set_header Host $host;
  }

  location ~* ^/(images|videos|og-.*\.jpg|favicon\.ico|logo\.svg|logo\.png)/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache_valid 200 7d;
    add_header Cache-Control "public, max-age=604800" always;
    proxy_set_header Host $host;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 60s;
  }
}
NGINX

ln -sf /etc/nginx/sites-available/gluhoman /etc/nginx/sites-enabled/gluhoman
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
ok "nginx configured"

# ---- 14. fail2ban ----
systemctl enable --now fail2ban >/dev/null 2>&1 || true
ok "fail2ban active"

# ---- 15. Status ----
info "Final status..."
docker compose -f docker-compose.prod.yml ps
echo
sleep 2
HTTP_CODE=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1/ || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  ok "Сайт доступний: http://72.60.16.73/"
else
  warn "HTTP $HTTP_CODE — перевір логи: docker compose -f $APP_DIR/docker-compose.prod.yml logs -f site"
fi

echo
echo "============================"
echo " Глухомань deployed"
echo "============================"
echo "URL:   http://72.60.16.73/"
echo "Admin: http://72.60.16.73/admin/login"
echo "Env:   $APP_DIR/.env (ADMIN_EMAIL, ADMIN_PASSWORD)"
echo "Logs:  docker compose -f $APP_DIR/docker-compose.prod.yml logs -f"
