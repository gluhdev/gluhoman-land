import { chromium, webkit } from 'playwright';

async function test(name, launcher) {
  const browser = await launcher.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  // Wait for Lenis to initialize (useEffect + rAF)
  await page.waitForTimeout(2000);

  // Check Lenis initialized
  const hasLenis = await page.evaluate(() => {
    // Lenis adds a 'lenis' class or data attribute to html
    return document.documentElement.classList.contains('lenis') ||
           document.documentElement.classList.contains('lenis-smooth') ||
           !!document.querySelector('[data-lenis-prevent]');
  });

  // Test wheel scroll
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.mouse.move(720, 450);

  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(200);
  }
  // Lenis animates smoothly — wait for interpolation to finish
  await page.waitForTimeout(1500);

  const scrollY = await page.evaluate(() => window.scrollY);
  const htmlClasses = await page.evaluate(() => document.documentElement.className);
  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);

  console.log(
    `[${name}] scrollY=${scrollY} ${scrollY > 300 ? '✓' : '✗'} | ` +
    `htmlClass="${htmlClasses}" | bodyOverflow="${bodyOverflow}" | ` +
    `errors=${errors.length} ${errors.length ? errors[0].slice(0, 80) : ''}`
  );

  await browser.close();
}

// Wait for dev server
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch('http://localhost:3000/', { signal: AbortSignal.timeout(2000) });
    if (res.ok) break;
  } catch { /* retry */ }
  await new Promise(r => setTimeout(r, 1000));
}

await test('chromium', chromium);
await test('webkit', webkit);
