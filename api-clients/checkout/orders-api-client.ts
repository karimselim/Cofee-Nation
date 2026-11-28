import { ApiClient } from "../api-client";
import { OrderPayload, PlacedOrder } from "../../types/api/orders";

export type OrderError = { errors: Record<string, string> };

export class OrdersApiClient {
  constructor(private readonly client: ApiClient) {}

  create(order: Partial<OrderPayload>) {
    return this.client.post<PlacedOrder | OrderError>("/orders", order);
  }
}
