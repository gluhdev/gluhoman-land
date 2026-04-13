# Налаштування VPS — Глухомань

Крок-за-кроком інструкція для розгортання сайту на свіжому VPS (Hostinger KVM 2 або аналог).

---

## 1. Купівля VPS

**Рекомендація:** Hostinger **KVM 2** — $8.99/місяць (intro, 24-місячний контракт).

При замовленні:
- **OS:** Ubuntu 24.04 LTS
- **Datacenter:** Lithuania (Каунас) — найближче до України, latency ~20-30 мс
- **Hostname:** `gluhoman-prod` (або будь-який)

Після покупки в панелі Hostinger:
1. Знайдіть VPS → Settings → **SSH Keys**
2. Додайте ваш публічний SSH ключ (`~/.ssh/id_ed25519.pub` або `~/.ssh/id_rsa.pub`)
3. Якщо ключа немає — згенеруйте: `ssh-keygen -t ed25519 -C "your@email"`

---

## 2. Перший SSH вхід

```bash
ssh root@<server-ip>
```

Переконайтесь що вхід проходить БЕЗ пароля (за ключем).

---

## 3. Bootstrap сервера

Скрипт `vps-bootstrap.sh` зробить все за одну команду:

- Оновить систему та пакети
- Встановить Docker + Docker Compose
- Створить користувача `gluhoman` (без паролю, лише ключ)
- Hardening SSH (вимикає root login + паролі, після додавання ключа)
- UFW firewall (22, 80, 443)
- fail2ban проти brute-force
- nginx + certbot
- `/opt/gluhoman` директорія
- Timezone Europe/Kyiv
- Автоматичні оновлення безпеки

### Запуск (з root SSH):

```bash
# Клонуємо репо щоб отримати скрипти
apt-get update && apt-get install -y git
git clone https://github.com/<OWNER>/<REPO>.git /opt/gluhoman
cd /opt/gluhoman

# Запускаємо bootstrap
sudo bash scripts/vps-bootstrap.sh
```

### Додаємо SSH ключ для користувача gluhoman

Перед тим як SSH hardening відріже парольний вхід, треба скопіювати ваш ключ для нового користувача:

```bash
mkdir -p /home/gluhoman/.ssh
cp /root/.ssh/authorized_keys /home/gluhoman/.ssh/authorized_keys
chown -R gluhoman:gluhoman /home/gluhoman/.ssh
chmod 700 /home/gluhoman/.ssh
chmod 600 /home/gluhoman/.ssh/authorized_keys
```

Потім **перевірте** що ви можете увійти як gluhoman з **ДРУГОГО термінала** (не закриваючи поточний):

```bash
ssh gluhoman@<server-ip>
```

Якщо вхід успішний — повторно запустіть bootstrap для SSH hardening:

```bash
sudo bash scripts/vps-bootstrap.sh
```

Тепер root SSH вхід заблоковано, все робиться через `gluhoman`.

---

## 4. DNS — направити домен

В реєстраторі (або Cloudflare) додайте A-записи:

```
gluhoman.com.ua     →  <server-ip>
www.gluhoman.com.ua →  <server-ip>
```

TTL 300-3600 секунд. Розповсюдження зазвичай 5-60 хвилин.

### Cloudflare (рекомендовано, безкоштовно)

1. Додайте домен до Cloudflare → NS записи в реєстраторі замініть на Cloudflare
2. A-записи обидва з **orange cloud ON** (proxy через Cloudflare = DDoS + кеш + SSL)
3. SSL/TLS режим → **Full (strict)** — після отримання Let's Encrypt сертифіката

---

## 5. Конфігурація `.env`

Увійдіть як `gluhoman`, зайдіть в `/opt/gluhoman`:

```bash
cp .env.example .env
nano .env
```

Обов'язково заповніть:

```
NEXT_PUBLIC_SITE_URL=https://gluhoman.com.ua
POSTGRES_PASSWORD=<openssl rand -base64 32>
TELEGRAM_BOT_TOKEN=<from BotFather>
TELEGRAM_CHAT_ID=<admin chat id>
```

Опціональні канали доставки заявок (email як дубль Telegram):
```
RESEND_API_KEY=
BOOKING_EMAIL_FROM=
BOOKING_EMAIL_TO=
```

---

## 6. Запуск продакшену

```bash
cd /opt/gluhoman
docker compose -f docker-compose.prod.yml up -d
```

Дочекайтесь `healthy` статусу (30-60 секунд для першого запуску):

```bash
docker compose -f docker-compose.prod.yml ps
```

### Застосувати міграції БД

```bash
docker compose -f docker-compose.prod.yml exec site \
  npx prisma migrate deploy --schema=prisma/schema.postgres.prisma
```

### Перевірити локально

```bash
curl -I http://127.0.0.1:3000
# HTTP/1.1 200 OK
```

