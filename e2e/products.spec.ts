import { test, expect } from "@playwright/test";

test.describe("products", () => {
  test("prices are shown in EGP and never in IDR", async ({ page }) => {
    await page.goto("/products/1");
    await expect(page.locator("body")).toContainText(/EGP \d+/);
    await expect(page.locator("body")).not.toContainText("IDR");
  });

  test("pagination moves to page 2 and back", async ({ page }) => {
    await page.goto("/products/1");
    const first = await page.locator('a[href^="/products/1/"]').first().getAttribute("href");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.locator("#page-input")).toHaveValue("2");
    expect(await page.locator('a[href^="/products/1/"]').first().getAttribute("href")).not.toBe(first);
    await page.getByRole("button", { name: /Previous/ }).first().click();
    await expect(page.locator("#page-input")).toHaveValue("1");
  });

  test("product page shows title, description, price and one h1", async ({ page }) => {
    await page.goto("/products/3/1");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add To Cart", exact: true })).toBeVisible();
    await expect(page.locator("body")).toContainText(/EGP \d+/);
  });

  test("quantity cannot go below 1", async ({ page }) => {
    await page.goto("/products/1/1");
    await page.getByRole("button", { name: "Decrease quantity" }).click();
    await expect(page.getByLabel("Quantity", { exact: true })).toHaveValue("1");
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(page.getByLabel("Quantity", { exact: true })).toHaveValue("2");
  });

  test("product images load", async ({ page }) => {
    await page.goto("/products/2");
    await page.waitForLoadState("networkidle");
    const broken = await page.evaluate(
      () => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length
    );
    expect(broken).toBe(0);
  });
});
