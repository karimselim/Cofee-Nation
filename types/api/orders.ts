import { PricedLine } from "./cart";

export type OrderPayload = {
  items: { productId: string; size: string; quantity: number }[];
  delivery: "dine-in" | "delivery" | "pickup";
  address?: string;
  notes?: string;
  when: "now" | "later";
  time?: string;
  method: "card" | "bank" | "cash";
  promo?: string;
};

export type PlacedOrder = {
  order: {
    number: string;
    items: PricedLine[];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    delivery: string;
    when: string;
    time?: string;
    method: string;
  };
};
