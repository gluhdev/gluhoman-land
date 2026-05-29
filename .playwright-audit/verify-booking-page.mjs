import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const OUT = ".playwright-audit";

const run = async () => {
  const browser = await chromium.launch();
  const out = { consoleErrors: [] };

  // Desktop: deep-link to a specific room
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") out.consoleErrors.push(m.text()); });
  await page.goto(`${BASE}/hotel/booking?hotel=central&room=lux-balcony`, { waitUntil: "networkidle" });

  out.bodyOverflow = await page.evaluate(() => document.body.style.overflow || "(none)");
  out.htmlOverflow = await page.evaluate(() => document.documentElement.style.overflow || "(none)");
  out.roomCards = await page.locator('[id^="room-"]').count();
  out.hotelTabs = await page.getByRole("button", { name: /Готель|Аквапарк|Броварн|Будиночк/i }).count();
  await page.screenshot({ path: `${OUT}/verify-rooms-desktop.png`, fullPage: true });

  // Open the date popover and pick a range
  await page.getByRole("button", { name: /Оберіть дати|–/ }).first().click().catch(() => {});
  await page.waitForTimeout(500);
  const days = page.getByRole("button", { name: /^\d{1,2}$/ });
  out.dayCells = await days.count();
  if (out.dayCells > 14) { await days.nth(8).click().catch(()=>{}); await days.nth(11).click().catch(()=>{}); }
  await page.waitForTimeout(1200); // availability fetch (debounced 300ms)
  await page.screenshot({ path: `${OUT}/verify-rooms-dates.png`, fullPage: true });
  out.urlAfterDates = page.url();

  // Open reserve on the first room
  const reserve = page.getByRole("button", { name: /^Забронювати/ }).first();
  await reserve.click().catch(() => {});
  await page.waitForTimeout(600);
  out.reserveFields = await page.getByText(/Ім'?я|Телефон/).count();
  await page.screenshot({ path: `${OUT}/verify-reserve.png`, fullPage: true });
  await ctx.close();

  // Mobile render
  const m = await browser.newContext({ viewport: { width: 390, height: 800 }, isMobile: true });
  const mp = await m.newPage();
  await mp.goto(`${BASE}/hotel/booking?hotel=central`, { waitUntil: "networkidle" });
  out.mobileBodyOverflow = await mp.evaluate(() => document.body.style.overflow || "(none)");
  await mp.screenshot({ path: `${OUT}/verify-rooms-mobile.png`, fullPage: true });
  await m.close();

  // Switching hotel via tab updates the room list (aquapark)
  const a = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const ap = await a.newPage();
  await ap.goto(`${BASE}/hotel/booking?hotel=aquapark`, { waitUntil: "networkidle" });
  out.aquaparkCards = await ap.locator('[id^="room-"]').count();
  await a.close();

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
};
run().catch((e) => { console.error("ERR", e); process.exit(1); });
