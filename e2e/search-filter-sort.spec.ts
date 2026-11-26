import { test, expect, Page } from "@playwright/test";

const prices = async (page: Page) => {
  const texts = await page.locator('a[href^="/products/1/"] p.font-bold').allInnerTexts();
  return texts.map((t) => Number(t.replace(/[^0-9.]/g, "")));
};

test.describe("search, filter and sort", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products/1");
    await expect(page.locator('a[href^="/products/1/"]').first()).toBeVisible();
  });

  test("search narrows the list and keeps the query in the URL", async ({ page }) => {
    const all = await page.locator('a[href^="/products/1/"]').count();
    await page.locator("#product-search").fill("latte");
    await expect(page).toHaveURL(/q=latte/);
    const n = await page.locator('a[href^="/products/1/"]').count();
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(all);
    await expect(page.locator('a[href^="/products/1/"]').first()).toContainText(/latte/i);
  });

  test("search with no match shows a message", async ({ page }) => {
    await page.locator("#product-search").fill("zzzzqqq");
    await expect(page.getByText("No products match your search.")).toBeVisible();
    await expect(page.locator('a[href^="/products/1/"]')).toHaveCount(0);
  });

  test("sort by price works in both directions", async ({ page }) => {
    await page.getByLabel("Sort by").selectOption("price-asc");
    const asc = await prices(page);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    await page.getByLabel("Sort by").selectOption("price-desc");
    const desc = await prices(page);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  test("max price filter hides expensive items", async ({ page }) => {
    await page.getByLabel("Max price (EGP)").fill("110");
    const list = await prices(page);
    expect(list.length).toBeGreaterThan(0);
    for (const p of list) expect(p).toBeLessThanOrEqual(110);
  });

  test("invalid max price shows an error and does not filter", async ({ page }) => {
    const all = await page.locator('a[href^="/products/1/"]').count();
    await page.getByLabel("Max price (EGP)").fill("abc");
    await expect(page.getByRole("alert")).toContainText("whole number");
    await expect(page.locator('a[href^="/products/1/"]')).toHaveCount(all);
    await page.getByLabel("Max price (EGP)").fill("-5");
    await expect(page.getByRole("alert")).toBeVisible();
  });
});
