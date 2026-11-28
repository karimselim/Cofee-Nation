import { Page, expect } from "@playwright/test";
import { SignupPage } from "../../pages/auth/signupPage";
import { LoginPage } from "../../pages/auth/loginPage";
import { newUser } from "../../test-data/auth";

/** Register, verify (fake auth) and log in. Returns the account that was created. */
export async function registerAndLogin(
  page: Page,
  signupPage: SignupPage,
  loginPage: LoginPage
): Promise<{ email: string; password: string }> {
  const user = newUser();
  await signupPage.open();
  await signupPage.signUp(user.email, user.password);
  await signupPage.verifyEmail(user.email);
  await loginPage.open();
  await loginPage.login(user.email, user.password);
  await expect(page).toHaveURL(/\/products/);
  return user;
}

/** Adds the first product of a category to the cart and lands on the details page. */
export async function addFirstProductToCart(page: Page, category: "1" | "2" | "3" = "1"): Promise<void> {
  await page.goto(`/products/${category}`);
  await page.locator(`a[href^="/products/${category}/"]`).first().click();
  await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
  await expect(page.getByRole("button", { name: /added to cart/i })).toBeVisible();
}

export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/** Adds the first product of a category, then opens the cart from the header. */
export async function addFirstProductAndOpenCart(
  page: Page,
  cartPage: import("../../pages/shop/cartPage").CartPage,
  category: "1" | "2" | "3" = "1",
  quantityClicks = 0
): Promise<void> {
  await page.goto(`/products/${category}`);
  await page.locator(`a[href^="/products/${category}/"]`).first().click();
  for (let i = 0; i < quantityClicks; i++) {
    await page.getByRole("button", { name: "Increase quantity" }).click();
  }
  await page.getByRole("button", { name: "Add To Cart", exact: true }).click();
  await expect(page.getByRole("button", { name: /added to cart/i })).toBeVisible();
  await cartPage.openFromHeader();
}

/** Pays a cart that already has a line, optionally typing an address. */
export async function payCart(
  cartPage: import("../../pages/shop/cartPage").CartPage,
  options: { address?: string; method?: "Card" | "Bank account" | "Cash on delivery" } = {}
): Promise<void> {
  if (options.address) await cartPage.setAddress(options.address);
  await cartPage.choosePaymentByText(options.method ?? "Cash on delivery");
  await cartPage.confirm();
}
