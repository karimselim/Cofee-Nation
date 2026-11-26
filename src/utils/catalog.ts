import { Product } from "../types";

export type SortKey = "default" | "price-asc" | "price-desc" | "name";

export interface CatalogQuery {
  q: string;
  sort: SortKey;
  maxPrice: number | null;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A to Z" },
];

export const parseSort = (v: string | null): SortKey =>
  SORT_OPTIONS.some((o) => o.value === v) ? (v as SortKey) : "default";

/** Returns a positive whole number or null for anything else (empty, negative, text). */
export const parseMaxPrice = (v: string | null): number | null => {
  if (!v || !/^\d{1,6}$/.test(v.trim())) return null;
  const n = Number(v);
  return n > 0 ? n : null;
};

export const filterProducts = (products: Product[], query: CatalogQuery): Product[] => {
  const q = query.q.trim().toLowerCase();
  let out = products.filter((p) => {
    if (q && !p.title.toLowerCase().includes(q)) return false;
    if (query.maxPrice !== null && p.price > query.maxPrice) return false;
    return true;
  });
  if (query.sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
  if (query.sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
  if (query.sort === "name") out = [...out].sort((a, b) => a.title.localeCompare(b.title));
  return out;
};
