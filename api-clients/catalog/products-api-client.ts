import { ApiClient } from "../api-client";
import { Product, ProductList, ProductListQuery } from "../../types/api/catalog";

export class ProductsApiClient {
  constructor(private readonly client: ApiClient) {}

  list(query: ProductListQuery = {}) {
    return this.client.get<ProductList>("/products", query as Record<string, string | number>);
  }

  get(slug: string) {
    return this.client.get<Product>(`/products/${slug}`);
  }

  categories() {
    return this.client.get<{ items: { category: string; count: number }[] }>("/categories");
  }
}
