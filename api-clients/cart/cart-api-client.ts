import { ApiClient } from "../api-client";
import { CartLineInput, CartPricing } from "../../types/api/cart";

export class CartApiClient {
  constructor(private readonly client: ApiClient) {}

  price(items: CartLineInput[], promo?: string) {
    return this.client.post<CartPricing>("/cart/price", { items, promo });
  }
}
