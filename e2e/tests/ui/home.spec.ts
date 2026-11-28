import { expect, test } from "../../fixtures/base";
import { collectPageErrors } from "./helpers";

test.describe("Home page", () => {
  test("shows the hero, the sections and the footer", async ({ homePage, page }) => {
    const errors = collectPageErrors(page);
    await homePage.open();
    await expect(homePage.getHeroHeading()).toContainText(/start your day/i);
    await homePage.expectSectionsVisible();
    await expect(homePage.getFooter()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("the header links open the shop pages", async ({ homePage, page }) => {
    await homePage.open();
    await homePage.getNavLink(/products/i).click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole("heading", { name: "Promo Today" })).toBeVisible();
    await homePage.getNavLink(/home/i).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("the mobile menu opens the navigation", async ({ homePage, page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await homePage.open();
    await homePage.openMenu();
    await expect(homePage.getSideMenu()).toBeVisible();
  });
});
