import { configureStore } from "@reduxjs/toolkit";
import cartSlice, { CartState, initialCart } from "./cart-slice";
import ordersSlice from "./orders-slice";
import wishlistSlice from "./wishlist-slice";
import notificationsSlice from "./notifications-slice";
import { AppNotification, Order, Product } from "../types";

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    orders: ordersSlice.reducer,
    notifications: notificationsSlice.reducer,
    wishlist: wishlistSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* ---- per-user persistence -------------------------------------------------
 * Everything is saved in the browser under a key that includes the user id, so
 * two accounts on the same browser never see each other's cart, orders or
 * messages. Guests have their own cart; guest orders and messages are not kept.
 */
let owner = "guest";

const keyFor = (name: string, uid: string) => `cn:${name}:${uid}`;

function load<T>(name: string, uid: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(keyFor(name, uid));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(name: string, uid: string, value: unknown) {
  try {
    localStorage.setItem(keyFor(name, uid), JSON.stringify(value));
  } catch {
    // storage unavailable (private mode): data just stays in memory
  }
}

/** Switch the store to the data of this user (or the guest when null). */
export function bindUser(uid: string | null) {
  owner = uid ?? "guest";
  const cart = load<CartState>("cart", owner, initialCart);
  store.dispatch(
    cartSlice.actions.replace({
      items: cart.items ?? [],
      prefs: { ...initialCart.prefs, ...(cart.prefs ?? {}) },
    })
  );
  store.dispatch(
    ordersSlice.actions.replace({
      orders: uid ? load<Order[]>("orders", owner, []) : [],
    })
  );
  store.dispatch(
    wishlistSlice.actions.replace({
      items: uid ? load<Product[]>("wishlist", owner, []) : [],
    })
  );
  store.dispatch(
    notificationsSlice.actions.replace({
      items: uid ? load<AppNotification[]>("notifications", owner, []) : [],
    })
  );
}

export const currentOwner = () => owner;

let last = { cart: store.getState().cart, orders: store.getState().orders, n: store.getState().notifications.items, w: store.getState().wishlist.items };
store.subscribe(() => {
  const s = store.getState();
  if (s.cart !== last.cart) save("cart", owner, s.cart);
  if (owner !== "guest") {
    if (s.orders !== last.orders) save("orders", owner, s.orders.orders);
    if (s.wishlist.items !== last.w) save("wishlist", owner, s.wishlist.items);
    if (s.notifications.items !== last.n) save("notifications", owner, s.notifications.items);
  }
  last = { cart: s.cart, orders: s.orders, n: s.notifications.items, w: s.wishlist.items };
});

bindUser(null);

export default store;
