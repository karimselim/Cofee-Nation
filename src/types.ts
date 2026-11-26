export type Category = "coffee" | "iced" | "foods";

export interface Product {
  id: number;
  category: Category;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  /** price of the regular size in Egyptian pounds (EGP) */
  price: number;
}

export type Size = "R" | "L" | "XL";
export type DeliveryMethod = "dine-in" | "delivery" | "pickup";
export type When = "now" | "later";
export type PaymentMethod = "card" | "bank" | "cash";

/** How the customer wants to receive the order. Set on the product page or in the cart. */
export interface OrderPrefs {
  delivery: DeliveryMethod;
  when: When;
  /** HH:MM, only used when `when` is "later" */
  time: string;
}

export interface CartItem {
  key: string;
  id: number;
  category: Category;
  title: string;
  image: string;
  size: Size;
  /** price of one item in the chosen size */
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  tax: number;
  shipping: number;
  total: number;
  address: string;
  notes: string;
  method: PaymentMethod;
  prefs: OrderPrefs;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}
