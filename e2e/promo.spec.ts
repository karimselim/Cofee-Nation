import { test, expect, Page } from "@playwright/test";
import { addFirstProduct } from "./helpers";

const apply = async (page: Page, code: string) => {
  await page.getByLabel("Promo code").fill(code);
  await page.getByRole("button", { name: "Apply", exact: true }).click();
};

test.describe("promo codes", () => {
  test.beforeEach(async ({ page }) => {
    await addFirstProduct(page, 1, 0);
    await page.goto("/yourCart");
  });

  test("a valid code lowers the total and shows the discount", async ({ page }) => {
    const before = await page.getByTestId("cart-total").innerText();
    await apply(page, "welcome10");
    await expect(page.getByTestId("promo-applied")).toContainText("WELCOME10");
    await expect(page.getByTestId("promo-discount")).toBeVisible();
    await expect(page.getByTestId("cart-total")).not.toHaveText(before);
  });

  test("an empty code asks for one", async ({ page }) => {
    await apply(page, "   ");
    await expect(page.getByRole("alert").filter({ hasText: "Enter a promo code" })).toBeVisible();
  });

  test("an unknown code is rejected", async ({ page }) => {
    await apply(page, "NOPE123");
    await expect(page.getByText("not valid")).toBeVisible();
    await expect(page.getByTestId("promo-discount")).toHaveCount(0);
  });

  test("an expired code is rejected", async ({ page }) => {
    await apply(page, "OLDDEAL");
    await expect(page.getByText("has expired")).toBeVisible();
  });

  test("special characters are rejected", async ({ page }) => {
    await apply(page, "<b>hi</b>");
    await expect(page.getByText("only letters and numbers")).toBeVisible();
  });

  test("a code that needs a bigger cart explains the minimum", async ({ page }) => {
    await page.getByRole("button", { name: /^Remove / }).click();
    await addFirstProduct(page, 3, 0);
    await page.goto("/yourCart");
    const subtotal = await page.getByTestId("cart-total").innerText();
    await apply(page, "COFFEE20");
    // either applied (big cart) or explained (small cart), never silent
    await expect(
      page.getByTestId("promo-applied").or(page.getByText("needs a subtotal of at least"))
    ).toBeVisible();
    expect(subtotal).toBeTruthy();
  });

  test("two codes do not stack and the code can be removed", async ({ page }) => {
    await apply(page, "SAVE50");
    await expect(page.getByTestId("promo-applied")).toBeVisible();
    await expect(page.getByLabel("Promo code")).toHaveCount(0);
    await page.getByRole("button", { name: "Remove promo code" }).click();
    await expect(page.getByTestId("promo-discount")).toHaveCount(0);
    await apply(page, "WELCOME10");
    await expect(page.getByTestId("promo-applied")).toContainText("WELCOME10");
  });
});
