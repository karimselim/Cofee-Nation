import raw from "./products.json";
import { Category, Product } from "../types";

export const products = raw as Product[];

/** URL segment used by the products routes for each category */
export const CATEGORY_SEGMENT: Record<Category, string> = {
  coffee: "1",
  iced: "2",
  foods: "3",
};

export const SEGMENT_CATEGORY: Record<string, Category> = {
  "1": "coffee",
  "2": "iced",
  "3": "foods",
};

export const getByCategory = (category: Category): Product[] =>
  products.filter((p) => p.category === category);

export const getProduct = (category: Category, id: number): Product | undefined =>
  products.find((p) => p.category === category && p.id === id);

/** A mixed "favorite" selection for the first products tab */
export const getFeatured = (): Product[] => [
  ...getByCategory("coffee").slice(0, 8),
  ...getByCategory("iced").slice(0, 3),
  ...getByCategory("foods").slice(0, 5),
];

export const productPath = (p: Product): string =>
  `/products/${CATEGORY_SEGMENT[p.category]}/${p.id}`;

export const productKey = (p: Pick<Product, "category" | "id">): string =>
  `${p.category}-${p.id}`;
