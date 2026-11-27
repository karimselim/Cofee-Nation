import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../setup/hooks";
import { notificationsActions } from "../setup/notifications-slice";
import { useUserAuth } from "../setup/context/user-auth-context";

const SHOW_MS = 5000;
const LEAVE_MS = 300;

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

  // Keep the last toast on screen while it slides out.
  const [view, setView] = useState<{ toast: NonNullable<typeof toast>; leaving: boolean } | null>(null);
  useEffect(() => {
    if (toast) {
      setView({ toast, leaving: false });
      return;
    }
    setView((v) => (v ? { ...v, leaving: true } : v));
    const t = window.setTimeout(() => setView(null), LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [toast]);

  if (!view) return null;
  const shown = view.toast;
  const saved = !shown.read;

  return (
    <div className="fixed top-3 inset-x-0 z-50 flex justify-center pointer-events-none">
    <div
      role="status"
      aria-live="polite"
      data-testid="toast"
      data-state={view.leaving ? "leaving" : "entering"}
      className={`${
        view.leaving ? "toast-out" : "toast-in"
      } pointer-events-auto w-[92%] max-w-md rounded-xl bg-buttonColor text-white shadow-xl px-5 py-3 flex gap-4 items-start`}
    >
      <div className="flex-1">
        <p className="font-bold">{shown.title}</p>
        <p className="text-sm">{shown.body}</p>
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
    </div>
  );
};

export default Toaster;
