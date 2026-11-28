import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
  private readonly total: Locator;
  private readonly promoInput: Locator;
  private readonly promoApply: Locator;
  private readonly timeInput: Locator;
  private readonly addressInput: Locator;
  private readonly notesInput: Locator;
  private readonly confirmButton: Locator;
  private readonly orderNumber: Locator;

  constructor(private readonly page: Page) {
    this.total = this.page.getByTestId("cart-total");
    this.promoInput = this.page.locator("#promo-code");
    this.promoApply = this.page.getByRole("button", { name: "Apply", exact: true });
    this.timeInput = this.page.locator("#order-time");
    this.addressInput = this.page.locator("#delivery-address");
    this.notesInput = this.page.locator("#order-notes");
    this.confirmButton = this.page.getByRole("button", { name: /confirm and pay/i });
    this.orderNumber = this.page.getByTestId("order-number");
  }

  async open(): Promise<void> {
    await this.page.goto("/yourCart");
    await expect(this.page.getByRole("heading", { name: /checkout your item now/i })).toBeVisible();
  }

  getTotal(): Locator {
    return this.total;
  }

  getLines(): Locator {
    return this.page.getByTestId("cart-line");
  }

  async chooseDelivery(method: "Dine In" | "Door Delivery" | "Pickup"): Promise<void> {
    await this.page.getByRole("button", { name: method, exact: true }).click();
  }

  async chooseWhen(answer: "Yes" | "No"): Promise<void> {
    await this.page.getByRole("group", { name: "When" }).getByRole("button", { name: answer, exact: true }).click();
  }

  async setTime(value: string): Promise<void> {
    await this.timeInput.fill(value);
  }

  getTimeInput(): Locator {
    return this.timeInput;
  }

  getTimeError(): Locator {
    return this.page.locator("#order-time-error");
  }

  async setAddress(value: string): Promise<void> {
    await this.addressInput.fill(value);
  }

  async setNotes(value: string): Promise<void> {
    await this.notesInput.fill(value);
  }

  async choosePayment(method: "Card" | "Bank account" | "Cash on delivery"): Promise<void> {
    await this.page.getByRole("radio", { name: new RegExp(method) }).check();
  }

  async applyPromo(code: string): Promise<void> {
    await this.promoInput.fill(code);
    await this.promoApply.click();
  }

  async removePromo(): Promise<void> {
    await this.page.getByRole("button", { name: /remove promo code/i }).click();
  }

  async increaseFirstLine(): Promise<void> {
    await this.page.getByRole("button", { name: /^Increase / }).first().click();
  }

  async decreaseFirstLine(): Promise<void> {
    await this.page.getByRole("button", { name: /^Decrease / }).first().click();
  }

  async removeFirstLine(): Promise<void> {
    await this.page.getByRole("button", { name: /^Remove / }).first().click();
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  getConfirmButton(): Locator {
    return this.confirmButton;
  }

  getOrderNumber(): Locator {
    return this.orderNumber;
  }

  async expectOrderConfirmed(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: /order confirmed/i })).toBeVisible();
    await expect(this.orderNumber).toHaveText(/^CN-\d{6}$/);
  }

  getError(text: RegExp | string): Locator {
    return this.page.getByRole("alert").filter({ hasText: text });
  }
}
