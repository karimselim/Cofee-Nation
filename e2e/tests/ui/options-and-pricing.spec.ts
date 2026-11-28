import { expect, test } from "../../fixtures/base";
import { addFirstProductAndOpenCart } from "./helpers";

const money = (text: string) => Number(text.replace(/[^0-9.]/g, ""));

test.describe("Size, quantity and price", () => {
  test("the price follows the quantity", async ({ productDetailsPage }) => {
    await productDetailsPage.open("coffee-1");
    const single = money(await productDetailsPage.getTotal().innerText());
    await productDetailsPage.increaseQuantity(2);
    expect(money(await productDetailsPage.getTotal().innerText())).toBe(single * 3);
  });

  test("a larger size costs more", async ({ productDetailsPage }) => {
    await productDetailsPage.open("coffee-1");
    const regular = money(await productDetailsPage.getTotal().innerText());
    await productDetailsPage.chooseSize("L");
    const large = money(await productDetailsPage.getTotal().innerText());
    await productDetailsPage.chooseSize("XL");
    const extraLarge = money(await productDetailsPage.getTotal().innerText());
    expect(large).toBeGreaterThan(regular);
    expect(extraLarge).toBeGreaterThan(large);
  });

  test("the chosen size and quantity reach the cart with the right price", async ({ productDetailsPage, cartPage }) => {
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.chooseSize("L");
    await productDetailsPage.increaseQuantity(1);
    const expected = money(await productDetailsPage.getTotal().innerText());
    await productDetailsPage.addToCart();
    await cartPage.openFromHeader();
    const line = cartPage.getLine(0);
    await expect(line).toContainText("Size L");
    await expect(line.getByLabel("Quantity")).toHaveText("2");
    await expect(line).toContainText(expected.toString());
  });

  test("the same product in two sizes makes two cart lines", async ({ productDetailsPage, cartPage }) => {
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.addToCart();
    await productDetailsPage.chooseSize("L");
    await productDetailsPage.addToCart();
    await cartPage.openFromHeader();
    await expect(cartPage.getLines()).toHaveCount(2);
  });

  test("the arrow button adds the item to the cart", async ({ productDetailsPage }) => {
    await productDetailsPage.open("iced-1");
    await productDetailsPage.getArrowAddButton().click();
    await expect(productDetailsPage.getCartBadge()).toHaveText("1");
  });

  test("the delivery options chosen on the product page show in the cart", async ({ productDetailsPage, cartPage }) => {
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.getDeliveryOption("Door Delivery").click();
    await productDetailsPage.getWhenButton("No").click();
    await productDetailsPage.getTimeInput().fill("15:30");
    await productDetailsPage.addToCart();
    await cartPage.openFromHeader();
    await expect(cartPage.getDeliveryButton("Door Delivery")).toHaveAttribute("aria-pressed", "true");
    await expect(cartPage.getTimeInput()).toHaveValue("15:30");
  });
});

test.describe("Cart badge", () => {
  test("the badge counts cart lines, not units", async ({ homePage, productDetailsPage, page }) => {
    await homePage.open();
    await expect(page.getByTestId("cart-count")).toHaveCount(0);
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.increaseQuantity(2);
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.getCartBadge()).toHaveText("1");
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.getCartBadge()).toHaveText("1");
    await productDetailsPage.open("iced-1");
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.getCartBadge()).toHaveText("2");
  });

  test("the badge number is centred in its circle", async ({ productDetailsPage }) => {
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.addToCart();
    const badge = productDetailsPage.getCartBadge();
    await expect(badge).toHaveCSS("justify-content", "center");
    await expect(badge).toHaveCSS("align-items", "center");
    await expect(badge).toHaveCSS("text-align", "center");
  });
});
