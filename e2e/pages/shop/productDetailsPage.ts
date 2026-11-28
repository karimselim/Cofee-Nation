import { expect, Locator, Page } from "@playwright/test";

export class ProductDetailsPage {
  private readonly title: Locator;
  private readonly addToCartButton: Locator;
  private readonly quantityInput: Locator;
  private readonly total: Locator;
  private readonly saveButton: Locator;
  private readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.title = this.page.getByRole("heading", { level: 1 });
    this.addToCartButton = this.page.getByRole("button", { name: "Add To Cart", exact: true });
    this.quantityInput = this.page.getByLabel("Quantity");
    this.total = this.page.getByTestId("product-total");
    this.saveButton = this.page.getByRole("button", { name: /save to favourites/i });
    this.cartBadge = this.page.getByTestId("cart-count").first();
  }

  async open(slug: string): Promise<void> {
    await this.page.goto(`/products/${slug.split("-")[0] === "coffee" ? "1" : "2"}/${slug.split("-")[1]}`);
    await expect(this.title).toBeVisible();
  }

  getTitle(): Locator {
    return this.title;
  }

  getTotal(): Locator {
    return this.total;
  }

  async increaseQuantity(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.page.getByRole("button", { name: "Increase quantity" }).click();
    }
  }

  async chooseSize(size: "R" | "L" | "XL"): Promise<void> {
    const label = { R: "Regular", L: "Large", XL: "Extra large" }[size];
    await this.page.getByRole("radio", { name: new RegExp(`^${label},`) }).click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await expect(this.page.getByRole("button", { name: /added to cart/i })).toBeVisible();
  }

  async saveToFavourites(): Promise<void> {
    await this.saveButton.click();
  }

  getCartBadge(): Locator {
    return this.cartBadge;
  }

  getSizeRadio(size: "R" | "L" | "XL"): Locator {
    const label = { R: "Regular", L: "Large", XL: "Extra large" }[size];
    return this.page.getByRole("radio", { name: new RegExp(`^${label},`) });
  }

  getDeliveryOption(name: "Dine In" | "Door Delivery" | "Pickup"): Locator {
    return this.page.getByRole("button", { name, exact: true });
  }

  getWhenButton(answer: "Yes" | "No"): Locator {
    return this.page.getByRole("button", { name: answer, exact: true });
  }

  getTimeInput(): Locator {
    return this.page.getByLabel("Set Time");
  }

  getArrowAddButton(): Locator {
    return this.page.getByRole("button", { name: "Add to cart", exact: true });
  }
}
