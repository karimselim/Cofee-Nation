import { expect, test } from "../../fixtures/base";
import { addFirstProductToCart } from "./helpers";
import { ADDRESS, VALID_CHECKOUT } from "../../test-data/checkout";

test.describe("Cart and checkout", () => {
  test("an empty cart cannot be paid for", async ({ cartPage }) => {
    await cartPage.open();
    await expect(cartPage.getLines()).toHaveCount(0);
    await cartPage.confirm();
    await expect(cartPage.getError(/cart is empty/i)).toBeVisible();
  });

  test("shows the line, the totals and the cart badge", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await expect(cartPage.getLines()).toHaveCount(1);
    await expect(page.getByTestId("cart-count").first()).toHaveText("1");
    await expect(cartPage.getTotal()).toContainText("120.75");
  });

  test("changing the quantity updates the total but not the badge", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await cartPage.increaseFirstLine();
    await expect(cartPage.getTotal()).toContainText("241.5");
    await expect(page.getByTestId("cart-count").first()).toHaveText("1");
  });

  test("removing the line empties the cart", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await cartPage.removeFirstLine();
    await expect(cartPage.getLines()).toHaveCount(0);
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test("a promo code discounts the cart and can be removed", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await cartPage.applyPromo("welcome10");
    await expect(page.getByTestId("promo-applied")).toContainText("WELCOME10");
    await expect(page.getByTestId("promo-discount")).toBeVisible();
    await cartPage.removePromo();
    await expect(page.getByTestId("promo-discount")).toHaveCount(0);
  });

  test("an unknown promo code is refused", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await cartPage.applyPromo("NOPE123");
    await expect(cartPage.getError(/not valid/i)).toBeVisible();
  });

  test("a delivery time outside the opening hours is refused while typing", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await cartPage.chooseWhen("No");
    await cartPage.setTime("06:00");
    await expect(cartPage.getTimeError()).toContainText(/open from 09:00 to 22:00/i);
    await cartPage.setTime("25:00");
    await expect(cartPage.getTimeError()).toContainText(/real time/i);
    await cartPage.setTime("15:30");
    await expect(cartPage.getTimeError()).toHaveCount(0);
  });

  test("door delivery needs an address", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await cartPage.chooseDelivery("Door Delivery");
    await cartPage.chooseWhen("Yes");
    await cartPage.choosePayment("Cash on delivery");
    await cartPage.confirm();
    await expect(cartPage.getError(/delivery address/i)).toBeVisible();
    await cartPage.setAddress(ADDRESS);
    await cartPage.confirm();
    await cartPage.expectOrderConfirmed();
  });

  test("a pickup order goes through to the confirmation", async ({ cartPage, page }) => {
    await addFirstProductToCart(page);
    await cartPage.open();
    await cartPage.chooseDelivery("Pickup");
    await cartPage.chooseWhen("No");
    await cartPage.setTime(VALID_CHECKOUT.time);
    await cartPage.choosePayment("Cash on delivery");
    await cartPage.confirm();
    await cartPage.expectOrderConfirmed();
    await expect(page.getByText(/no payment was taken/i)).toBeVisible();
  });
});
