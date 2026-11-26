import { Link } from "react-router-dom";
import { Footer } from "../components";
import { useAppDispatch, useAppSelector } from "../setup/hooks";
import { notificationsActions } from "../setup/notifications-slice";

const Messages = () => {
  const items = useAppSelector((s) => s.notifications.items);
  const dispatch = useAppDispatch();
  const unread = items.filter((n) => !n.read).length;

  return (
    <>
      <section className="global-px py-10 min-h-[60vh]">
        <header className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold">Messages</h1>
          {items.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={() => dispatch(notificationsActions.markAllRead())}
                disabled={unread === 0}
                className="rounded-lg border border-buttonColor text-buttonColor px-4 py-2 font-semibold disabled:opacity-40"
              >
                Mark all as read
              </button>
              <button
                onClick={() => dispatch(notificationsActions.clearAll())}
                className="rounded-lg bg-buttonColor text-white px-4 py-2 font-semibold"
              >
                Clear all
              </button>
            </div>
          )}
        </header>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg mb-4">No messages yet. Updates about your orders will appear here.</p>
            <Link to="/products" className="bg-buttonColor text-white font-bold rounded-xl px-6 py-3">
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((n) => (
              <li
                key={n.id}
                data-testid="message"
                className={`rounded-xl border p-4 flex gap-4 items-start ${
                  n.read ? "border-gray-200 bg-white" : "border-buttonColor bg-firstColor/20"
                }`}
              >
                <div className="flex-1">
                  <p className="font-bold">
                    {n.title}
                    {!n.read && <span className="ml-2 text-xs text-buttonColor">New</span>}
                  </p>
                  <p>{n.body}</p>
                  <p className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => dispatch(notificationsActions.markRead(n.id))}
                    className="text-sm underline text-buttonColor"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Messages;
