import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submit: Locator;

  constructor(private readonly page: Page) {
    this.email = this.page.locator("#email");
    this.password = this.page.locator("#password");
    this.submit = this.page.getByRole("button", { name: "Login", exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto("/auth/login");
    await expect(this.email).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  getError(): Locator {
    return this.page.getByRole("alert").filter({ hasText: /\w/ }).first();
  }
}
