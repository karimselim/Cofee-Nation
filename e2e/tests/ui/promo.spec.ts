import { expect, test } from "../../fixtures/base";
import { addFirstProductAndOpenCart } from "./helpers";

test.describe("Promo codes", () => {
  test("a valid code lowers the total and shows the discount", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    const before = await cartPage.getTotal().innerText();
    await cartPage.applyPromo("welcome10");
    await expect(cartPage.getPromoApplied()).toContainText("WELCOME10");
    await expect(cartPage.getPromoDiscount()).toBeVisible();
    await expect(cartPage.getTotal()).not.toHaveText(before);
  });

  test("an empty code asks for one", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.applyPromo("   ");
    await expect(cartPage.getError(/enter a promo code/i)).toBeVisible();
  });

  test("an unknown code is refused", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.applyPromo("NOPE123");
    await expect(cartPage.getError(/not valid/i)).toBeVisible();
    await expect(cartPage.getPromoDiscount()).toHaveCount(0);
  });

  test("an expired code is refused", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.applyPromo("OLDDEAL");
    await expect(page.getByText(/has expired/i)).toBeVisible();
  });

  test("special characters are refused", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.applyPromo("<b>hi</b>");
    await expect(page.getByText(/only letters and numbers/i)).toBeVisible();
  });

  test("a code that needs a bigger cart explains the minimum", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.applyPromo("COFFEE20");
    await expect(cartPage.getPromoApplied().or(page.getByText(/needs a subtotal of at least/i))).toBeVisible();
  });

  test("two codes do not stack and the code can be removed", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.applyPromo("SAVE50");
    await expect(cartPage.getPromoApplied()).toBeVisible();
    await expect(cartPage.getPromoInput()).toHaveCount(0);
    await cartPage.removePromo();
    await expect(cartPage.getPromoDiscount()).toHaveCount(0);
    await cartPage.applyPromo("WELCOME10");
    await expect(cartPage.getPromoApplied()).toContainText("WELCOME10");
  });
});
