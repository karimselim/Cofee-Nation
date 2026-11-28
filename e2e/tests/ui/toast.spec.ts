import { expect, test } from "../../fixtures/base";

test.describe("Notification banner", () => {
  test("slides in, then slides out and is removed when dismissed", async ({ productDetailsPage, toast }) => {
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.addToCart();
    await expect(toast.getToast()).toBeVisible();
    await expect(toast.getToast()).toHaveCSS("animation-name", "toast-in");
    await toast.dismiss();
    await expect(toast.getToast()).toHaveAttribute("data-state", "leaving");
    await expect(toast.getToast()).toHaveCSS("animation-name", "toast-out");
    await expect(toast.getToast()).toHaveCount(0);
  });

  test("goes away by itself after a few seconds", async ({ productDetailsPage, toast }) => {
    await productDetailsPage.open("coffee-1");
    await productDetailsPage.addToCart();
    await expect(toast.getToast()).toBeVisible();
    await expect(toast.getToast()).toHaveCount(0, { timeout: 9000 });
  });
});
