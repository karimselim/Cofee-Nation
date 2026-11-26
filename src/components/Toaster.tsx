import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../setup/hooks";
import { notificationsActions } from "../setup/notifications-slice";
import { useUserAuth } from "../setup/context/user-auth-context";

const SHOW_MS = 5000;

/** Banner at the top of the page for new messages. Saved messages live on /messages. */
const Toaster = () => {
  const toast = useAppSelector((s) => s.notifications.toast);
  const dispatch = useAppDispatch();
  const { user } = useUserAuth();

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => dispatch(notificationsActions.dismissToast()), SHOW_MS);
    return () => window.clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;

  const saved = !toast.read;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="toast"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-xl bg-buttonColor text-white shadow-xl px-5 py-3 flex gap-4 items-start"
    >
      <div className="flex-1">
        <p className="font-bold">{toast.title}</p>
        <p className="text-sm">{toast.body}</p>
        {saved && user && (
          <Link
            to="/messages"
            onClick={() => dispatch(notificationsActions.dismissToast())}
            className="text-sm underline"
          >
            Open messages
          </Link>
        )}
      </div>
      <button
        aria-label="Dismiss message"
        onClick={() => dispatch(notificationsActions.dismissToast())}
        className="text-xl leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default Toaster;
