import { test, expect } from "@playwright/test";
import { addFirstProduct } from "./helpers";

test.describe("cart and checkout", () => {
  test("empty cart shows a message and a way back to products", async ({ page }) => {
    await page.goto("/yourCart");
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
    await page.getByRole("link", { name: "Browse products" }).click();
    await expect(page).toHaveURL(/\/products$/);
  });

  test("adding a product puts it in the cart with totals in EGP", async ({ page }) => {
    await addFirstProduct(page, 1, 1);
    await page.getByRole("link", { name: "Your cart" }).click();
    await expect(page.getByText("Order Summary")).toBeVisible();
    await expect(page.locator("body")).toContainText(/subtotal/i);
    await expect(page.locator("body")).not.toContainText("IDR");
    await expect(page.getByRole("button", { name: /^Increase / })).toHaveCount(1);
  });

  test("same product twice merges into one line with the right quantity", async ({ page }) => {
    await addFirstProduct(page, 1);
    await page.getByRole("button", { name: "Add To Cart" }).click();
    await page.getByRole("link", { name: "Your cart" }).click();
    await expect(page.getByRole("button", { name: /^Increase / })).toHaveCount(1);
    await expect(page.getByText("2", { exact: true })).toBeVisible();
  });

  test("cart quantity and remove buttons work", async ({ page }) => {
    await addFirstProduct(page, 1);
    await page.getByRole("link", { name: "Your cart" }).click();
    await page.getByRole("button", { name: /^Increase / }).click();
    await expect(page.getByText("2", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /^Decrease / }).click();
    await page.getByRole("button", { name: /^Remove / }).click();
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
  });

  test("cart survives a page reload", async ({ page }) => {
    await addFirstProduct(page, 2);
    await page.goto("/yourCart");
    await page.reload();
    await expect(page.getByRole("button", { name: /^Remove / })).toHaveCount(1);
  });

  test("paying without an address shows an error", async ({ page }) => {
    await addFirstProduct(page, 1);
    await page.getByRole("link", { name: "Your cart" }).click();
    await page.getByLabel("Card").check();
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByRole("alert")).toContainText("delivery address");
  });

  test("pay button is disabled until a payment method is chosen", async ({ page }) => {
    await addFirstProduct(page, 1);
    await page.getByRole("link", { name: "Your cart" }).click();
    await expect(page.getByRole("button", { name: "Confirm And Pay" })).toBeDisabled();
    await page.getByLabel("Cash on delivery").check();
    await expect(page.getByRole("button", { name: "Confirm And Pay" })).toBeEnabled();
  });

  test("full checkout confirms the order and empties the cart", async ({ page }) => {
    await addFirstProduct(page, 3);
    await page.getByRole("link", { name: "Your cart" }).click();
    await page.getByLabel("Delivery address").fill("12 Nile St, Cairo");
    await page.getByLabel("Card").check();
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
    await expect(page.getByTestId("order-number")).toHaveText(/^CN-\d{6}$/);
    await expect(page.getByText("12 Nile St, Cairo")).toBeVisible();
    await page.goto("/yourCart");
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
  });
});
