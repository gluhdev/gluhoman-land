#!/usr/bin/env node
/**
 * Full Playwright audit — mobile + desktop, every route.
 *
 * For each page captures:
 *   - HTTP status of the navigation
 *   - Console errors / warnings
 *   - Failed network requests
 *   - Broken/missing images
 *   - Presence of <h1>, <header>, <footer>
 *   - Screenshot (.playwright-audit/<viewport>-<slug>.png)
 *
 * Writes a JSON+console summary at the end.
 */
import { chromium, devices } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.AUDIT_BASE_URL || 'https://gluhoman.maxautomate.ai';

const PUBLIC_ROUTES = [
  '/',
  '/hotel',
  '/hotel/aquapark',
  '/hotel/central',
  '/hotel/brewery',
  '/cottages',
  '/conference-hall',
  '/sauna',
  '/aquapark',
  '/restaurant',
  '/menu',
  '/gallery',
  '/privacy',
  '/terms',
];

const EN_ROUTES = PUBLIC_ROUTES.map((p) => `/en${p === '/' ? '' : p}`);
const ADMIN_ROUTES = [
  '/admin/login',
  '/admin', // expects redirect to /admin/login when unauthed
];

const ALL_ROUTES = [...PUBLIC_ROUTES, ...EN_ROUTES, ...ADMIN_ROUTES];

const VIEWPORTS = [
  { name: 'desktop', device: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  { name: 'mobile', device: devices['iPhone 13'] },
];

const OUT_DIR = '.playwright-audit';
mkdirSync(OUT_DIR, { recursive: true });

function slugify(p) {
  return p.replace(/^\//, '').replace(/\//g, '_') || 'root';
}

async function auditViewport(vp) {
  console.log(`\n══════════════════════════════════════════════════════`);
  console.log(`▶ Viewport: ${vp.name} (${vp.device.viewport.width}×${vp.device.viewport.height})`);
  console.log(`══════════════════════════════════════════════════════`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...vp.device, ignoreHTTPSErrors: true });
  const results = [];

  for (const route of ALL_ROUTES) {
    const page = await context.newPage();
    const consoleErrors = [];
    const consoleWarnings = [];
    const failedRequests = [];
    const brokenImages = [];

    page.on('console', (msg) => {
      const type = msg.type();
      if (type === 'error') consoleErrors.push(msg.text().slice(0, 240));
      else if (type === 'warning') consoleWarnings.push(msg.text().slice(0, 240));
    });
    page.on('requestfailed', (req) => {
      failedRequests.push({
        url: req.url().slice(0, 180),
        method: req.method(),
        error: req.failure()?.errorText,
      });
    });
    page.on('response', (resp) => {
      const url = resp.url();
      const isImg = /\.(jpg|jpeg|png|webp|avif|svg)(\?|$)/i.test(url) || resp.headers()['content-type']?.startsWith('image/');
      if (isImg && resp.status() >= 400) {
        brokenImages.push({ url: url.slice(0, 180), status: resp.status() });
      }
    });

    const start = Date.now();
    let navStatus = 0;
    let title = '';
    let h1 = '';
    let hasHeader = false;
    let hasFooter = false;
    let error = null;

    try {
      const resp = await page.goto(`${BASE}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      navStatus = resp ? resp.status() : 0;
      // Settle: wait briefly for client-side hydration + key elements
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      title = await page.title().catch(() => '');
      h1 = await page.locator('h1').first().textContent().catch(() => '');
      hasHeader = await page.locator('header').count().then((n) => n > 0).catch(() => false);
      hasFooter = await page.locator('footer').count().then((n) => n > 0).catch(() => false);

      // Screenshot
      const slug = slugify(route);
      const file = `${OUT_DIR}/${vp.name}-${slug}.png`;
      await page.screenshot({ path: file, fullPage: false });
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    const elapsed = Date.now() - start;
    const result = {
      viewport: vp.name,
      route,
      navStatus,
      elapsed,
      title: title?.trim().slice(0, 80),
      h1: h1?.trim().slice(0, 80),
      hasHeader,
      hasFooter,
      consoleErrors: consoleErrors.length,
      consoleErrorSamples: consoleErrors.slice(0, 3),
      consoleWarnings: consoleWarnings.length,
      failedRequests: failedRequests.length,
      failedRequestSamples: failedRequests.slice(0, 3),
      brokenImages: brokenImages.length,
      brokenImageSamples: brokenImages.slice(0, 3),
      error,
    };
    results.push(result);

    const flags = [];
    if (navStatus >= 400 || navStatus === 0) flags.push(`HTTP_${navStatus || 'X'}`);
    if (error) flags.push('THREW');
    if (consoleErrors.length) flags.push(`${consoleErrors.length}_console_err`);
    if (failedRequests.length) flags.push(`${failedRequests.length}_req_fail`);
    if (brokenImages.length) flags.push(`${brokenImages.length}_img_404`);
    if (!hasHeader && !route.startsWith('/admin')) flags.push('no_header');
    if (!hasFooter && !route.startsWith('/admin')) flags.push('no_footer');

    const flagStr = flags.length ? ` ✗ ${flags.join(' · ')}` : ' ✓';
    console.log(`  ${navStatus || '---'}  ${(elapsed + 'ms').padStart(6)}  ${route.padEnd(28)}${flagStr}`);

    await page.close();
  }

  await context.close();
  await browser.close();

  return results;
}

const all = [];
for (const vp of VIEWPORTS) {
  const r = await auditViewport(vp);
  all.push(...r);
}

// Summary
console.log(`\n══════════════════════════════════════════════════════`);
console.log(`SUMMARY`);
console.log(`══════════════════════════════════════════════════════`);
const counts = {
  total: all.length,
  badStatus: all.filter((r) => r.navStatus >= 400 || r.navStatus === 0).length,
  threw: all.filter((r) => r.error).length,
  withConsoleErr: all.filter((r) => r.consoleErrors > 0).length,
  withReqFail: all.filter((r) => r.failedRequests > 0).length,
  withImg404: all.filter((r) => r.brokenImages > 0).length,
};
for (const [k, v] of Object.entries(counts)) {
  console.log(`  ${k.padEnd(20)} ${v}`);
}

writeFileSync(`${OUT_DIR}/report.json`, JSON.stringify({ base: BASE, results: all, counts }, null, 2));
console.log(`\nFull JSON: ${OUT_DIR}/report.json`);
console.log(`Screenshots: ${OUT_DIR}/<viewport>-<slug>.png (${all.length} total)`);

// Exit non-zero if any hard fails
const hardFails = counts.badStatus + counts.threw;
process.exit(hardFails > 0 ? 1 : 0);
