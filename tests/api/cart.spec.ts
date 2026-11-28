import { expect, test } from "../../fixtures/api-base";
import { BLACK_COFFEE } from "../../test-data/products";

test.describe("POST /api/cart/price", () => {
  test("prices a single line with tax and shipping", async ({ cartApi }) => {
    const { status, body } = await cartApi.price([
      { productId: BLACK_COFFEE.slug, size: "R", quantity: 1 },
    ]);
    expect(status).toBe(200);
    expect(body.subtotal).toBe(105);
    expect(body.tax).toBe(10.5);
    expect(body.shipping).toBe(5.25);
    expect(body.total).toBe(120.75);
    expect(body.lines[0].unit).toBe(105);
  });

  test("a larger size costs more and is rounded to five pounds", async ({ cartApi }) => {
    const { body } = await cartApi.price([{ productId: BLACK_COFFEE.slug, size: "L", quantity: 1 }]);
    expect(body.lines[0].unit).toBe(BLACK_COFFEE.largePrice);
    expect(body.subtotal).toBe(BLACK_COFFEE.largePrice);
  });

  test("multiplies the quantity", async ({ cartApi }) => {
    const { body } = await cartApi.price([{ productId: BLACK_COFFEE.slug, size: "R", quantity: 3 }]);
    expect(body.subtotal).toBe(315);
    expect(body.total).toBe(362.25);
  });

  test("refuses a quantity below one, an unknown product and an unknown size", async ({ cartApi }) => {
    const zero = await cartApi.price([{ productId: BLACK_COFFEE.slug, quantity: 0 }]);
    expect(zero.status).toBe(400);
    const fraction = await cartApi.price([{ productId: BLACK_COFFEE.slug, quantity: 1.5 }]);
    expect(fraction.status).toBe(400);
    const missing = await cartApi.price([{ productId: "coffee-999", quantity: 1 }]);
    expect(missing.status).toBe(400);
    const size = await cartApi.price([
      { productId: BLACK_COFFEE.slug, size: "XXL" as never, quantity: 1 },
    ]);
    expect(size.status).toBe(400);
  });

  test("an empty cart costs nothing", async ({ cartApi }) => {
    const { status, body } = await cartApi.price([]);
    expect(status).toBe(200);
    expect(body.subtotal).toBe(0);
    expect(body.total).toBe(0);
  });

  test("a promo code lowers the taxed amount", async ({ cartApi }) => {
    const { status, body } = await cartApi.price(
      [{ productId: BLACK_COFFEE.slug, size: "R", quantity: 1 }],
      "WELCOME10"
    );
    expect(status).toBe(200);
    expect(body.discount).toBe(11);
    expect(body.promoCode).toBe("WELCOME10");
    expect(body.tax).toBe(9.4);
    expect(body.total).toBe(108.1);
  });

  test("a promo that needs a bigger cart is refused", async ({ cartApi }) => {
    const { status, body } = await cartApi.price(
      [{ productId: BLACK_COFFEE.slug, size: "R", quantity: 1 }],
      "COFFEE20"
    );
    expect(status).toBe(400);
    expect((body as unknown as { error: string }).error).toContain("300");
  });
});
