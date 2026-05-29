import { chromium } from 'playwright';

const OUT = '.playwright-audit';
const BASE = 'http://localhost:3000';

const run = async () => {
  const browser = await chromium.launch();
  const findings = {};

  // ---- DESKTOP: room page + open modal ----
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 860 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/hotel/central`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/insp-central-listing.png`, fullPage: true });

  // find the first "book" button and click it
  const bookBtn = page.getByRole('button', { name: /Забронювати|Book/i }).first();
  await bookBtn.click().catch(() => {});
  await page.waitForTimeout(1200);

  const dialog = page.getByRole('dialog');
  const hasDialog = await dialog.count();
  findings.dialogOpened = hasDialog > 0;

  if (hasDialog) {
    await page.screenshot({ path: `${OUT}/insp-modal-desktop-top.png` });

    // measure the scroll container behavior
    findings.scroll = await page.evaluate(() => {
      const dlg = document.querySelector('[role="dialog"]');
      if (!dlg) return null;
      const inner = dlg.querySelector('div');
      const bodyLocked = document.body.style.overflow;
      return {
        bodyOverflow: bodyLocked,
        dialogScrollHeight: dlg.scrollHeight,
        dialogClientHeight: dlg.clientHeight,
        dialogOverflowY: getComputedStyle(dlg).overflowY,
        scrollableInsideDialog: dlg.scrollHeight > dlg.clientHeight,
        viewportH: window.innerHeight,
      };
    });

    // try scrolling inside the dialog
    await page.mouse.move(720, 430);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/insp-modal-desktop-scrolled.png` });
  }
  await ctx.close();

  // ---- MOBILE: open modal ----
  const mctx = await browser.newContext({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  const mpage = await mctx.newPage();
  await mpage.goto(`${BASE}/hotel/central`, { waitUntil: 'networkidle' });
  const mBtn = mpage.getByRole('button', { name: /Забронювати|Book/i }).first();
  await mBtn.scrollIntoViewIfNeeded().catch(() => {});
  await mBtn.click().catch(() => {});
  await mpage.waitForTimeout(1200);
  if (await mpage.getByRole('dialog').count()) {
    await mpage.screenshot({ path: `${OUT}/insp-modal-mobile-top.png` });
    await mpage.mouse.wheel(0, 1400);
    await mpage.waitForTimeout(500);
    await mpage.screenshot({ path: `${OUT}/insp-modal-mobile-scrolled.png` });
  }
  await mctx.close();

  // ---- existing full-page BookingFlow ----
  const fctx = await browser.newContext({ viewport: { width: 1440, height: 860 } });
  const fpage = await fctx.newPage();
  const resp = await fpage.goto(`${BASE}/hotel/booking`, { waitUntil: 'networkidle' });
  findings.bookingPageStatus = resp?.status();
  await fpage.screenshot({ path: `${OUT}/insp-bookingflow-page.png`, fullPage: true });
  await fctx.close();

  await browser.close();
  console.log(JSON.stringify(findings, null, 2));
};

run().catch((e) => { console.error('ERR', e); process.exit(1); });
