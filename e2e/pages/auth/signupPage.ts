import { expect, Locator, Page } from "@playwright/test";

export class SignupPage {
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submit: Locator;

  constructor(private readonly page: Page) {
    this.email = this.page.locator("#email");
    this.password = this.page.locator("#password");
    this.submit = this.page.getByRole("button", { name: "Signup", exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto("/auth/register");
    await expect(this.email).toBeVisible();
  }

  async signUp(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  /** The fake auth used in CI has no email server; this marks the address verified. */
  async verifyEmail(email: string): Promise<void> {
    await expect(this.page.getByText(/check your email/i)).toBeVisible();
    await this.page.evaluate((e) => window.__verifyFakeEmail?.(e), email);
  }
}

declare global {
  interface Window {
    __verifyFakeEmail?: (email: string) => void;
  }
}
