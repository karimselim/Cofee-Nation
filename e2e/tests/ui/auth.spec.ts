import { expect, test } from "../../fixtures/base";

test.describe("Auth pages", () => {
  test("the login form hides the password and explains empty input", async ({ loginPage, page }) => {
    await loginPage.open();
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
    await loginPage.login("", "");
    await expect(loginPage.getError()).toContainText(/email address/i);
  });

  test("login and signup link to each other", async ({ loginPage, page }) => {
    await loginPage.open();
    await page.getByRole("link", { name: /^Signup$/ }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await page.getByRole("link", { name: /Login here/i }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("history is protected and sends a guest to login", async ({ page }) => {
    await page.goto("/history");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("the Google mark is served locally, not from an outside host", async ({ loginPage, page }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      if (/wikimedia|googleusercontent/.test(request.url())) external.push(request.url());
    });
    await loginPage.open();
    await page.waitForLoadState("networkidle");
    expect(external).toEqual([]);
  });
});
