import { CartItem, Product, Size } from "../types";

export const SIZES: { value: Size; label: string; multiplier: number }[] = [
  { value: "R", label: "Regular", multiplier: 1 },
  { value: "L", label: "Large", multiplier: 1.25 },
  { value: "XL", label: "Extra large", multiplier: 1.5 },
];

const roundTo5 = (n: number) => Math.round(n / 5) * 5;

/** Price of one item in the given size. Larger sizes cost more. */
export const unitPrice = (product: Pick<Product, "price">, size: Size): number => {
  const multiplier = SIZES.find((s) => s.value === size)?.multiplier ?? 1;
  return roundTo5(product.price * multiplier);
};

export const lineTotal = (item: Pick<CartItem, "price" | "quantity">): number =>
  item.price * item.quantity;

export const TAX_RATE = 0.1;
export const SHIPPING_RATE = 0.05;

export const summarize = (items: CartItem[], discount = 0) => {
  const subtotal = items.reduce((sum, i) => sum + lineTotal(i), 0);
  const taxable = Math.max(0, subtotal - discount);
  const tax = round2(taxable * TAX_RATE);
  const shipping = round2(taxable * SHIPPING_RATE);
  return { subtotal, discount, tax, shipping, total: round2(taxable + tax + shipping) };
};

export const round2 = (n: number) => Math.round(n * 100) / 100;
