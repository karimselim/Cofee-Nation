import { test, expect } from "@playwright/test";

const openFirst = async (page: import("@playwright/test").Page) => {
  await page.goto("/products/1");
  await page.locator('a[href^="/products/1/"]').first().click();
};

test.describe("notification banner animation", () => {
  test("slides in, then slides out and is removed after dismissing", async ({ page }) => {
    await openFirst(page);
    await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
    const toast = page.getByTestId("toast");
    await expect(toast).toBeVisible();
    await expect(toast).toHaveCSS("animation-name", "toast-in");
    await page.getByRole("button", { name: "Dismiss message" }).click();
    await expect(toast).toHaveAttribute("data-state", "leaving");
    await expect(toast).toHaveCSS("animation-name", "toast-out");
    await expect(toast).toHaveCount(0);
  });

  test("goes away by itself after a few seconds", async ({ page }) => {
    await openFirst(page);
    await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
    await expect(page.getByTestId("toast")).toBeVisible();
    await expect(page.getByTestId("toast")).toHaveCount(0, { timeout: 9000 });
  });
});
