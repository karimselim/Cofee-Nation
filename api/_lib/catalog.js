// Catalog helpers shared by the REST handlers. Product data is the same file the UI uses.
const products = require("../../src/data/products.json");

const SEGMENT_CATEGORY = { "1": "coffee", "2": "iced", "3": "foods" };
const CATEGORY_SEGMENT = { coffee: "1", iced: "2", foods: "3" };
const SIZES = [
  { value: "R", label: "Regular", multiplier: 1 },
  { value: "L", label: "Large", multiplier: 1.25 },
  { value: "XL", label: "Extra large", multiplier: 1.5 },
];

const round = (n) => Math.round(n * 100) / 100;
const roundTo5 = (n) => Math.round(n / 5) * 5;

const unitPrice = (product, size) => {
  const s = SIZES.find((x) => x.value === size) || SIZES[0];
  return roundTo5(product.price * s.multiplier);
};

const withPrices = (product) => ({
  ...product,
  sizes: SIZES.map((s) => ({ value: s.value, label: s.label, price: unitPrice(product, s.value) })),
});

const all = () => products.map(withPrices);

const byCategory = (segment) => {
  const category = SEGMENT_CATEGORY[String(segment)];
  if (!category) return null;
  return products.filter((p) => p.category === category).map(withPrices);
};

const byId = (segment, id) => {
  const category = SEGMENT_CATEGORY[String(segment)];
  if (!category) return null;
  const product = products.find((p) => p.category === category && String(p.id) === String(id));
  return product ? withPrices(product) : null;
};

const sortItems = (items, sort) => {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return copy;
  }
};

module.exports = {
  products,
  SIZES,
  CATEGORY_SEGMENT,
  SEGMENT_CATEGORY,
  unitPrice,
  round,
  roundTo5,
  all,
  byCategory,
  byId,
  sortItems,
  withPrices,
};
