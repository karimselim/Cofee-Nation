import { expect, test } from "../../fixtures/base";
import { addFirstProductAndOpenCart, payCart, registerAndLogin } from "./helpers";
import { newUser } from "../../test-data/auth";

test.describe("Signup, login and error messages", () => {
  test("signup asks to verify the email and does not log in", async ({ signupPage, page }) => {
    const user = newUser();
    await signupPage.open();
    await signupPage.signUp(user.email, user.password);
    await expect(page.getByText("Check your email")).toBeVisible();
    await page.goto("/history");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("an unverified email cannot log in and can ask for a new link", async ({ signupPage, loginPage, page }) => {
    const user = newUser();
    await signupPage.open();
    await signupPage.signUp(user.email, user.password);
    await loginPage.open();
    await loginPage.login(user.email, user.password);
    await expect(page.getByText("Please verify your email first")).toBeVisible();
    await page.getByRole("button", { name: "Send the verification email again" }).click();
    await expect(page.getByText("We sent a new verification link")).toBeVisible();
  });

  test("signing up twice with one email says the email is taken", async ({ signupPage, page }) => {
    const user = newUser();
    await signupPage.open();
    await signupPage.signUp(user.email, user.password);
    await signupPage.open();
    await signupPage.signUp(user.email, user.password);
    await expect(page.getByText("An account with this email already exists")).toBeVisible();
  });

  test("login errors say what is wrong", async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login("", "");
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Please enter your password.")).toBeVisible();

    await loginPage.login("not-an-email", "x");
    await expect(page.getByText("doesn't look like an email address")).toBeVisible();

    await loginPage.login("nobody@example.com", "Passw0rd1");
    await expect(page.getByText("email or password is incorrect")).toBeVisible();
  });

  test("the signup password and phone rules are explained", async ({ signupPage, page }) => {
    const user = newUser();
    await signupPage.open();
    await signupPage.signUp(user.email, "short");
    await expect(page.getByText("at least 8 characters long")).toBeVisible();

    await signupPage.signUp(user.email, "longpassword");
    await expect(page.getByText("at least one letter and one number")).toBeVisible();

    // a valid password with a bad phone number: the form stays so the error can be read
    await page.locator("#password").fill(user.password);
    await page.locator("#phone").fill("12ab");
    await page.getByRole("button", { name: "Signup", exact: true }).click();
    await expect(page.getByText("Enter a valid phone number")).toBeVisible();
  });

  test("the eye icon shows and hides the password", async ({ loginPage, page }) => {
    await loginPage.open();
    await page.locator("#password").fill("secret123");
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(page.locator("#password")).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
  });

  test("the forgot password page explains errors and links back to login", async ({ page }) => {
    await page.goto("/auth/forgotPassword");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await page.getByRole("link", { name: "Back to login" }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("Google login signs the user in", async ({ loginPage, accountMenu, page }) => {
    await loginPage.open();
    await page.getByRole("button", { name: "Login with Google" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(accountMenu.getButton()).toBeVisible();
  });
});

test.describe("Logged-in features", () => {
  test("the account menu closes when clicking outside", async ({ signupPage, loginPage, accountMenu, page }) => {
    await registerAndLogin(page, signupPage, loginPage);
    await accountMenu.open();
    await page.mouse.click(300, 600);
    await expect(accountMenu.getSignedInLabel()).toBeHidden();
  });

  test("each account has its own cart", async ({ signupPage, loginPage, accountMenu, productDetailsPage, page }) => {
    await registerAndLogin(page, signupPage, loginPage);
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.getCartBadge()).toHaveText("1");
    await accountMenu.signOut();
    await expect(page.getByTestId("cart-count")).toHaveCount(0);
    await registerAndLogin(page, signupPage, loginPage);
    await expect(page.getByTestId("cart-count")).toHaveCount(0);
  });

  test("a user's cart comes back after logging in again", async ({ signupPage, loginPage, accountMenu, productDetailsPage, page }) => {
    const user = await registerAndLogin(page, signupPage, loginPage);
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.addToCart();
    await accountMenu.signOut();
    await loginPage.open();
    await loginPage.login(user.email, user.password);
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByTestId("cart-count").first()).toHaveText("1");
  });

  test("paying while logged in saves the order in History and sends a message", async ({
    signupPage,
    loginPage,
    cartPage,
    historyPage,
    messagesPage,
    toast,
    page,
  }) => {
    await registerAndLogin(page, signupPage, loginPage);
    // the welcome message is unread first
    await expect(page.getByTestId("unread-count").first()).toHaveText("1");

    await addFirstProductAndOpenCart(page, cartPage);
    await payCart(cartPage);
    await expect(cartPage.getConfirmHeading()).toBeVisible();
    const number = await cartPage.getOrderNumber().innerText();
    await expect(toast.getToast()).toContainText(number);
    await expect(page.getByTestId("unread-count").first()).toHaveText("2");

    await historyPage.open();
    await expect(historyPage.getOrders()).toHaveCount(1);
    await expect(historyPage.getOrders().first()).toContainText(number);

    await messagesPage.open();
    await expect(messagesPage.getMessages().first()).toContainText(number);
    await messagesPage.markAllAsRead();
    await expect(page.getByTestId("unread-count")).toHaveCount(0);
  });

  test("guest orders are not saved to History", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await payCart(cartPage);
    await expect(cartPage.getConfirmHeading()).toBeVisible();
    await page.goto("/history");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("orders of one account are not visible to another", async ({
    signupPage,
    loginPage,
    accountMenu,
    cartPage,
    historyPage,
    page,
  }) => {
    await registerAndLogin(page, signupPage, loginPage);
    await addFirstProductAndOpenCart(page, cartPage);
    await payCart(cartPage);
    await expect(cartPage.getConfirmHeading()).toBeVisible();

    await accountMenu.signOut();
    await registerAndLogin(page, signupPage, loginPage);
    await historyPage.open();
    await expect(historyPage.getOrders()).toHaveCount(0);
  });
});
