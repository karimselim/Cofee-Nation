import { useEffect } from "react";
import { useUserAuth } from "../setup/context/user-auth-context";
import store, { bindUser } from "../setup";
import { notificationsActions } from "../setup/notifications-slice";

/** Loads the signed-in user's cart, orders and messages (and the guest's when signed out). */
const UserSync = () => {
  const { user, ready } = useUserAuth();
  const uid = user?.uid ?? null;

  useEffect(() => {
    if (!ready) return;
    bindUser(uid);
    if (uid) {
      const flag = `cn:welcomed:${uid}`;
      if (!localStorage.getItem(flag)) {
        localStorage.setItem(flag, "1");
        store.dispatch(
          notificationsActions.add({
            title: "Welcome to Coffee Nation",
            body: "Your account is ready. Messages about your orders will show up here.",
          })
        );
      }
    }
  }, [uid, ready]);

  return null;
};

export default UserSync;
