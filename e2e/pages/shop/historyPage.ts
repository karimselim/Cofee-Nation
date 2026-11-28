import { expect, Locator, Page } from "@playwright/test";

export class HistoryPage {
  private readonly heading: Locator;
  private readonly orders: Locator;

  constructor(private readonly page: Page) {
    this.heading = this.page.getByRole("heading", { level: 1 });
    this.orders = this.page.getByTestId("order");
  }

  async open(): Promise<void> {
    await this.page.goto("/history");
    await expect(this.heading).toBeVisible();
  }

  getOrders(): Locator {
    return this.orders;
  }
}
