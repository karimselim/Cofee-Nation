import { expect, test } from "../../fixtures/base";
import { addFirstProductAndOpenCart, payCart } from "./helpers";

test.describe("Checkout validation", () => {
  test("the address must be long enough and contain letters", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.chooseDelivery("Door Delivery");
    await cartPage.setAddress("abc");
    await payCart(cartPage);
    await expect(page.getByText("The address is too short")).toBeVisible();

    await cartPage.setAddress("1234567890123");
    await cartPage.confirm();
    await expect(page.getByText("must contain letters")).toBeVisible();
  });

  test("a typed address is validated even for pickup", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.setAddress("xx");
    await payCart(cartPage);
    await expect(page.getByText("The address is too short")).toBeVisible();
  });

  test("notes longer than 200 characters are rejected", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.setNotes("n".repeat(201));
    await payCart(cartPage);
    await expect(page.getByText("200 characters at most")).toBeVisible();
  });

  test("a later time is required and must be inside the opening hours", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.chooseWhen("No");
    await payCart(cartPage);
    await expect(page.getByText("choose the time")).toBeVisible();

    await cartPage.setTime("03:00");
    await cartPage.confirm();
    await expect(page.getByText("We are open from")).toBeVisible();
  });

  test("the time field refuses times outside 09:00-22:00 and accepts valid ones", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.chooseWhen("No");
    await cartPage.setTime("06:00");
    await expect(cartPage.getTimeError()).toContainText(/open from 09:00 to 22:00/i);
    await cartPage.setTime("22:30");
    await expect(cartPage.getTimeError()).toContainText(/open from 09:00 to 22:00/i);
    await cartPage.setTime("25:00");
    await expect(cartPage.getTimeError()).toContainText(/real time/i);
    await cartPage.setTime("09:00");
    await expect(cartPage.getTimeError()).toHaveCount(0);
    await cartPage.setTime("22:00");
    await expect(cartPage.getTimeError()).toHaveCount(0);
  });

  test("a half-typed time like 6 cannot be paid", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.chooseWhen("No");
    await cartPage.setTime("6");
    await payCart(cartPage);
    await expect(page.getByText("Enter a real time")).toBeVisible();
    await expect(cartPage.getConfirmHeading()).toHaveCount(0);
  });

  test("a pickup order with no address can be paid", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await payCart(cartPage);
    await expect(cartPage.getConfirmHeading()).toBeVisible();
  });

  test("clicking the text of a payment option selects it, and there is no edit button", async ({ cartPage, page }) => {
    await addFirstProductAndOpenCart(page, cartPage);
    await cartPage.choosePaymentByText("Bank account");
    await expect(page.getByRole("radio", { name: "Bank account" })).toBeChecked();
    await expect(page.getByRole("button", { name: /^edit$/i })).toHaveCount(0);
    await cartPage.setAddress("typing works right away");
    await expect(cartPage.getAddressInput()).toHaveValue("typing works right away");
  });
});
