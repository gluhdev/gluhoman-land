#!/bin/bash
# Глухомань VPS bootstrap — Ubuntu 24.04 LTS
# Ідемпотентний скрипт первинного налаштування сервера.
# Usage:
#   sudo ./vps-bootstrap.sh [--user=NAME] [--dry-run]

set -euo pipefail

# ---- colors ----
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
BLUE='\033[1;34m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $*"; }
info() { echo -e "${BLUE}ℹ${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC} $*"; }
die()  { echo -e "${RED}✗${NC} $*" >&2; exit 1; }

# ---- args ----
OPERATOR="gluhoman"
DRY_RUN=false
for arg in "$@"; do
  case $arg in
    --user=*) OPERATOR="${arg#*=}" ;;
    --dry-run) DRY_RUN=true ;;
    *) die "Невідомий аргумент: $arg" ;;
  esac
done

run() {
  if $DRY_RUN; then
    echo "  [dry-run] $*"
  else
    eval "$@"
  fi
}

# ---- sanity checks ----
[ "$(id -u)" -eq 0 ] || die "Запускайте як root: sudo $0"
. /etc/os-release
[ "$ID" = "ubuntu" ] || die "Скрипт підтримує тільки Ubuntu. Знайдено: $ID"
info "Виявлено Ubuntu $VERSION_ID"

# ---- 1. update apt ----
info "Оновлюємо список пакетів..."
run "apt-get update -qq"
run "DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq"
ok "apt оновлено"

# ---- 2. essentials ----
info "Встановлюємо базові пакети..."
PACKAGES="curl wget git ufw fail2ban htop nano unzip cron ca-certificates gnupg lsb-release unattended-upgrades"
run "DEBIAN_FRONTEND=noninteractive apt-get install -y -qq $PACKAGES"
ok "Базові пакети встановлено"

# ---- 3. timezone ----
info "Налаштовуємо таймзону Europe/Kyiv..."
run "timedatectl set-timezone Europe/Kyiv"
ok "Таймзона: $(timedatectl show --property=Timezone --value || echo Europe/Kyiv)"

# ---- 4. docker ----
if command -v docker >/dev/null 2>&1; then
  ok "Docker вже встановлено: $(docker --version)"
else
  info "Встановлюємо Docker CE..."
  run "install -m 0755 -d /etc/apt/keyrings"
  run "curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc"
  run "chmod a+r /etc/apt/keyrings/docker.asc"
  run 'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" > /etc/apt/sources.list.d/docker.list'
  run "apt-get update -qq"
  run "apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin"
  run "systemctl enable --now docker"
  ok "Docker встановлено"
fi

# ---- 5. operator user ----
if id "$OPERATOR" >/dev/null 2>&1; then
  ok "Користувач $OPERATOR вже існує"
else
  info "Створюємо користувача $OPERATOR..."
  run "useradd -m -s /bin/bash -G sudo $OPERATOR"
  run "passwd -l $OPERATOR"  # lock password, force key-only
  ok "Користувач $OPERATOR створений (пароль заблоковано, лише SSH ключ)"
fi
run "usermod -aG docker $OPERATOR"
ok "$OPERATOR доданий до групи docker"

# ---- 6. ssh hardening ----
SSH_KEY_DIR="/home/$OPERATOR/.ssh"
if [ ! -s "$SSH_KEY_DIR/authorized_keys" ]; then
  warn "У $OPERATOR немає SSH ключа ($SSH_KEY_DIR/authorized_keys)."
  warn "Додайте ключ ПЕРЕД вимкненням парольного входу:"
  warn "  mkdir -p $SSH_KEY_DIR && chmod 700 $SSH_KEY_DIR"
  warn "  nano $SSH_KEY_DIR/authorized_keys"
  warn "  chown -R $OPERATOR:$OPERATOR $SSH_KEY_DIR"
  warn "  chmod 600 $SSH_KEY_DIR/authorized_keys"
  warn "Пропускаємо SSH hardening — запустіть скрипт повторно після додавання ключа."
else
  bash "$(dirname "$0")/setup-ssh-hardening.sh" ${DRY_RUN:+--dry-run}
fi

# ---- 7. firewall ----
bash "$(dirname "$0")/setup-firewall.sh" ${DRY_RUN:+--dry-run}

# ---- 8. fail2ban ----
info "Активуємо fail2ban..."
run "systemctl enable --now fail2ban"
ok "fail2ban працює"

# ---- 9. nginx + certbot ----
if command -v nginx >/dev/null 2>&1; then
  ok "nginx вже встановлено"
else
  info "Встановлюємо nginx + certbot..."
  run "apt-get install -y -qq nginx certbot python3-certbot-nginx"
  run "systemctl enable --now nginx"
  ok "nginx + certbot встановлено"
fi

# ---- 10. /opt/gluhoman ----
info "Створюємо /opt/gluhoman..."
run "mkdir -p /opt/gluhoman /opt/gluhoman/backups"
run "chown -R $OPERATOR:$OPERATOR /opt/gluhoman"
ok "/opt/gluhoman готовий (owner: $OPERATOR)"

# ---- 11. unattended-upgrades ----
info "Налаштовуємо автооновлення безпеки..."
run "dpkg-reconfigure -f noninteractive unattended-upgrades"
ok "Unattended upgrades активні"

# ---- next steps ----
echo
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}   Сервер готовий до деплою Глухомань${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo
echo "Наступні кроки (виконати як користувач $OPERATOR):"
echo
echo "  1. Підключитись: ssh $OPERATOR@<server-ip>"
echo
echo "  2. Клонувати репозиторій:"
echo "     cd /opt/gluhoman"
echo "     git clone <REPO_URL> ."
echo
echo "  3. Заповнити .env:"
echo "     cp .env.example .env"
echo "     nano .env  # POSTGRES_PASSWORD, TELEGRAM_BOT_TOKEN, ..."
echo "     # Згенерувати пароль: openssl rand -base64 32"
echo
echo "  4. Запустити стек:"
echo "     docker compose -f docker-compose.prod.yml up -d"
echo "     docker compose -f docker-compose.prod.yml exec site npx prisma migrate deploy --schema=prisma/schema.postgres.prisma"
echo
echo "  5. Налаштувати nginx + HTTPS:"
echo "     sudo cp scripts/nginx-gluhoman.conf /etc/nginx/sites-available/gluhoman"
echo "     sudo ln -sf ../sites-available/gluhoman /etc/nginx/sites-enabled/"
echo "     sudo rm -f /etc/nginx/sites-enabled/default"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo "     sudo certbot --nginx -d gluhoman.com.ua -d www.gluhoman.com.ua"
echo
echo "  6. Налаштувати щоденні бекапи БД:"
echo "     (crontab -l 2>/dev/null; echo '0 3 * * * cd /opt/gluhoman && docker compose -f docker-compose.prod.yml --profile backup run --rm backup') | crontab -"
echo
echo "Докладніше: docs/VPS-SETUP.md та docs/PRODUCTION.md"
