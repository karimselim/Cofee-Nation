export type Category = "coffee" | "iced" | "foods";

export interface Product {
  id: number;
  category: Category;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  /** price in Egyptian pounds (EGP) */
  price: number;
}

export interface CartItem {
  key: string;
  id: number;
  category: Category;
  title: string;
  image: string;
  price: number;
  quantity: number;
}
