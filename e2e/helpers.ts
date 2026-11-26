import { Page, expect } from "@playwright/test";

export async function addFirstProduct(page: Page, category: 1 | 2 | 3 = 1, qtyClicks = 0) {
  await page.goto(`/products/${category}`);
  await page.locator(`a[href^="/products/${category}/"]`).first().click();
  for (let i = 0; i < qtyClicks; i++) {
    await page.getByRole("button", { name: "Increase quantity" }).click();
  }
  await page.getByRole("button", { name: "Add To Cart" }).click();
  await expect(page.getByRole("button", { name: /Added to cart/ })).toBeVisible();
}

export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}
