export type CartLineInput = { productId: string; size?: "R" | "L" | "XL"; quantity: number };

export type PricedLine = {
  key: string;
  productId: string;
  title: string;
  size: string;
  quantity: number;
  unit: number;
  total: number;
};

export type CartPricing = {
  lines: PricedLine[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  promoCode?: string;
  total: number;
};

export type PromoResult = {
  ok: boolean;
  code: string;
  description: string;
  discount: number;
};
