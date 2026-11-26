import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, OrderPrefs, Product, Size } from "../types";
import { unitPrice } from "../utils/pricing";

export interface CartState {
  items: CartItem[];
  prefs: OrderPrefs;
}

export const defaultPrefs: OrderPrefs = { delivery: "pickup", when: "now", time: "" };
export const initialCart: CartState = { items: [], prefs: defaultPrefs };

export const cartKey = (p: Pick<Product, "category" | "id">, size: Size) =>
  `${p.category}-${p.id}-${size}`;

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCart,
  reducers: {
    replace(_state, action: PayloadAction<CartState>) {
      return action.payload;
    },
    adding(state, action: PayloadAction<{ product: Product; size: Size; quantity?: number }>) {
      const { product, size, quantity = 1 } = action.payload;
      const key = cartKey(product, size);
      const existing = state.items.find((item) => item.key === key);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          key,
          id: product.id,
          category: product.category,
          title: product.title,
          image: product.image,
          size,
          price: unitPrice(product, size),
          quantity,
        });
      }
    },
    increasing(state, action: PayloadAction<string>) {
      const existing = state.items.find((item) => item.key === action.payload);
      if (existing) existing.quantity += 1;
    },
    reducing(state, action: PayloadAction<string>) {
      const existing = state.items.find((item) => item.key === action.payload);
      if (!existing) return;
      if (existing.quantity <= 1) {
        state.items = state.items.filter((item) => item.key !== action.payload);
      } else {
        existing.quantity -= 1;
      }
    },
    removing(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.key !== action.payload);
    },
    setPrefs(state, action: PayloadAction<Partial<OrderPrefs>>) {
      state.prefs = { ...state.prefs, ...action.payload };
    },
    clear(state) {
      state.items = [];
    },
  },
});

export default cartSlice;
export const cartActions = cartSlice.actions;
