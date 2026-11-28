/** Stable products used by the tests. Prices come from src/data/products.json. */
export const BLACK_COFFEE = {
  slug: "coffee-1",
  title: "Black Coffee",
  price: 105,
  largePrice: 130,
  extraLargePrice: 155,
};

export const LATTE = { slug: "coffee-2", title: "Latte", price: 125 };

export const SORTS = [
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];
