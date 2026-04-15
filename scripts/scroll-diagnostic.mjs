import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleLines = [];
page.on('console', (msg) => consoleLines.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => consoleLines.push(`[error] ${err.message}`));

console.log('==> GET http://localhost:3000/');
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);

// 1. Build marker check
console.log('\n--- 1. BUILD MARKER (console logs from page) ---');
const marker = consoleLines.filter((l) => l.includes('gluhoman build'));
console.log(marker.length ? marker.join('\n') : '❌ no build marker in console');

// 2. CSS state on html/body
console.log('\n--- 2. COMPUTED CSS ---');
const css = await page.evaluate(() => {
  const h = getComputedStyle(document.documentElement);
  const b = getComputedStyle(document.body);
  return {
    html: { height: h.height, overflow: h.overflow, overflowY: h.overflowY },
    body: { height: b.height, overflow: b.overflow, overflowY: b.overflowY },
    scrollingElement: document.scrollingElement?.tagName,
    docScrollHeight: document.documentElement.scrollHeight,
    docClientHeight: document.documentElement.clientHeight,
  };
});
console.log(JSON.stringify(css, null, 2));

// 3. Initial scroll state
console.log('\n--- 3. INITIAL SCROLL ---');
const initialScroll = await page.evaluate(() => window.scrollY);
console.log(`scrollY on load: ${initialScroll}`);

// 4. Programmatic scroll
console.log('\n--- 4. window.scrollTo(0, 500) ---');
await page.evaluate(() => window.scrollTo(0, 500));
await page.waitForTimeout(200);
const progScroll = await page.evaluate(() => window.scrollY);
console.log(`scrollY after scrollTo: ${progScroll} ${progScroll === 500 ? '✓' : '✗'}`);

// 5. Mouse wheel scroll — 5 events, 200px each
console.log('\n--- 5. MOUSE WHEEL x5 (200px each) ---');
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(100);
await page.mouse.move(720, 450);
for (let i = 1; i <= 5; i++) {
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => window.scrollY);
  const ok = after > before ? '✓' : '✗';
  console.log(`  wheel #${i}: ${before} -> ${after} (delta ${after - before}) ${ok}`);
}

const final = await page.evaluate(() => window.scrollY);
console.log(`\nFINAL scrollY after 5x wheel: ${final}`);

if (final >= 800) {
  console.log('\n✅ VERDICT: desktop wheel scroll WORKS. Code is fine.');
} else {
  console.log('\n❌ VERDICT: scroll is broken in the headless browser too.');
}

await browser.close();
