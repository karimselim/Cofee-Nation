import { expect, test } from "../../fixtures/base";
import { BLACK_COFFEE } from "../../test-data/products";
import { registerAndLogin } from "./helpers";

test.describe("Favourites", () => {
  test("a guest is asked to log in before saving", async ({ page, productDetailsPage }) => {
    await productDetailsPage.open(BLACK_COFFEE.slug);
    await productDetailsPage.saveToFavourites();
    await expect(page.getByText(/log in to save favourites/i)).toBeVisible();
  });

  test("a logged in user saves a product and removes it again", async ({
    page,
    signupPage,
    loginPage,
    productDetailsPage,
    wishlistPage,
  }) => {
    await registerAndLogin(page, signupPage, loginPage);
    await productDetailsPage.open(BLACK_COFFEE.slug);
    await productDetailsPage.saveToFavourites();
    await wishlistPage.open();
    await expect(wishlistPage.getItems()).toHaveCount(1);
    await expect(wishlistPage.getItems().first()).toContainText(BLACK_COFFEE.title);
    await wishlistPage.removeFirst();
    await expect(wishlistPage.getEmptyState()).toBeVisible();
  });

  test("the favourites page is centered", async ({ page, signupPage, loginPage, wishlistPage }) => {
    await registerAndLogin(page, signupPage, loginPage);
    await wishlistPage.open();
    const heading = page.getByRole("heading", { name: /your favourites/i });
    const box = await heading.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (box && viewport) {
      const headingCenter = box.x + box.width / 2;
      expect(Math.abs(headingCenter - viewport.width / 2)).toBeLessThan(40);
    }
  });
});
