import { webkit, chromium } from 'playwright';

async function test(name, launcher) {
  const browser = await launcher.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const initial = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(720, 450);
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(150);
  }
  const after = await page.evaluate(() => window.scrollY);
  const css = await page.evaluate(() => ({
    htmlWebkit: getComputedStyle(document.documentElement).getPropertyValue('-webkit-overflow-scrolling'),
    bodyWebkit: getComputedStyle(document.body).getPropertyValue('-webkit-overflow-scrolling'),
  }));
  console.log(`[${name}] initial=${initial} after5xwheel=${after} ${after > 500 ? '✓' : '✗'}  webkit-overflow-scrolling: html="${css.htmlWebkit}" body="${css.bodyWebkit}"`);
  await browser.close();
}

await test('chromium', chromium);
await test('webkit (Safari engine)', webkit);
