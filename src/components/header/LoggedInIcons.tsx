import { useEffect, useRef, useState } from "react";
import profilePlaceholder from "../../assists/images/placeholder-profile.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import chat from "../../assists/icons/chat.svg";
import { Link, useNavigate } from "react-router-dom";
import { formatBadge, useUnreadCount } from "../useUnread";
import { useUserAuth } from "../../setup/context/user-auth-context";

const LoggedInIcons = () => {
  const [isSignedInShown, setIsSignedInShown] = useState(false);

  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();
  const unread = useUnreadCount();

  const signOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch {
      // sign-out failed (e.g. offline); user stays signed in
    }
  };

  const menuRef = useRef<HTMLDivElement>(null);

  // close the account menu when clicking anywhere else or pressing Escape
  useEffect(() => {
    if (!isSignedInShown) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsSignedInShown(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSignedInShown(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isSignedInShown]);

  const isSignedInShownHanlder = () => {
    setIsSignedInShown(!isSignedInShown);
  };

  return (
    <section className="flex gap-12">
      <Link
        aria-label={unread ? `Messages, ${unread} unread` : "Messages"}
        className="chat-container w-8 relative"
        to="/messages"
      >
        <img src={chat} alt="" />
        {unread > 0 && (
          <span
            data-testid="unread-count"
            className="absolute text-white rounded-full text-xs font-bold bg-buttonColor -top-2 -left-2 p-[1px] min-w-[1.1rem] text-center"
          >
            {formatBadge(unread)}
          </span>
        )}
      </Link>
      <div ref={menuRef} className="profile-container flex gap-2 justify-center items-center cursor-pointer relative max-lg:hidden">
        <button
          aria-label="Account menu"
          className="w-9"
          onClick={isSignedInShownHanlder}
          aria-expanded={isSignedInShown}
        >
          <div className="flex items-center justify-center gap-3">
            <img src={profilePlaceholder} alt="" className="rounded-full" />
            <FontAwesomeIcon icon={faAngleDown} className="text-[#777]" />
          </div>
        </button>
        {isSignedInShown && (
          <div className="absolute top-10 bg-white shadow-md border border-gray-200 rounded-lg flex flex-col right-0 py-2 cursor-default">
            <ul>
              <li className="px-4 py-1">Signed in as</li>
              <li className="font-medium px-4 pb-2">{user?.email}</li>
              <hr />
              <li
                className="px-4 py-2 hover:bg-gray-100 duration-300 ease-in-out cursor-pointer"
                onClick={signOut}
              >
                Sign out
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoggedInIcons;
