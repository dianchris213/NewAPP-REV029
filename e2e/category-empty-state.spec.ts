import { test, expect } from "@playwright/test";

/**
 * Visual regression for the empty state of Kategori Transaksi.
 * Run with `bun run e2e:update` to refresh the baseline on purpose.
 */
test.describe("Kategori Transaksi — empty state", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test("matches the empty-state baseline", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "domcontentloaded" });
    await page
      .getByRole("button", { name: /kategori/i })
      .first()
      .click();

    const sheet = page.getByTestId("category-sheet");
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveScreenshot("category-empty-state.png");
  });
});
