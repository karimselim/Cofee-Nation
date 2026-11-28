import { expect, test } from "../../fixtures/api-base";

test.describe("POST /api/promo/validate", () => {
  test("WELCOME10 gives ten percent", async ({ promoApi }) => {
    const { status, body } = await promoApi.validate("WELCOME10", 200);
    expect(status).toBe(200);
    expect(body.code).toBe("WELCOME10");
    expect(body.discount).toBe(20);
  });

  test("codes are case insensitive", async ({ promoApi }) => {
    const { status, body } = await promoApi.validate("welcome10", 200);
    expect(status).toBe(200);
    expect(body.code).toBe("WELCOME10");
  });

  test("SAVE50 takes fifty pounds off", async ({ promoApi }) => {
    const { body } = await promoApi.validate("SAVE50", 200);
    expect(body.discount).toBe(50);
  });

  test("an unknown code is refused", async ({ promoApi }) => {
    const { status, body } = await promoApi.validate("NOPE123", 200);
    expect(status).toBe(400);
    expect((body as unknown as { error: string }).error).toContain("not valid");
  });

  test("an expired code is refused", async ({ promoApi }) => {
    const { status, body } = await promoApi.validate("OLDDEAL", 200);
    expect(status).toBe(400);
    expect((body as unknown as { error: string }).error).toContain("expired");
  });

  test("an empty code is refused", async ({ promoApi }) => {
    const { status } = await promoApi.validate("", 200);
    expect(status).toBe(400);
  });

  test("a code with a minimum subtotal needs a bigger cart", async ({ promoApi }) => {
    const { status, body } = await promoApi.validate("COFFEE20", 120);
    expect(status).toBe(400);
    expect((body as unknown as { error: string }).error).toContain("300");
  });

  test("nothing in the cart is refused", async ({ promoApi }) => {
    const { status } = await promoApi.validate("WELCOME10", 0);
    expect(status).toBe(400);
  });
});
