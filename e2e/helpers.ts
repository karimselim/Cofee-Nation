import { Page, expect } from "@playwright/test";

export async function addFirstProduct(page: Page, category: 1 | 2 | 3 = 1, qtyClicks = 0) {
  await page.goto(`/products/${category}`);
  await page.locator(`a[href^="/products/${category}/"]`).first().click();
  for (let i = 0; i < qtyClicks; i++) {
    await page.getByRole("button", { name: "Increase quantity" }).click();
  }
  await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
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

export async function signUpAndLogin(page: Page, email: string, password = "Passw0rd1") {
  await page.goto("/auth/register");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Signup", exact: true }).click();
  await expect(page.getByText("Check your email")).toBeVisible();
  await page.evaluate((e) => window.__verifyFakeEmail?.(e), email);
  await page.goto("/auth/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(/\/products/);
}

declare global {
  interface Window {
    __verifyFakeEmail?: (email: string) => void;
  }
}

export async function checkout(page: Page, opts: { address?: string; method?: string } = {}) {
  await page.getByRole("link", { name: "Your cart" }).first().click();
  if (opts.address) await page.getByLabel(/^Delivery to/).fill(opts.address);
  await page.getByText(opts.method ?? "Cash on delivery", { exact: true }).click();
  await page.getByRole("button", { name: "Confirm And Pay" }).click();
}
