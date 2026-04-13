#!/bin/bash
# UFW firewall setup для Глухомань VPS.
# Ідемпотентний.

set -euo pipefail

DRY_RUN=false
[ "${1:-}" = "--dry-run" ] && DRY_RUN=true

run() { $DRY_RUN && echo "  [dry-run] $*" || eval "$@"; }

command -v ufw >/dev/null || { echo "❌ ufw не встановлено"; exit 1; }

run "ufw --force reset"
run "ufw default deny incoming"
run "ufw default allow outgoing"
run "ufw allow 22/tcp comment 'SSH'"
run "ufw allow 80/tcp comment 'HTTP'"
run "ufw allow 443/tcp comment 'HTTPS'"
run "ufw --force enable"

echo "✓ UFW активний. Дозволено: SSH, HTTP, HTTPS"
$DRY_RUN || ufw status
