import { test, expect } from "@playwright/test";
import { addFirstProduct } from "./helpers";

test.describe("English / Arabic", () => {
  test("default is English, left to right", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("Arabic switches the text and flips the page to right to left", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "التبديل إلى العربية" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("link", { name: "المنتجات" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "تسجيل الدخول" })).toBeVisible();
  });

  test("the language is remembered and can be switched back", async ({ page }) => {
    await page.goto("/products/1");
    await page.getByRole("button", { name: "التبديل إلى العربية" }).click();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByText("ابحث بالاسم").or(page.getByPlaceholder("ابحث بالاسم")).first()).toBeVisible();
    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByPlaceholder("Search by name")).toBeVisible();
  });

  test("the cart is translated too", async ({ page }) => {
    await addFirstProduct(page, 1);
    await page.getByRole("button", { name: "التبديل إلى العربية" }).click();
    await page.goto("/yourCart");
    await expect(page.getByText("ملخص الطلب")).toBeVisible();
    await expect(page.getByText("الإجمالي")).toBeVisible();
    await expect(page.getByTestId("cart-total")).toBeVisible();
  });
});
