import { test as base } from "@playwright/test";
import { ApiClient } from "../api-clients/api-client";
import { ProductsApiClient } from "../api-clients/catalog/products-api-client";
import { CartApiClient } from "../api-clients/cart/cart-api-client";
import { OrdersApiClient } from "../api-clients/checkout/orders-api-client";
import { PromoApiClient } from "../api-clients/promo/promo-api-client";

type ApiFixtures = {
  productsApi: ProductsApiClient;
  cartApi: CartApiClient;
  ordersApi: OrdersApiClient;
  promoApi: PromoApiClient;
};

export const test = base.extend<ApiFixtures>({
  productsApi: async ({ request }, use) => {
    await use(new ProductsApiClient(new ApiClient(request)));
  },
  cartApi: async ({ request }, use) => {
    await use(new CartApiClient(new ApiClient(request)));
  },
  ordersApi: async ({ request }, use) => {
    await use(new OrdersApiClient(new ApiClient(request)));
  },
  promoApi: async ({ request }, use) => {
    await use(new PromoApiClient(new ApiClient(request)));
  },
});

export { expect } from "@playwright/test";
