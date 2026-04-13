#!/usr/bin/env bash
# Lighthouse audit runner for gluhoman-land.
# Usage: ./scripts/lighthouse-audit.sh [base-url] [output-dir]
# Defaults: base-url=http://localhost:3011, output-dir=/tmp/lh-report
set -euo pipefail

BASE_URL="${1:-http://localhost:3011}"
OUT_DIR="${2:-/tmp/lh-report}"
mkdir -p "$OUT_DIR"

# Prefer system Chrome, fall back to Playwright's bundled Chromium.
if [ -z "${CHROME_PATH:-}" ]; then
  if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  elif [ -x "$HOME/Library/Caches/ms-playwright/chromium-1187/chrome-mac/Chromium.app/Contents/MacOS/Chromium" ]; then
    export CHROME_PATH="$HOME/Library/Caches/ms-playwright/chromium-1187/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
  fi
fi

PAGES=(
  "root:/"
  "hotel:/hotel"
  "restaurant:/restaurant"
  "menu:/menu"
  "gallery:/gallery"
)

echo "Running Lighthouse against $BASE_URL -> $OUT_DIR"
for pair in "${PAGES[@]}"; do
  name="${pair%%:*}"
  path="${pair##*:}"
  echo "== $name ($path) =="
  npx --yes lighthouse "${BASE_URL}${path}" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json \
    --output-path="${OUT_DIR}/${name}.json" \
    --chrome-flags="--headless=new --no-sandbox" \
    --preset=desktop \
    --quiet
done

# Summary table
node -e '
const fs = require("fs");
const pages = ["root","hotel","restaurant","menu","gallery"];
const cats  = ["performance","accessibility","best-practices","seo"];
const dir   = process.argv[1];
console.log("\n| Page | Perf | A11y | BP | SEO |");
console.log("|---|---|---|---|---|");
for (const p of pages) {
  const f = `${dir}/${p}.json`;
  if (!fs.existsSync(f)) { console.log(`| ${p} | - | - | - | - |`); continue; }
  const r = JSON.parse(fs.readFileSync(f,"utf8"));
  const row = cats.map(c => Math.round((r.categories[c]?.score ?? 0)*100));
  console.log(`| ${p} | ${row.join(" | ")} |`);
}' "$OUT_DIR"
