import { expect, test } from "../../fixtures/base";
import { addFirstProductToCart } from "./helpers";

test.describe("Mobile layout", () => {
  test("the home page and the menu work on a phone", async ({ homePage, page }) => {
    await homePage.open();
    await expect(homePage.getHeroHeading()).toBeVisible();
    await homePage.openMenu();
    await expect(homePage.getSideMenu()).toBeVisible();
  });

  test("the products page is usable on a phone", async ({ productsPage, page }) => {
    await productsPage.open();
    await expect(productsPage.getCards().first()).toBeVisible();
    await productsPage.search("latte");
    await expect(productsPage.getCards().first()).toBeVisible();
    const box = await productsPage.getCards().first().boundingBox();
    const viewport = page.viewportSize();
    if (box && viewport) {
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    }
  });

  test("the cart page stacks on a phone", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await expect(cartPage.getTotal()).toBeVisible();
    await expect(cartPage.getConfirmButton()).toBeVisible();
  });
});
