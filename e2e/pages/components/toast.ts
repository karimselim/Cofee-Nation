import { Locator, Page } from "@playwright/test";

/** The notification banner that slides in for cart, order and error messages. */
export class Toast {
  private readonly toast: Locator;
  private readonly dismissButton: Locator;

  constructor(private readonly page: Page) {
    this.toast = this.page.getByTestId("toast");
    this.dismissButton = this.page.getByRole("button", { name: "Dismiss message" });
  }

  getToast(): Locator {
    return this.toast;
  }

  async dismiss(): Promise<void> {
    await this.dismissButton.click();
  }
}
