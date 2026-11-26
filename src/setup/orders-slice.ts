import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../types";

const ordersSlice = createSlice({
  name: "orders",
  initialState: { orders: [] as Order[] },
  reducers: {
    replace(_state, action: PayloadAction<{ orders: Order[] }>) {
      return action.payload;
    },
    add(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },
  },
});

export default ordersSlice;
export const ordersActions = ordersSlice.actions;
