import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] as Product[] },
  reducers: {
    replace(_state, action: PayloadAction<{ items: Product[] }>) {
      return action.payload;
    },
    toggle(state, action: PayloadAction<Product>) {
      const { id, category } = action.payload;
      const i = state.items.findIndex((p) => p.id === id && p.category === category);
      if (i >= 0) state.items.splice(i, 1);
      else state.items.push(action.payload);
    },
  },
});

export default wishlistSlice;
export const wishlistActions = wishlistSlice.actions;
