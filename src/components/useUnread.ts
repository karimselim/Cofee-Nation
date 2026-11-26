import { useAppSelector } from "../setup/hooks";

export const useUnreadCount = () =>
  useAppSelector((s) => s.notifications.items.filter((n) => !n.read).length);

export const formatBadge = (n: number) => (n > 9 ? "9+" : String(n));
