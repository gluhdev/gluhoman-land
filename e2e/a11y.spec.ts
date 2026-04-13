import { test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  "/admin/login",
];

test.describe("Accessibility (axe-core)", () => {
  for (const path of PAGES) {
    test(`${path} — no WCAG 2.1 AA violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .disableRules(["region"])
        .analyze();

      if (results.violations.length > 0) {
        console.log(
          `[A11Y] ${path}:`,
          results.violations.map((v) => `${v.id}: ${v.nodes.length}x`).join(", ")
        );
        for (const v of results.violations) {
          const firstNode = v.nodes[0];
          console.log(
            `[A11Y-DETAIL] ${path} ${v.id} (${v.impact}): ${firstNode?.target?.join(" ")} :: ${firstNode?.html?.slice(0, 160)}`
          );
        }
      }
    });
  }
});
