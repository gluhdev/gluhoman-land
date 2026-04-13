import { test } from "@playwright/test";

const PAGES = [
  "/",
  "/hotel",
  "/aquapark",
  "/restaurant",
  "/sauna",
  "/menu",
  "/gallery",
  "/privacy",
  "/terms",
  "/other-services/paintball",
];

for (const p of PAGES) {
  test(`screenshot ${p}`, async ({ page }) => {
    await page.goto(p);
    try {
      await page.waitForLoadState("networkidle", { timeout: 10000 });
    } catch {
      // Ignore timeout — some pages may have long-lived connections
    }
    const name = p.replace(/\//g, "-") || "-home";
    await page.screenshot({
      path: `test-results/mobile${name}.png`,
      fullPage: true,
    });
  });
}
