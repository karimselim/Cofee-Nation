import { expect, test } from "../../fixtures/base";

test.describe("Search, filter and sort", () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.openCategory("1");
    await expect(productsPage.getCategoryCards("1").first()).toBeVisible();
  });

  test("search narrows the list and keeps the query in the URL", async ({ productsPage, page }) => {
    const all = await productsPage.getCategoryCards("1").count();
    await productsPage.search("latte");
    await expect(page).toHaveURL(/q=latte/);
    const narrowed = await productsPage.getCategoryCards("1").count();
    expect(narrowed).toBeGreaterThan(0);
    expect(narrowed).toBeLessThan(all);
    await expect(productsPage.getCategoryCards("1").first()).toContainText(/latte/i);
  });

  test("search with no match shows the empty message", async ({ productsPage }) => {
    await productsPage.search("zzzzqqq");
    await expect(productsPage.getEmptyMessage()).toBeVisible();
    await expect(productsPage.getCategoryCards("1")).toHaveCount(0);
  });

  test("sorting by price works in both directions", async ({ productsPage }) => {
    await productsPage.sortBy("Price: low to high");
    const ascending = await productsPage.getPriceValues();
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b));

    await productsPage.sortBy("Price: high to low");
    const descending = await productsPage.getPriceValues();
    expect(descending).toEqual([...descending].sort((a, b) => b - a));
  });

  test("the max price filter hides the expensive items", async ({ productsPage }) => {
    await productsPage.setMaxPrice("110");
    const prices = await productsPage.getPriceValues();
    expect(prices.length).toBeGreaterThan(0);
    for (const price of prices) expect(price).toBeLessThanOrEqual(110);
  });

  test("an invalid max price shows an error and does not filter", async ({ productsPage, page }) => {
    const all = await productsPage.getCategoryCards("1").count();
    await productsPage.setMaxPrice("abc");
    await expect(page.getByRole("alert")).toContainText("whole number");
    await expect(productsPage.getCategoryCards("1")).toHaveCount(all);
    await productsPage.setMaxPrice("-5");
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("the sort menu is a list that works with the keyboard", async ({ productsPage, page }) => {
    const button = productsPage.getSortButton();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(productsPage.getSortListbox()).toBeVisible();
    await expect(productsPage.getSortOptions()).toHaveCount(4);
    await page.keyboard.press("Escape");
    await expect(productsPage.getSortListbox()).toHaveCount(0);

    await button.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(button).toContainText("Price: low to high");
    await expect(page).toHaveURL(/sort=price-asc/);
  });

  test("clicking outside closes the sort menu", async ({ productsPage, page }) => {
    await productsPage.getSortButton().click();
    await expect(productsPage.getSortListbox()).toBeVisible();
    await productsPage.getSearchForm().click();
    await expect(productsPage.getSortListbox()).toHaveCount(0);
  });

  test("the search row does not overlap the category tabs", async ({ productsPage }) => {
    const tabs = await productsPage.getCategoryNav().boundingBox();
    const form = await productsPage.getSearchForm().boundingBox();
    expect(tabs && form && form.y >= tabs.y + tabs.height + 8).toBeTruthy();
  });
});
