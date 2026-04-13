#!/bin/bash
# SSH hardening для Глухомань VPS.
# Ідемпотентний: використовує маркер "# gluhoman-bootstrap" у sshd_config.

set -euo pipefail

DRY_RUN=false
[ "${1:-}" = "--dry-run" ] && DRY_RUN=true

run() { $DRY_RUN && echo "  [dry-run] $*" || eval "$@"; }

CONFIG=/etc/ssh/sshd_config
MARKER="# gluhoman-bootstrap"

[ -f "$CONFIG" ] || { echo "❌ $CONFIG не знайдено"; exit 1; }

# Backup once
if [ ! -f "${CONFIG}.bak.gluhoman" ]; then
  run "cp $CONFIG ${CONFIG}.bak.gluhoman"
  echo "✓ Створено backup: ${CONFIG}.bak.gluhoman"
fi

# Append hardening block only if marker not present
if grep -q "$MARKER" "$CONFIG"; then
  echo "✓ SSH hardening вже застосовано (маркер знайдено)"
else
  if $DRY_RUN; then
    echo "  [dry-run] Додати hardening block до $CONFIG"
  else
    cat >> "$CONFIG" <<EOF

$MARKER
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
EOF
  fi
  echo "✓ SSH hardening додано"
fi

run "sshd -t"
run "systemctl reload ssh || systemctl reload sshd"
echo "✓ SSH перезавантажено з новою конфігурацією"
