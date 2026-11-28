import { expect, Locator, Page } from "@playwright/test";

/** The signed-in account menu in the header: open it, read it, sign out. */
export class AccountMenu {
  private readonly button: Locator;
  private readonly signedInLabel: Locator;

  constructor(private readonly page: Page) {
    this.button = this.page.getByRole("button", { name: "Account menu" });
    this.signedInLabel = this.page.getByText("Signed in as");
  }

  getButton(): Locator {
    return this.button;
  }

  async open(): Promise<void> {
    await this.button.click();
    await expect(this.signedInLabel).toBeVisible();
  }

  getSignedInLabel(): Locator {
    return this.signedInLabel;
  }

  async signOut(): Promise<void> {
    await this.open();
    await this.page.getByText("Sign out").click();
  }
}
