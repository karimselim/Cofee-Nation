import { expect, test } from "../../fixtures/base";
import { BLACK_COFFEE } from "../../test-data/products";

test.describe("Products page", () => {
  test("lists products with a title and a price", async ({ productsPage }) => {
    await productsPage.open();
    await expect(productsPage.getCards().first()).toBeVisible();
    const count = await productsPage.getCards().count();
    expect(count).toBeGreaterThan(0);
    await expect(productsPage.getCards().first()).toContainText(/EGP/);
  });

  test("search narrows the list", async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.search("latte");
    const titles = productsPage.getCardTitles();
    const count = await titles.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      expect((await titles.nth(i).innerText()).toLowerCase()).toContain("latte");
    }
  });

  test("search with no match shows the empty message", async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.search("zzzzz");
    await expect(productsPage.getEmptyMessage()).toBeVisible();
    await expect(productsPage.getCards()).toHaveCount(0);
  });

  test("a bad max price is rejected instead of returning nonsense", async ({ productsPage, page }) => {
    await productsPage.open();
    await productsPage.setMaxPrice("abc");
    await expect(page.getByRole("alert")).toContainText(/whole number/i);
  });

  test("max price filters the list", async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.setMaxPrice("100");
    await expect(productsPage.getCards().first()).toBeVisible();
    for (const price of await productsPage.getPriceValues()) {
      expect(price).toBeLessThanOrEqual(100);
    }
  });

  test("sorting by price goes low to high", async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.sortBy("Price: low to high");
    const prices = await productsPage.getPriceValues();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("pagination moves between pages and clamps a page that is too high", async ({ productsPage }) => {
    await productsPage.open();
    const firstPageTitles = await productsPage.getCardTitles().allInnerTexts();
    await productsPage.nextPage();
    await expect(productsPage.getPageInput()).toHaveValue("2");
    const secondPageTitles = await productsPage.getCardTitles().allInnerTexts();
    expect(secondPageTitles).not.toEqual(firstPageTitles);
    await productsPage.previousPage();
    await expect(productsPage.getPageInput()).toHaveValue("1");
    await productsPage.goToPage(99);
    await expect(productsPage.getPageInput()).toHaveValue("2");
  });

  test("the product page shows the price, size and quantity total", async ({ productDetailsPage }) => {
    await productDetailsPage.open(BLACK_COFFEE.slug);
    await expect(productDetailsPage.getTitle()).toHaveText(new RegExp(BLACK_COFFEE.title, "i"));
    await expect(productDetailsPage.getTotal()).toContainText("105");
    await productDetailsPage.increaseQuantity(2);
    await expect(productDetailsPage.getTotal()).toContainText("315");
    await productDetailsPage.chooseSize("L");
    await expect(productDetailsPage.getTotal()).toContainText("393.75");
  });

  test("adding to the cart counts cart lines, not units", async ({ productDetailsPage, page }) => {
    await productDetailsPage.open(BLACK_COFFEE.slug);
    await productDetailsPage.increaseQuantity(2);
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.getCartBadge()).toHaveText("1");
    // the same product and size is one line, so the badge stays at 1 after the second add
    await page.getByRole("button", { name: /added to cart/i }).waitFor({ state: "hidden", timeout: 5000 });
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.getCartBadge()).toHaveText("1");
  });

  test("an unknown product shows the not found page", async ({ page }) => {
    await page.goto("/products/1/9999");
    await expect(page.getByText(/couldn.t find that product/i)).toBeVisible();
  });
});
