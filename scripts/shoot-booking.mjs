import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'https://gluhoman.maxautomate.ai';
const OUT = '.playwright-audit';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ headless: true });

for (const [vp, dev] of [
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['mobile', devices['iPhone 13']],
]) {
  const ctx = await b.newContext({ ...dev, ignoreHTTPSErrors: true });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.evaluate(() => window.dispatchEvent(new CustomEvent('gluhoman:booking:open', { detail: { service: 'hotel' } })));
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/bk-${vp}-1a-picker.png` });

  // pick Central tab then a room
  await p.locator('button:has-text("Центральний")').first().click().catch(() => {});
  await p.waitForTimeout(500);
  await p.locator('button:has(img)').filter({ hasText: /Люкс|Стандарт|Однокімнатний/ }).first().click().catch(() => {});
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/bk-${vp}-1b-room.png` });

  // go to step 2
  await p.locator('button:has-text("Далі")').first().click().catch(() => {});
  await p.waitForTimeout(1000);
  await p.screenshot({ path: `${OUT}/bk-${vp}-2-contacts.png` });

  await ctx.close();
  console.log(`${vp} done`);
}
await b.close();
console.log('DONE');
