import { test, expect, Page } from "@playwright/test";

const chooseSort = async (page: Page, name: string) => {
  await page.getByRole("button", { name: /Sort by/ }).click();
  await page.getByRole("option", { name }).click();
};

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
    await chooseSort(page, "Price: low to high");
    const asc = await prices(page);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    await chooseSort(page, "Price: high to low");
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

  test("the sort menu is a custom list that works with the keyboard", async ({ page }) => {
    const button = page.getByRole("button", { name: /Sort by/ });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("option")).toHaveCount(4);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await button.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(button).toContainText("Price: low to high");
    await expect(page).toHaveURL(/sort=price-asc/);
  });

  test("clicking outside closes the sort menu", async ({ page }) => {
    await page.getByRole("button", { name: /Sort by/ }).click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.locator("#product-search").click();
    await expect(page.getByRole("listbox")).toHaveCount(0);
  });

  test("search row does not overlap the category tabs", async ({ page }) => {
    const tabs = await page.getByRole("navigation", { name: "Product categories" }).boundingBox();
    const form = await page.getByRole("search").boundingBox();
    expect(tabs && form && form.y >= tabs.y + tabs.height + 8).toBeTruthy();
  });
});
