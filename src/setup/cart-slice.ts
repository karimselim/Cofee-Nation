import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../types";
import { productKey } from "../data/products";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    adding(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const key = productKey(product);
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
          price: product.price,
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
    clear(state) {
      state.items = [];
    },
  },
});

export default cartSlice;
export const cartActions = cartSlice.actions;
