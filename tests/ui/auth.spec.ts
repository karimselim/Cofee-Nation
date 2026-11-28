import { expect, test } from "../../fixtures/base";
import { newUser, PASSWORD } from "../../test-data/auth";
import { registerAndLogin } from "./helpers";

test.describe("Accounts", () => {
  test("a new account registers, verifies and logs in", async ({ page, signupPage, loginPage }) => {
    const user = await registerAndLogin(page, signupPage, loginPage);
    await expect(page.getByRole("button", { name: /account menu/i })).toBeVisible();
    expect(user.email).toContain("@example.com");
  });

  test("a wrong password shows an error and keeps the user out", async ({ page, signupPage, loginPage }) => {
    const user = newUser();
    await signupPage.open();
    await signupPage.signUp(user.email, user.password);
    await signupPage.verifyEmail(user.email);
    await loginPage.open();
    await loginPage.login(user.email, "WrongPass123");
    await expect(loginPage.getError()).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("a protected page sends a guest to the login form", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("logging out returns to the home page", async ({ page, signupPage, loginPage }) => {
    await registerAndLogin(page, signupPage, loginPage);
    await page.getByRole("button", { name: /account menu/i }).click();
    await page.getByText(/sign out/i).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
