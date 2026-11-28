import { expect, Locator, Page } from "@playwright/test";

export class MessagesPage {
  private readonly heading: Locator;
  private readonly messages: Locator;
  private readonly markAllReadButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = this.page.getByRole("heading", { name: "Messages" });
    this.messages = this.page.getByTestId("message");
    this.markAllReadButton = this.page.getByRole("button", { name: "Mark all as read" });
  }

  async open(): Promise<void> {
    await this.page.goto("/messages");
    await expect(this.heading).toBeVisible();
  }

  getMessages(): Locator {
    return this.messages;
  }

  async markAllAsRead(): Promise<void> {
    await this.markAllReadButton.click();
  }
}
