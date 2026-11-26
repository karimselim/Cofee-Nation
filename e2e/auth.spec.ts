import { test, expect } from "@playwright/test";

test.describe("auth pages", () => {
  test("login form hides the password and shows errors for empty input", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByPlaceholder("Enter your password")).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page.getByText(/valid email|required|enter/i).first()).toBeVisible();
  });

  test("login and register pages link to each other", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("link", { name: "Signup" }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await page.getByRole("link", { name: "Login here" }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("history is protected and redirects guests to login", async ({ page }) => {
    await page.goto("/history");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("Google logo is served locally", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (r) => {
      if (/wikimedia/.test(r.url())) external.push(r.url());
    });
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");
    expect(external).toEqual([]);
  });
});
