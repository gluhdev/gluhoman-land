import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const out = {};

// 1) room-card button on /hotel/central
await p.goto(`${BASE}/hotel/central`, { waitUntil: "networkidle" });
const roomBtn = p.locator('a[href*="/hotel/booking"]').first();
out.roomCardIsLink = await roomBtn.count() > 0;
out.roomCardHref = out.roomCardIsLink ? await roomBtn.getAttribute("href") : null;

// 2) header ЗАБРОНЮВАТИ button — does it open a modal?
const headerBtn = p.getByRole("button", { name: /ЗАБРОНЮВАТИ|Забронювати/ }).first();
out.headerButtonExists = await headerBtn.count() > 0;
if (out.headerButtonExists) {
  await headerBtn.click().catch(()=>{});
  await p.waitForTimeout(700);
  out.headerOpensModal = await p.getByRole("dialog").count() > 0;
}
await b.close();
console.log(JSON.stringify(out, null, 2));
