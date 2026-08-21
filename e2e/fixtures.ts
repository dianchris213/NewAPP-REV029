import { test as base, expect, type Page } from "@playwright/test";

const STORAGE_KEY = "tmab-state-v1";

/** Signed-in state with no categories — the empty state under test. */
export const EMPTY_STATE = {
  user: { id: "e2e-user", name: "E2E User", provider: "telegram" as const },
  transactions: [],
  wallets: [],
  walletActivity: [],
  categories: [],
  language: "id" as const,
};

/**
 * Every E2E test starts authenticated with a deterministic, empty dataset so
 * focus-order and visual baselines never depend on leftover local state.
 */
export const test = base.extend<{ seed: typeof EMPTY_STATE }>({
  seed: [EMPTY_STATE, { option: true }],
  page: async ({ page, seed }, use) => {
    await page.addInitScript(
      ([key, value]) => {
        window.localStorage.setItem(key as string, value as string);
      },
      [STORAGE_KEY, JSON.stringify(seed)] as const,
    );
    await use(page);
  },
});

export { expect };

/** Open Pengaturan > Kategori Transaksi and wait for the dialog. */
export async function openCategorySheet(page: Page) {
  await page.goto("/settings", { waitUntil: "domcontentloaded" });
  const row = page.getByRole("button", { name: /kategori/i }).first();
  await expect(row).toBeVisible();
  return { row, sheet: page.getByTestId("category-sheet") };
}
