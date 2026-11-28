import { ApiClient } from "../api-client";
import { PromoResult } from "../../types/api/cart";

export class PromoApiClient {
  constructor(private readonly client: ApiClient) {}

  validate(code: string, subtotal?: number) {
    return this.client.post<PromoResult>("/promo/validate", { code, subtotal });
  }
}
