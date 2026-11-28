import { expect, test } from "../../fixtures/api-base";
import { BLACK_COFFEE } from "../../test-data/products";

test.describe("GET /api/products", () => {
  test("returns the first page of the catalog", async ({ productsApi }) => {
    const { status, body } = await productsApi.list();
    expect(status).toBe(200);
    expect(body.items.length).toBe(body.limit);
    expect(body.total).toBeGreaterThan(30);
    expect(body.page).toBe(1);
    for (const product of body.items) {
      expect(product.title).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.image).toMatch(/^\/images\/products\//);
    }
  });

  test("limit=100 returns the whole catalog", async ({ productsApi }) => {
    const { body } = await productsApi.list({ limit: 100 });
    expect(body.items.length).toBe(body.total);
  });

  test("filters by category", async ({ productsApi }) => {
    const { status, body } = await productsApi.list({ category: "1", limit: 100 });
    expect(status).toBe(200);
    expect(body.items.length).toBeGreaterThan(0);
    for (const product of body.items) expect(product.category).toBe("coffee");
  });

  test("rejects an unknown category", async ({ productsApi }) => {
    const { status } = await productsApi.list({ category: "9" });
    expect(status).toBe(400);
  });

  test("search is case insensitive and can come back empty", async ({ productsApi }) => {
    const found = await productsApi.list({ q: "LATTE", limit: 100 });
    expect(found.body.items.length).toBeGreaterThan(0);
    for (const product of found.body.items) {
      expect(product.title.toLowerCase()).toContain("latte");
    }
    const none = await productsApi.list({ q: "zzzzz" });
    expect(none.body.items).toEqual([]);
    expect(none.body.total).toBe(0);
  });

  test("sorts by price in both directions", async ({ productsApi }) => {
    const asc = await productsApi.list({ sort: "price-asc", limit: 100 });
    const ascPrices = asc.body.items.map((p) => p.price);
    expect(ascPrices).toEqual([...ascPrices].sort((a, b) => a - b));

    const desc = await productsApi.list({ sort: "price-desc", limit: 100 });
    const descPrices = desc.body.items.map((p) => p.price);
    expect(descPrices).toEqual([...descPrices].sort((a, b) => b - a));
  });

  test("rejects an unknown sort", async ({ productsApi }) => {
    const { status } = await productsApi.list({ sort: "cheapest" as never });
    expect(status).toBe(400);
  });

  test("filters by max price and rejects a bad value", async ({ productsApi }) => {
    const { body } = await productsApi.list({ max: 100, limit: 100 });
    for (const product of body.items) expect(product.price).toBeLessThanOrEqual(100);
    const bad = await productsApi.list({ max: "abc" });
    expect(bad.status).toBe(400);
  });

  test("pages through the catalog", async ({ productsApi }) => {
    const first = await productsApi.list({ page: 1, limit: 12 });
    const second = await productsApi.list({ page: 2, limit: 12 });
    expect(first.body.items[0].id).not.toBe(second.body.items[0].id);
    expect(second.body.page).toBe(2);
    const beyond = await productsApi.list({ page: 99, limit: 12 });
    expect(beyond.body.items).toEqual([]);
  });
});

test.describe("GET /api/products/:slug", () => {
  test("returns one product with its size prices", async ({ productsApi }) => {
    const { status, body } = await productsApi.get(BLACK_COFFEE.slug);
    expect(status).toBe(200);
    expect(body.title).toBe(BLACK_COFFEE.title);
    expect(body.sizes.map((s) => s.value)).toEqual(["R", "L", "XL"]);
    const regular = body.sizes.find((s) => s.value === "R");
    expect(regular?.price).toBe(BLACK_COFFEE.price);
  });

  test("returns 404 for an unknown product", async ({ productsApi }) => {
    const { status } = await productsApi.get("coffee-999");
    expect(status).toBe(404);
  });

  test("categories add up to the catalog", async ({ productsApi }) => {
    const categories = await productsApi.categories();
    const list = await productsApi.list({ limit: 100 });
    expect(categories.status).toBe(200);
    const sum = categories.body.items.reduce((n, c) => n + c.count, 0);
    expect(sum).toBe(list.body.total);
  });
});
