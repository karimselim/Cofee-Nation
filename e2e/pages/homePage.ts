import { expect, Locator, Page } from "@playwright/test";

export class HomePage {
  private readonly heroHeading: Locator;
  private readonly nav: Locator;
  private readonly footer: Locator;

  constructor(private readonly page: Page) {
    this.heroHeading = this.page.getByRole("heading", { level: 1 });
    this.nav = this.page.getByRole("navigation").first();
    this.footer = this.page.locator("footer").first();
  }

  async open(): Promise<void> {
    await this.page.goto("/");
    await expect(this.heroHeading).toBeVisible();
  }

  getHeroHeading(): Locator {
    return this.heroHeading;
  }

  getNavLink(name: RegExp | string): Locator {
    return this.nav.getByRole("link", { name });
  }

  getFooter(): Locator {
    return this.footer;
  }

  async openMenu(): Promise<void> {
    await this.page.getByRole("button", { name: "Open menu" }).click();
  }

  getSideMenu(): Locator {
    return this.page.getByRole("button", { name: "Close menu" });
  }

  async expectSectionsVisible(): Promise<void> {
    for (const name of [
      /people's favorite/i,
      /we provide good coffee/i,
      /our partner/i,
      /loved by customer/i,
    ]) {
      await expect(this.page.getByRole("heading", { name })).toBeVisible();
    }
  }
}
