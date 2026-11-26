import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cart-slice";
import { CartItem } from "../types";

const STORAGE_KEY = "coffee-nation-cart";

const loadCart = (): { items: CartItem[] } | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const items = JSON.parse(raw);
    return Array.isArray(items) ? { items } : undefined;
  } catch {
    return undefined;
  }
};

const store = configureStore({
  reducer: { cart: cartSlice.reducer },
  preloadedState: { cart: loadCart() ?? { items: [] } },
});

// keep the cart across page reloads
store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().cart.items));
  } catch {
    // storage unavailable (private mode): the cart just stays in memory
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
