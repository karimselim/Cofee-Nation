import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppNotification } from "../types";

interface NotificationsState {
  items: AppNotification[];
  /** the message currently shown as a banner at the top; not saved */
  toast: AppNotification | null;
}

const initialState: NotificationsState = { items: [], toast: null };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    replace(state, action: PayloadAction<{ items: AppNotification[] }>) {
      state.items = action.payload.items;
      state.toast = null;
    },
    /** Saves a message to the inbox and shows it as a banner. */
    add(state, action: PayloadAction<{ title: string; body: string }>) {
      const item: AppNotification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: action.payload.title,
        body: action.payload.body,
        createdAt: new Date().toISOString(),
        read: false,
      };
      state.items.unshift(item);
      state.toast = item;
    },
    /** Shows a banner without saving it (used for guests). */
    flash(state, action: PayloadAction<{ title: string; body: string }>) {
      state.toast = {
        id: `flash-${Date.now()}`,
        title: action.payload.title,
        body: action.payload.body,
        createdAt: new Date().toISOString(),
        read: true,
      };
    },
    dismissToast(state) {
      state.toast = null;
    },
    markRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
    clearAll(state) {
      state.items = [];
    },
  },
});

export default notificationsSlice;
export const notificationsActions = notificationsSlice.actions;
