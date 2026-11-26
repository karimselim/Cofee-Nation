import { test, expect } from "@playwright/test";
import { addFirstProduct } from "./helpers";

const num = (t: string) => Number(t.replace(/[^0-9.]/g, ""));

test.describe("size, quantity and price", () => {
  test("price follows quantity", async ({ page }) => {
    await page.goto("/products/1/1");
    const total = page.getByTestId("product-total");
    const one = num(await total.innerText());
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByRole("button", { name: "Increase quantity" }).click();
    expect(num(await total.innerText())).toBe(one * 3);
  });

  test("larger sizes cost more", async ({ page }) => {
    await page.goto("/products/1/1");
    const total = page.getByTestId("product-total");
    const r = num(await total.innerText());
    await page.getByRole("radio", { name: /^Large/ }).click();
    const l = num(await total.innerText());
    await page.getByRole("radio", { name: /^Extra large/ }).click();
    const xl = num(await total.innerText());
    expect(l).toBeGreaterThan(r);
    expect(xl).toBeGreaterThan(l);
  });

  test("chosen size and quantity reach the cart with the right price", async ({ page }) => {
    await page.goto("/products/1/1");
    await page.getByRole("radio", { name: /^Large/ }).click();
    await page.getByRole("button", { name: "Increase quantity" }).click();
    const expected = num(await page.getByTestId("product-total").innerText());
    await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
    await page.getByRole("link", { name: "Your cart" }).first().click();
    const line = page.getByTestId("cart-line");
    await expect(line).toContainText("Size L");
    await expect(line.getByLabel("Quantity")).toHaveText("2");
    await expect(line).toContainText(expected.toString());
  });

  test("same product in two sizes makes two cart lines", async ({ page }) => {
    await page.goto("/products/1/1");
    await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
    await page.getByRole("radio", { name: /^Large/ }).click();
    await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
    await page.getByRole("link", { name: "Your cart" }).first().click();
    await expect(page.getByTestId("cart-line")).toHaveCount(2);
  });

  test("the arrow button adds the item to the cart", async ({ page }) => {
    await page.goto("/products/2/1");
    await page.getByRole("button", { name: "Add to cart", exact: true }).click();
    await expect(page.getByTestId("cart-count").first()).toHaveText("1");
  });

  test("delivery options chosen on the product page show in the cart", async ({ page }) => {
    await page.goto("/products/1/1");
    await page.getByRole("button", { name: "Door Delivery" }).click();
    await page.getByRole("button", { name: "No", exact: true }).click();
    await page.getByLabel("Set Time").fill("15:30");
    await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
    await page.getByRole("link", { name: "Your cart" }).first().click();
    await expect(page.getByRole("button", { name: "Door Delivery" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByLabel("Set Time")).toHaveValue("15:30");
  });
});

test.describe("cart badge", () => {
  test("header badge counts items and updates", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("cart-count").first()).toHaveCount(0);
    await addFirstProduct(page, 1, 2); // quantity 3
    await expect(page.getByTestId("cart-count").first()).toHaveText("3");
  });
});

test.describe("checkout validation", () => {
  const toCart = async (page: import("@playwright/test").Page) => {
    await addFirstProduct(page, 1);
    await page.getByRole("link", { name: "Your cart" }).first().click();
  };

  test("address must be long enough and contain letters", async ({ page }) => {
    await toCart(page);
    await page.getByRole("button", { name: "Door Delivery" }).click();
    await page.getByLabel(/^Delivery to/).fill("abc");
    await page.getByText("Cash on delivery", { exact: true }).click();
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByText("The address is too short")).toBeVisible();
    await page.getByLabel(/^Delivery to/).fill("1234567890123");
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByText("must contain letters")).toBeVisible();
  });

  test("a typed address is validated even for pickup", async ({ page }) => {
    await toCart(page);
    await page.getByLabel(/^Delivery to/).fill("xx");
    await page.getByText("Cash on delivery", { exact: true }).click();
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByText("The address is too short")).toBeVisible();
  });

  test("notes longer than 200 characters are rejected", async ({ page }) => {
    await toCart(page);
    await page.getByLabel("Notes (optional)").fill("n".repeat(201));
    await page.getByText("Cash on delivery", { exact: true }).click();
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByText("200 characters at most")).toBeVisible();
  });

  test("a later time is required and must be inside opening hours", async ({ page }) => {
    await toCart(page);
    await page.getByRole("button", { name: "No", exact: true }).click();
    await page.getByText("Cash on delivery", { exact: true }).click();
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByText("choose the time")).toBeVisible();
    await page.getByLabel("Set Time").fill("03:00");
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByText("We are open from")).toBeVisible();
  });

  test("pickup order with no address can be paid", async ({ page }) => {
    await toCart(page);
    await page.getByText("Cash on delivery", { exact: true }).click();
    await page.getByRole("button", { name: "Confirm And Pay" }).click();
    await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  });

  test("clicking the text of a payment option selects it, and there is no edit button", async ({ page }) => {
    await toCart(page);
    await page.getByText("Bank account", { exact: true }).click();
    await expect(page.getByRole("radio", { name: "Bank account" })).toBeChecked();
    await expect(page.getByRole("button", { name: /^edit$/i })).toHaveCount(0);
    await page.getByLabel(/^Delivery to/).fill("typing works right away");
    await expect(page.getByLabel(/^Delivery to/)).toHaveValue("typing works right away");
  });
});
