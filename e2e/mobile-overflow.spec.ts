import { test, expect } from "@playwright/test";

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
  "/other-services/wedding",
  "/other-services/apitherapy",
  "/other-services/horses",
  "/other-services/kids-parties",
  "/other-services/bbq-zone",
  "/other-services/brewery-tour",
  "/other-services/petting-zoo",
];

test.describe("Mobile viewport overflow audit", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const path of PAGES) {
    test(`${path} — no horizontal overflow, screenshot`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      await page.goto(path);
      await page.waitForLoadState("networkidle", { timeout: 15000 });

      // Full-page screenshot
      const fileName = `mobile${path.replace(/\//g, "-") || "-home"}.png`;
      await page.screenshot({
        path: `test-results/mobile-screenshots/${fileName}`,
        fullPage: true,
      });

      // Check document width vs viewport width
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth, `${path}: document is wider than viewport (${docWidth}px > 375px)`).toBeLessThanOrEqual(376);

      // Find any element that overflows its parent horizontally
      const overflowers = await page.evaluate(() => {
        const results: Array<{ tag: string; text: string; rightEdge: number }> = [];
        const viewportWidth = window.innerWidth;
        const all = document.querySelectorAll("*");
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (rect.right > viewportWidth + 1) {
            const tag = el.tagName.toLowerCase();
            const text = (el.textContent || "").trim().slice(0, 40);
            results.push({ tag, text, rightEdge: Math.round(rect.right) });
            if (results.length >= 5) break;
          }
        }
        return results;
      });

      if (overflowers.length > 0) {
        console.log(`[OVERFLOW] ${path}:`, JSON.stringify(overflowers, null, 2));
      }

      expect(errors, `${path}: console errors: ${errors.join("; ")}`).toHaveLength(0);
    });
  }
});
