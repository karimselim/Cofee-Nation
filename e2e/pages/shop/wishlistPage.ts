import { expect, Locator, Page } from "@playwright/test";

export class WishlistPage {
  private readonly items: Locator;

  constructor(private readonly page: Page) {
    this.items = this.page.getByTestId("wishlist-item");
  }

  async open(): Promise<void> {
    await this.page.goto("/wishlist");
    await expect(this.page.getByRole("heading", { name: /your favourites/i })).toBeVisible();
  }

  getItems(): Locator {
    return this.items;
  }

  async removeFirst(): Promise<void> {
    await this.page.getByRole("button", { name: /^Remove / }).first().click();
  }

  getEmptyState(): Locator {
    return this.page.getByText(/no favourites yet/i);
  }
}
