import { expect, test } from "../../fixtures/base";
import { collectPageErrors } from "./helpers";

test.describe("Navigation and pages", () => {
  test("the home page loads with its heading and no page errors", async ({ homePage, page }) => {
    const errors = collectPageErrors(page);
    await homePage.open();
    await expect(page).toHaveTitle("Coffee Nation");
    await expect(homePage.getHeroHeading()).toContainText("Start Your Day");
    expect(errors).toEqual([]);
  });

  test("the header link opens the products page", async ({ homePage, productsPage, page }) => {
    await homePage.open();
    await homePage.getNavLink(/^Products$/).click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(productsPage.getCategoryNav()).toBeVisible();
  });

  for (const [tab, label] of [
    ["1", "Coffee"],
    ["2", "Iced"],
    ["3", "Foods"],
  ] as const) {
    test(`the ${label} tab lists its products`, async ({ productsPage }) => {
      await productsPage.openCategory(tab);
      await expect(productsPage.getCategoryCards(tab).first()).toBeVisible();
      await expect(productsPage.getCategoryLink(label)).toHaveClass(/font-bold/);
    });
  }

  test("the add-ons tab shows its empty state", async ({ productsPage }) => {
    await productsPage.openAddons();
  });

  test("an unknown route shows the not found page and a way home", async ({ homePage, page }) => {
    await page.goto("/no-such-page");
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await page.getByRole("link", { name: /back to home/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(homePage.getHeroHeading()).toBeVisible();
  });

  test("an unknown product shows a product error, not a crash", async ({ page }) => {
    await page.goto("/products/1/9999");
    await expect(page.getByRole("heading", { name: "We couldn't find that product." })).toBeVisible();
  });
});
