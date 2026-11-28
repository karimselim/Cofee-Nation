import { expect, test } from "../../fixtures/api-base";
import { BLACK_COFFEE } from "../../test-data/products";
import { ADDRESS, VALID_CHECKOUT } from "../../test-data/checkout";

const line = [{ productId: BLACK_COFFEE.slug, size: "R", quantity: 1 }];

test.describe("POST /api/orders", () => {
  test("places an order and returns a number", async ({ ordersApi }) => {
    const { status, body } = await ordersApi.create({
      items: line,
      delivery: "pickup",
      when: VALID_CHECKOUT.when,
      time: VALID_CHECKOUT.time,
      method: "cash",
    });
    expect(status).toBe(201);
    const order = (body as { order: { number: string; total: number; items: unknown[] } }).order;
    expect(order.number).toMatch(/^CN-\d{6}$/);
    expect(order.total).toBe(120.75);
    expect(order.items).toHaveLength(1);
  });

  test("refuses an empty cart", async ({ ordersApi }) => {
    const { status, body } = await ordersApi.create({ items: [], method: "cash" });
    expect(status).toBe(400);
    expect((body as { errors: Record<string, string> }).errors.cart).toContain("empty");
  });

  test("door delivery needs an address", async ({ ordersApi }) => {
    const missing = await ordersApi.create({
      items: line,
      delivery: "delivery",
      method: "cash",
      when: "now",
    });
    expect(missing.status).toBe(400);
    expect((missing.body as { errors: Record<string, string> }).errors.address).toBeTruthy();

    const short = await ordersApi.create({
      items: line,
      delivery: "delivery",
      address: "Cairo",
      method: "cash",
      when: "now",
    });
    expect(short.status).toBe(400);

    const ok = await ordersApi.create({
      items: line,
      delivery: "delivery",
      address: ADDRESS,
      method: "cash",
      when: "now",
    });
    expect(ok.status).toBe(201);
  });

  test("refuses a time outside the opening hours", async ({ ordersApi }) => {
    for (const time of ["06:00", "08:59", "22:30"]) {
      const { status, body } = await ordersApi.create({
        items: line,
        delivery: "pickup",
        when: "later",
        time,
        method: "cash",
      });
      expect(status, `time ${time}`).toBe(400);
      expect((body as { errors: Record<string, string> }).errors.time).toContain("09:00");
    }
  });

  test("accepts the edges of the opening hours", async ({ ordersApi }) => {
    for (const time of ["09:00", "21:59", "22:00"]) {
      const { status } = await ordersApi.create({
        items: line,
        delivery: "pickup",
        when: "later",
        time,
        method: "cash",
      });
      expect(status, `time ${time}`).toBe(201);
    }
  });

  test("refuses a time that is not a real time", async ({ ordersApi }) => {
    const { status, body } = await ordersApi.create({
      items: line,
      delivery: "pickup",
      when: "later",
      time: "25:00",
      method: "cash",
    });
    expect(status).toBe(400);
    expect((body as { errors: Record<string, string> }).errors.time).toContain("real time");
  });

  test("a payment method is required", async ({ ordersApi }) => {
    const { status, body } = await ordersApi.create({ items: line, delivery: "pickup" });
    expect(status).toBe(400);
    expect((body as { errors: Record<string, string> }).errors.method).toBeTruthy();
  });

  test("notes cannot be longer than 200 characters", async ({ ordersApi }) => {
    const { status } = await ordersApi.create({
      items: line,
      delivery: "pickup",
      method: "cash",
      notes: "a".repeat(201),
    });
    expect(status).toBe(400);
  });

  test("an order with a promo code totals less", async ({ ordersApi }) => {
    const plain = await ordersApi.create({ items: line, delivery: "pickup", method: "cash" });
    const promo = await ordersApi.create({
      items: line,
      delivery: "pickup",
      method: "cash",
      promo: "WELCOME10",
    });
    const plainTotal = (plain.body as { order: { total: number } }).order.total;
    const promoTotal = (promo.body as { order: { total: number } }).order.total;
    expect(promoTotal).toBeLessThan(plainTotal);
  });
});
