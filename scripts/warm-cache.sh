#!/bin/bash
# Pre-warm Next.js page cache + image optimizer after a deploy.
#
# Hits every public route once (UK + EN) and the heaviest images so the
# on-disk optimizer cache (.next/cache/images) is populated. First real
# user hit lands on already-encoded AVIF/WebP variants instead of waiting
# 10-30s for the 2-CPU VPS to encode them in real time.
#
# Usage:  bash scripts/warm-cache.sh [base_url]
# Default base_url: http://127.0.0.1:3000 (run inside container or on host)

set -u
BASE="${1:-http://127.0.0.1:3000}"

ROUTES=(
  "/"
  "/hotel" "/hotel/aquapark" "/hotel/central" "/hotel/brewery"
  "/cottages" "/conference-hall"
  "/sauna" "/aquapark" "/restaurant" "/menu" "/gallery"
  "/privacy" "/terms"
  "/en" "/en/hotel" "/en/hotel/aquapark" "/en/hotel/central" "/en/hotel/brewery"
  "/en/cottages" "/en/conference-hall"
  "/en/sauna" "/en/aquapark" "/en/restaurant" "/en/menu" "/en/gallery"
  "/admin/login"
)

echo "Warming ${#ROUTES[@]} routes against $BASE ..."
total_start=$(date +%s)
for path in "${ROUTES[@]}"; do
  start=$(date +%s%N)
  code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 90 -L "$BASE$path" 2>/dev/null || echo "000")
  end=$(date +%s%N)
  ms=$(( (end - start) / 1000000 ))
  printf "  %-3s  %6sms  %s\n" "$code" "$ms" "$path"
done
total_end=$(date +%s)
echo "Done in $((total_end - total_start))s"
