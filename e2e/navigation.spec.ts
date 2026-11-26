import { test, expect } from "@playwright/test";
import { trackErrors } from "./helpers";

test.describe("navigation and pages", () => {
  test("home page loads with a heading and no console errors", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await expect(page).toHaveTitle("Coffee Nation");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Start Your Day");
    expect(errors).toEqual([]);
  });

  test("header link opens the products page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Products" }).first().click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(page.getByRole("navigation", { name: "Product categories" })).toBeVisible();
  });

  for (const [path, tab] of [
    ["/products/1", "Coffee"],
    ["/products/2", "Iced"],
    ["/products/3", "Foods"],
  ]) {
    test(`category tab ${tab} shows products`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator(`a[href^="${path}/"]`).first()).toBeVisible();
      await expect(page.getByRole("link", { name: tab, exact: true })).toHaveClass(/font-bold/);
    });
  }

  test("add-on tab shows its empty state", async ({ page }) => {
    await page.goto("/products/4");
    await expect(page.getByText("our products have gone into hiding")).toBeVisible();
  });

  test("unknown route shows the not found page", async ({ page }) => {
    await page.goto("/no-such-page");
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await page.getByRole("link", { name: /back to home/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("unknown product shows a product error, not a crash", async ({ page }) => {
    await page.goto("/products/1/9999");
    await expect(page.getByRole("heading", { name: "We couldn't find that product." })).toBeVisible();
  });
});
