import { expect, Locator, Page } from "@playwright/test";

export class ProductsPage {
  private readonly searchInput: Locator;
  private readonly maxPriceInput: Locator;
  private readonly sortButton: Locator;
  private readonly productCards: Locator;
  private readonly nextButton: Locator;
  private readonly previousButton: Locator;
  private readonly pageInput: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = this.page.locator("#product-search");
    this.maxPriceInput = this.page.locator("#product-max");
    this.sortButton = this.page.getByRole("button", { name: /sort by/i });
    this.productCards = this.page.locator('a[href^="/products/"]:has(img)');
    this.nextButton = this.page.getByRole("button", { name: "Next", exact: true });
    this.previousButton = this.page.getByRole("button", { name: "Previous", exact: true });
    this.pageInput = this.page.locator("#page-input");
  }

  async open(tab = ""): Promise<void> {
    await this.page.goto(`/products${tab}`);
    await expect(this.searchInput).toBeVisible();
  }

  async openCategory(tab: "1" | "2" | "3" | "4"): Promise<void> {
    await this.open(`/${tab}`);
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async setMaxPrice(value: string): Promise<void> {
    await this.maxPriceInput.fill(value);
  }

  async sortBy(label: string): Promise<void> {
    await this.sortButton.click();
    await this.page.getByRole("option", { name: label, exact: true }).click();
  }

  getCards(): Locator {
    return this.productCards;
  }

  getCardTitles(): Locator {
    return this.page.getByTestId("title");
  }

  getCardPrices(): Locator {
    return this.page.getByTestId("price");
  }

  async getPriceValues(): Promise<number[]> {
    const texts = await this.getCardPrices().allInnerTexts();
    return texts.map((t) => Number(t.replace(/[^\d.]/g, "")));
  }

  async openFirstProduct(): Promise<void> {
    await this.productCards.first().click();
    await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
  }

  async nextPage(): Promise<void> {
    await this.nextButton.click();
  }

  async previousPage(): Promise<void> {
    await this.previousButton.click();
  }

  async goToPage(page: number): Promise<void> {
    await this.pageInput.fill(String(page));
    await this.pageInput.press("Enter");
  }

  getPageInput(): Locator {
    return this.pageInput;
  }

  getNextButton(): Locator {
    return this.nextButton;
  }

  getPreviousButton(): Locator {
    return this.previousButton;
  }

  getEmptyMessage(): Locator {
    return this.page.getByRole("status").filter({ hasText: /no products match/i });
  }
}
