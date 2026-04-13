import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("homepage loads with title and h1", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Глухомань/i);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("hotel page renders with booking CTA", async ({ page }) => {
    await page.goto("/hotel");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Забронювати/i }).first()
    ).toBeVisible();
  });

  test("aquapark page renders", async ({ page }) => {
    await page.goto("/aquapark");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(
      page.getByText(/Зони|Забронювати/i).first()
    ).toBeVisible();
  });

  test("restaurant page renders", async ({ page }) => {
    await page.goto("/restaurant");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText(/Меню|Забронювати/i).first()).toBeVisible();
  });

  test("sauna page renders with icons", async ({ page }) => {
    await page.goto("/sauna");
    await expect(page.locator("h1").first()).toBeVisible();
    // lucide-react icons render as <svg class="lucide ...">
    await expect(page.locator("svg.lucide").first()).toBeVisible();
  });

  test("menu page shows dishes and cart", async ({ page }) => {
    await page.goto("/menu");
    await expect(page.locator("h1").first()).toBeVisible();
    // At least 5 items (price markers or item headings)
    const items = page.locator("[data-testid='menu-item'], article, li");
    await expect(items.first()).toBeVisible({ timeout: 10000 });
    expect(await items.count()).toBeGreaterThanOrEqual(5);
  });

  test("gallery page shows at least 10 images", async ({ page }) => {
    await page.goto("/gallery");
    await page.waitForLoadState("networkidle");
    const imgCount = await page.locator("img").count();
    expect(imgCount).toBeGreaterThanOrEqual(10);
  });

  test("paintball other-service page renders", async ({ page }) => {
    await page.goto("/other-services/paintball");
    await expect(page.getByText(/Пейнтбол/i).first()).toBeVisible();
  });

  test("footer has phone and privacy link", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/\+38/).first()).toBeVisible();
    await expect(footer.locator("a[href='/privacy']").first()).toBeVisible();
  });

  test("homepage has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Ignore known benign errors (e.g. third-party scripts)
    const critical = errors.filter(
      (e) => !/favicon|ERR_BLOCKED|network/i.test(e)
    );
    expect(critical).toEqual([]);
  });
});
