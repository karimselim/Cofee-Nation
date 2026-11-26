import { test, expect } from "@playwright/test";
import { addFirstProduct, checkout, signUpAndLogin } from "./helpers";

const uniq = (p: string) => `${p}${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;

test.describe("signup, login and error messages", () => {
  test("signup asks to verify the email and does not log in", async ({ page }) => {
    await page.goto("/auth/register");
    await page.locator("#email").fill(uniq("new"));
    await page.locator("#password").fill("Passw0rd1");
    await page.getByRole("button", { name: "Signup", exact: true }).click();
    await expect(page.getByText("Check your email")).toBeVisible();
    await page.goto("/history");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("an unverified email cannot log in and can ask for a new link", async ({ page }) => {
    const email = uniq("unver");
    await page.goto("/auth/register");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill("Passw0rd1");
    await page.getByRole("button", { name: "Signup", exact: true }).click();
    await page.goto("/auth/login");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill("Passw0rd1");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page.getByText("Please verify your email first")).toBeVisible();
    await page.getByRole("button", { name: "Send the verification email again" }).click();
    await expect(page.getByText("We sent a new verification link")).toBeVisible();
  });

  test("signing up twice with one email says the email is taken", async ({ page }) => {
    const email = uniq("dup");
    for (let i = 0; i < 2; i++) {
      await page.goto("/auth/register");
      await page.locator("#email").fill(email);
      await page.locator("#password").fill("Passw0rd1");
      await page.getByRole("button", { name: "Signup", exact: true }).click();
    }
    await expect(page.getByText("An account with this email already exists")).toBeVisible();
  });

  test("login errors say what is wrong", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Please enter your password.")).toBeVisible();
    await page.locator("#email").fill("not-an-email");
    await page.locator("#password").fill("x");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page.getByText("doesn't look like an email address")).toBeVisible();
    await page.locator("#email").fill("nobody@example.com");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page.getByText("email or password is incorrect")).toBeVisible();
  });

  test("signup password rules are explained", async ({ page }) => {
    await page.goto("/auth/register");
    await page.locator("#email").fill("a@example.com");
    await page.locator("#password").fill("short");
    await page.getByRole("button", { name: "Signup", exact: true }).click();
    await expect(page.getByText("at least 8 characters long")).toBeVisible();
    await page.locator("#password").fill("longpassword");
    await page.getByRole("button", { name: "Signup", exact: true }).click();
    await expect(page.getByText("at least one letter and one number")).toBeVisible();
    await page.locator("#password").fill("Passw0rd1");
    await page.locator("#phone").fill("12ab");
    await page.getByRole("button", { name: "Signup", exact: true }).click();
    await expect(page.getByText("Enter a valid phone number")).toBeVisible();
  });

  test("the eye icon shows and hides the password", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator("#password").fill("secret123");
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(page.locator("#password")).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
  });

  test("forgot password page links back to login and explains errors", async ({ page }) => {
    await page.goto("/auth/forgotPassword");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await page.getByRole("link", { name: "Back to login" }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("Google login signs the user in", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("button", { name: "Login with Google" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("button", { name: "Account menu" })).toBeVisible();
  });
});

test.describe("logged-in features", () => {
  test("the account menu closes when clicking outside", async ({ page }) => {
    await signUpAndLogin(page, uniq("menu"));
    await page.getByRole("button", { name: "Account menu" }).click();
    await expect(page.getByText("Signed in as")).toBeVisible();
    await page.mouse.click(300, 600);
    await expect(page.getByText("Signed in as")).toBeHidden();
  });

  test("each account has its own cart", async ({ page }) => {
    await signUpAndLogin(page, uniq("a"));
    await addFirstProduct(page, 1);
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByText("Sign out").click();
    await expect(page.getByTestId("cart-count").first()).toHaveCount(0);
    await signUpAndLogin(page, uniq("b"));
    await expect(page.getByTestId("cart-count").first()).toHaveCount(0);
  });

  test("a user's cart comes back after logging in again", async ({ page }) => {
    const email = uniq("back");
    await signUpAndLogin(page, email);
    await addFirstProduct(page, 1);
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByText("Sign out").click();
    await page.goto("/auth/login");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill("Passw0rd1");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page.getByTestId("cart-count").first()).toHaveText("1");
  });

  test("paying while logged in saves the order in History and sends a message", async ({ page }) => {
    await signUpAndLogin(page, uniq("pay"));
    // welcome message is unread first
    await expect(page.getByTestId("unread-count").first()).toHaveText("1");
    await addFirstProduct(page, 1);
    await checkout(page);
    await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
    const number = await page.getByTestId("order-number").innerText();
    await expect(page.getByTestId("toast")).toContainText(number);
    await expect(page.getByTestId("unread-count").first()).toHaveText("2");
    await page.goto("/history");
    await expect(page.getByTestId("order")).toHaveCount(1);
    await expect(page.getByTestId("order")).toContainText(number);
    await page.getByRole("link", { name: /Messages/ }).click();
    await expect(page.getByTestId("message").first()).toContainText(number);
    await page.getByRole("button", { name: "Mark all as read" }).click();
    await expect(page.getByTestId("unread-count").first()).toHaveCount(0);
  });

  test("guest orders are not saved to History", async ({ page }) => {
    await addFirstProduct(page, 1);
    await checkout(page);
    await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
    await page.goto("/history");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("orders of one account are not visible to another", async ({ page }) => {
    await signUpAndLogin(page, uniq("o1"));
    await addFirstProduct(page, 1);
    await checkout(page);
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByText("Sign out").click();
    await signUpAndLogin(page, uniq("o2"));
    await page.goto("/history");
    await expect(page.getByTestId("order")).toHaveCount(0);
  });
});
