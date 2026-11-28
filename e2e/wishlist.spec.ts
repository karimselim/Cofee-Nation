import { test, expect, Page } from "@playwright/test";
import { signUpAndLogin } from "./helpers";

const uniq = (p: string) => `${p}${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;

const openFirst = async (page: Page) => {
  await page.goto("/products/1");
  await page.locator('a[href^="/products/1/"]').first().click();
};

test.describe("favourites", () => {
  test("guests are asked to log in and the page is protected", async ({ page }) => {
    await openFirst(page);
    await page.getByRole("button", { name: /Save to favourites/ }).click();
    await expect(page.getByTestId("toast")).toContainText("Log in to save favourites");
    await page.goto("/wishlist");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("save, see, reload and remove a favourite", async ({ page }) => {
    await signUpAndLogin(page, uniq("w"));
    await openFirst(page);
    await page.getByRole("button", { name: /Save to favourites/ }).click();
    await expect(page.getByRole("button", { name: /Saved to favourites/ })).toHaveAttribute("aria-pressed", "true");
    await page.goto("/wishlist");
    await expect(page.getByTestId("wishlist-item")).toHaveCount(1);
    await page.reload();
    await expect(page.getByTestId("wishlist-item")).toHaveCount(1);
    await page.getByRole("button", { name: /^Remove .* from favourites/ }).click();
    await expect(page.getByText("You have no favourites yet.")).toBeVisible();
  });

  test("favourites belong to one account", async ({ page }) => {
    await signUpAndLogin(page, uniq("x"));
    await openFirst(page);
    await page.getByRole("button", { name: /Save to favourites/ }).click();
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByText("Sign out").click();
    await signUpAndLogin(page, uniq("y"));
    await page.goto("/wishlist");
    await expect(page.getByText("You have no favourites yet.")).toBeVisible();
  });

  test("the favourites page content is centered", async ({ page }) => {
    await signUpAndLogin(page, uniq("c"));
    await openFirst(page);
    await page.getByRole("button", { name: /Save to favourites/ }).click();
    await page.goto("/wishlist");
    const vw = page.viewportSize()!.width;
    const box = (await page.getByTestId("wishlist-item").boundingBox())!;
    expect(Math.abs(box.x + box.width / 2 - vw / 2)).toBeLessThan(20);
    const h = (await page.getByRole("heading", { name: "Your favourites" }).boundingBox())!;
    expect(Math.abs(h.x + h.width / 2 - vw / 2)).toBeLessThan(20);
  });
});