---

## 7. Nginx + HTTPS

```bash
sudo cp scripts/nginx-gluhoman.conf /etc/nginx/sites-available/gluhoman
sudo ln -sf ../sites-available/gluhoman /etc/nginx/sites-enabled/gluhoman
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Потім certbot:

```bash
sudo certbot --nginx -d gluhoman.com.ua -d www.gluhoman.com.ua
```

Certbot автоматично оновить nginx.conf і налаштує auto-renewal через systemd timer.

---

## 8. Бекапи

Ручний бекап:

```bash
cd /opt/gluhoman
docker compose -f docker-compose.prod.yml --profile backup run --rm backup
ls backups/
```

Автоматичний щоденний бекап о 3:00:

```bash
(crontab -l 2>/dev/null; echo '0 3 * * * cd /opt/gluhoman && docker compose -f docker-compose.prod.yml --profile backup run --rm backup >> /var/log/gluhoman-backup.log 2>&1') | crontab -
```

Retention: 7 днів (старі автоматично видаляються).

### Копіювання бекапів поза VPS (рекомендується)

Налаштуйте `rsync` або `rclone` для відправки в Backblaze B2 / S3 / другий сервер:

```bash
# приклад rclone з B2
rclone sync /opt/gluhoman/backups b2:gluhoman-backups --progress
```

---

## 9. Моніторинг

### Статус контейнерів
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f site
docker compose -f docker-compose.prod.yml logs -f postgres
```

### Ресурси системи
```bash
htop
df -h
free -h
```

### Uptime monitoring (опціонально, безкоштовно)

Рекомендовано:
- **Uptime Kuma** — self-hosted, Docker, ~50 MB RAM
- **Better Uptime** — SaaS free tier, пінг кожні 30 сек

---

## 10. Оновлення сайту

```bash
cd /opt/gluhoman
git pull
docker compose -f docker-compose.prod.yml build site
docker compose -f docker-compose.prod.yml up -d site
docker compose -f docker-compose.prod.yml exec site \
  npx prisma migrate deploy --schema=prisma/schema.postgres.prisma
```

Zero-downtime: Docker запускає новий контейнер, healthcheck перевіряє → перемикає трафік → зупиняє старий. Даунтайм ~5 секунд максимум.

---

## 11. Відкат деплою

Якщо щось зламалось:

```bash
# Повернутися на попередній git commit
cd /opt/gluhoman
git log --oneline -5  # знайти комміт
git checkout <commit-sha>
docker compose -f docker-compose.prod.yml build site
docker compose -f docker-compose.prod.yml up -d site
```

Якщо зламана БД — restore з останнього бекапу:

```bash
./scripts/restore-postgres.sh ./backups/gluhoman-<timestamp>.dump
```

---

## Що НЕ робити

- ❌ **Не редагувати iptables напряму** — використовуйте `ufw`
- ❌ **Не встановлювати Docker через snap** — тільки офіційний репо (bootstrap це робить)
- ❌ **Не вимикати fail2ban** без заміни
- ❌ **Не зберігати .env у git** — перевірте `.gitignore`
- ❌ **Не відкривати 5432 (Postgres) у UFW** — доступ тільки всередині Docker мережі
- ❌ **Не коммітити `backups/`** — вони великі і містять дані

---

## Troubleshooting

### nginx каже "bad gateway"
```bash
docker compose -f docker-compose.prod.yml ps
# якщо site не healthy:
docker compose -f docker-compose.prod.yml logs site
```

### Postgres не стартує
```bash
docker compose -f docker-compose.prod.yml logs postgres
# перевірити POSTGRES_PASSWORD в .env, перевірити права на volume
```

### Certbot падає
- DNS ще не поширився → почекати 5-30 хв
- UFW блокує 80 → `sudo ufw status`
- nginx не слухає 80 → `sudo nginx -t && sudo systemctl reload nginx`

### Site повертає 500 але контейнер healthy
```bash
docker compose -f docker-compose.prod.yml exec site sh
# всередині:
printenv | grep DATABASE_URL
npx prisma migrate status
```

---

## Безпека — чеклист

- [x] Root SSH login заблокований
- [x] Парольний вхід заблокований (лише SSH ключ)
- [x] UFW: deny default, allow 22/80/443
- [x] fail2ban активний
- [x] Unattended security upgrades
- [x] Docker containers run as non-root users
- [x] Postgres не відкритий назовні (тільки docker network)
- [x] .env не в git
- [x] HTTPS-only (HSTS header)
- [x] Security headers (X-Frame-Options, CSP, etc.)
- [ ] Rate limiting на /api/ (в nginx config — перевірити)
- [ ] Backup копіюється поза VPS (налаштуйте rclone)
- [ ] Моніторинг з алертами (Uptime Kuma або SaaS)
