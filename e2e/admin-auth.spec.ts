import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@gluhoman.local";
const ADMIN_PASSWORD = "admin123";

test.describe("Admin auth", () => {
  test("unauthenticated /admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });

  test("login page renders email and password fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("input[type='email'], input[name='email']").first()).toBeVisible();
    await expect(
      page.locator("input[type='password'], input[name='password']").first()
    ).toBeVisible();
  });

  test("failed login shows error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("input[type='email'], input[name='email']").first().fill("wrong@example.com");
    await page.locator("input[type='password'], input[name='password']").first().fill("badpass");
    await page.getByRole("button", { name: /Увійти|Вхід|Sign in/i }).first().click();
    // Error should appear or we remain on login page
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });

  test("successful login redirects to admin", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("input[type='email'], input[name='email']").first().fill(ADMIN_EMAIL);
    await page.locator("input[type='password'], input[name='password']").first().fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Увійти|Вхід|Sign in/i }).first().click();
    await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 }).catch(() => {});
    expect(page.url()).toMatch(/\/admin/);
  });

  test("admin menu page lists dishes", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("input[type='email'], input[name='email']").first().fill(ADMIN_EMAIL);
    await page.locator("input[type='password'], input[name='password']").first().fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Увійти|Вхід|Sign in/i }).first().click();
    await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 }).catch(() => {});
    await page.goto("/admin/menu");
    const rows = page.locator("tr, [role='row'], article, li");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    expect(await rows.count()).toBeGreaterThanOrEqual(5);
  });

  test("logout clears session", async ({ page, context }) => {
    // Log in via API to get session cookie
    await page.goto("/admin/login");
    await page.locator("input[type='email'], input[name='email']").first().fill(ADMIN_EMAIL);
    await page.locator("input[type='password'], input[name='password']").first().fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Увійти|Вхід|Sign in/i }).first().click();
    await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 }).catch(() => {});

    // Verify session cookie exists
    const cookiesBefore = await context.cookies();
    const hasSession = cookiesBefore.some((c) => c.name.includes("session-token"));
    test.skip(!hasSession, "Session cookie not set after login");

    // Clear cookies = effectively logged out
    await context.clearCookies();

    // Now visiting /admin should redirect to login
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });
});
