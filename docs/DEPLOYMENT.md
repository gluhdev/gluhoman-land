# Деплой Глухомань — self-hosted

Сайт **не використовує Vercel**. Готується до повного self-hosted деплою (VPS / Docker / Kubernetes), щоб у майбутньому додавати власні backend-сервіси: бронювання, оплати, інтеграції з 1С/CRM тощо.

---

## Архітектура

```
┌────────────────┐
│  Cloudflare /  │   HTTPS, кеш статики, DDoS захист
│  Reverse proxy │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  Nginx (host)  │   80/443 → 3000, certbot, gzip
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  Next.js 15    │   server.js (standalone), port 3000
│  (Docker)      │   API routes, server actions
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  Telegram bot  │   notifications для заявок
│  Resend (SMTP) │   email-канал для заявок
│  PostgreSQL    │   майбутнє — бронювання/оплати
└────────────────┘
```

---

## Швидкий старт (Docker)

### 1. Підготовка сервера

Потрібен VPS з Ubuntu 22.04+ або інший Linux з Docker:

```bash
# Встановити Docker + compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Перезайдіть у SSH
docker compose version  # перевірити
```

### 2. Клонування репо

```bash
cd /opt
sudo git clone <repository-url> gluhoman
sudo chown -R $USER:$USER gluhoman
cd gluhoman
```

### 3. Створити `.env`

```bash
cp .env.example .env
nano .env
```

Заповніть мінімум:
```
NEXT_PUBLIC_SITE_URL=https://gluhoman.com.ua
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

### 4. Запуск

```bash
docker compose up -d --build
docker compose logs -f
```

Сайт працює на `http://<server-ip>:3000`.

### 5. Nginx + HTTPS

Створіть `/etc/nginx/sites-available/gluhoman`:

```nginx
server {
    listen 80;
    server_name gluhoman.com.ua www.gluhoman.com.ua;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name gluhoman.com.ua www.gluhoman.com.ua;

    ssl_certificate /etc/letsencrypt/live/gluhoman.com.ua/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gluhoman.com.ua/privkey.pem;

    # Кеш статики Next.js (хешовані файли)
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    # Кеш зображень
    location /images/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # Все інше — на Next
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

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript application/octet-stream image/svg+xml;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/gluhoman /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d gluhoman.com.ua -d www.gluhoman.com.ua
```

---

## Оновлення (deploy)

```bash
cd /opt/gluhoman
git pull
docker compose up -d --build
docker compose logs -f gluhoman
```

Healthcheck автоматично перевіряє сайт кожні 30 секунд.

---

## Без Docker (PM2 / systemd)

Якщо Docker не варіант:

```bash
cd /opt/gluhoman
npm ci
npm run build

# Запуск standalone-сервера
NODE_ENV=production \
PORT=3000 \
TELEGRAM_BOT_TOKEN=... \
TELEGRAM_CHAT_ID=... \
NEXT_PUBLIC_SITE_URL=https://gluhoman.com.ua \
node .next/standalone/server.js
```

Або через PM2:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

(Див. `ecosystem.config.js` — створити окремо при потребі.)

---

## Майбутні розширення

Self-hosted підхід було обрано саме щоб додавати:
- **Бронювання** з власною БД (PostgreSQL + Prisma)
- **Оплати** через LiqPay/Stripe — server actions з webhooks
- **Адмінка** для управління кімнатами, цінами, бронюваннями
- **Інтеграція з 1С** через REST/SOAP
- **Email-розсилки** через Resend (вже налаштовано як другий канал для заявок)

Vercel мав би обмеження на тривалі server actions, vendor lock-in, неможливість керувати БД. Тому self-hosted.

---

## Моніторинг

Рекомендовано на старті:
- **Uptime Kuma** (Docker, безкоштовно) для моніторингу `/` + `/sitemap.xml`
- **Vercel-style logs**: `docker compose logs -f gluhoman | tee -a /var/log/gluhoman.log`
- **Sentry** (опц.) для помилок — додати після продакшен-релізу

---

## Резервне копіювання

Що бекапити:
- `/opt/gluhoman/.env` (credentials)
- Майбутній PostgreSQL dump (коли з'явиться БД)
- Користувацькі завантаження (поки немає)

`/opt/gluhoman/public/images/` зберігаються в git (105+ фото) — окремий бекап не потрібен.
