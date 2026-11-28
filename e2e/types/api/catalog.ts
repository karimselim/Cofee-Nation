export type ProductSize = { value: "R" | "L" | "XL"; label: string; price: number };

export type Product = {
  id: number;
  category: "coffee" | "iced" | "foods";
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  price: number;
  sizes: ProductSize[];
};

export type ProductList = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductListQuery = {
  category?: string;
  q?: string;
  sort?: "price-asc" | "price-desc" | "name-asc" | "name-desc";
  max?: number | string;
  page?: number;
  limit?: number;
};
