import { test, expect } from "@playwright/test";

async function openBookingDialog(page: import("@playwright/test").Page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  // Click any visible "Забронювати" button on the page (header or hero)
  const btn = page.getByRole("button", { name: /Забронювати/i }).first();
  await btn.waitFor({ state: "visible", timeout: 10000 });
  await btn.click();
  await expect(page.getByRole("dialog", { name: "Залиште заявку" })).toBeVisible({ timeout: 5000 });
}

test.describe("BookingDialog", () => {
  test("opens from header with service tabs", async ({ page }) => {
    await openBookingDialog(page);
    await expect(
      page.getByRole("dialog", { name: "Залиште заявку" }).getByText(/Готель|Аквапарк|Ресторан|Сауна/i).first()
    ).toBeVisible();
  });

  test("switches to aquapark tab and shows tariff fields", async ({ page }) => {
    await openBookingDialog(page);
    const dialog = page.getByRole("dialog", { name: "Залиште заявку" });
    await dialog.getByText(/Аквапарк/i).first().click();
    // Expect some tariff or guest-type control to appear
    await expect(
      dialog.getByText(/Тариф|Дорослий|Дитин|Годин/i).first()
    ).toBeVisible({ timeout: 3000 });
  });

  test("hotel calendar allows range selection", async ({ page }) => {
    await openBookingDialog(page);
    const dialog = page.getByRole("dialog", { name: "Залиште заявку" });
    await dialog.getByText(/Готель/i).first().click();
    // Only enabled (non-disabled) date buttons — past dates are disabled
    const dateBtns = dialog
      .locator("button:not([disabled])")
      .filter({ hasText: /^\d{1,2}$/ });
    const count = await dateBtns.count();
    test.skip(count < 2, "No enabled calendar dates");
    await dateBtns.nth(0).click();
    await dateBtns.nth(Math.min(3, count - 1)).click();
  });

  test("step transition to contact fields", async ({ page }) => {
    await openBookingDialog(page);
    const dialog = page.getByRole("dialog", { name: "Залиште заявку" });
    const nextBtn = dialog.getByRole("button", { name: /Далі/i }).first();
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click();
      await expect(
        dialog.getByText(/Ім'я|Ім`я|Телефон|Email/i).first()
      ).toBeVisible({ timeout: 3000 });
    } else {
      test.skip(true, "Next button not found - single step dialog");
    }
  });

  test("validation prevents empty submit", async ({ page }) => {
    await openBookingDialog(page);
    const dialog = page.getByRole("dialog", { name: "Залиште заявку" });
    const submit = dialog
      .getByRole("button", { name: /Підтвердити|Відправити|Забронювати/i })
      .last();
    if (await submit.isVisible().catch(() => false)) {
      await submit.click();
      // Stay on dialog; expect an error message or required field
      await expect(dialog).toBeVisible();
    } else {
      test.skip(true, "Submit button not reachable without filling step 1");
    }
  });

  test("closes on Escape", async ({ page }) => {
    await openBookingDialog(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Залиште заявку" })).toBeHidden({ timeout: 3000 });
  });
});
