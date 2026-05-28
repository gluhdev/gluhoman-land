#!/usr/bin/env node
/**
 * Pre-warm Next.js image optimizer cache by loading every page fully in a
 * headless browser. Fixes the cold-cache 15-30s first-visit problem on the
 * 2-CPU VPS where AVIF/WebP variants are encoded lazily on first request.
 *
 * Usage:  node scripts/warm-cache.mjs [base_url]
 */
import { chromium, devices } from 'playwright';

const BASE = process.argv[2] || 'https://gluhoman.maxautomate.ai';

const ROUTES = [
  '/',
  '/hotel', '/hotel/aquapark', '/hotel/central', '/hotel/brewery',
  '/cottages', '/conference-hall',
  '/sauna', '/aquapark', '/restaurant', '/menu', '/gallery',
  '/en', '/en/hotel', '/en/hotel/aquapark', '/en/hotel/central', '/en/hotel/brewery',
  '/en/cottages', '/en/conference-hall',
  '/en/sauna', '/en/aquapark', '/en/restaurant',
];

console.log(`Warming image optimizer cache against ${BASE}`);
console.log(`(${ROUTES.length} routes × 2 viewports)\n`);

const browser = await chromium.launch({ headless: true });

for (const vpName of ['desktop', 'mobile']) {
  const vp = vpName === 'desktop'
    ? { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
    : devices['iPhone 13'];
  const ctx = await browser.newContext({ ...vp, ignoreHTTPSErrors: true });
  console.log(`── ${vpName} ──`);
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const start = Date.now();
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    } catch (e) {
      console.log(`  ✗ ${route}: ${e.message.slice(0, 80)}`);
      await page.close();
      continue;
    }
    const ms = Date.now() - start;
    console.log(`  ${ms.toString().padStart(6)}ms  ${route}`);
    await page.close();
  }
  await ctx.close();
}

await browser.close();
console.log('\nDone.');
