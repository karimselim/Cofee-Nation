import { NavLink } from "react-router-dom";
import { useT } from "../../i18n";
import CartBadge from "../CartBadge";

const Nav = () => {
  const t = useT();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <nav className="flex py-5 md:py-6 text-textColor max-lg:hidden">
      <NavLink
        onClick={scrollToTop}
        to="/"
        className={({ isActive }) =>
          isActive ? "mx-4 font-bold text-buttonColor" : "mx-4"
        }
        end
      >
        {t("nav.home", "Home")}
      </NavLink>
      <NavLink
        onClick={scrollToTop}
        to="/products"
        className={({ isActive }) =>
          isActive ? "mx-4 font-bold text-buttonColor" : "mx-4"
        }
      >
        {t("nav.products", "Products")}
      </NavLink>
      <NavLink
        onClick={scrollToTop}
        to="yourCart"
        className={({ isActive }) =>
          isActive ? "mx-4 font-bold text-buttonColor" : "mx-4"
        }
      >
        {t("nav.cart", "Your cart")}
        <CartBadge />
      </NavLink>
      <NavLink
        onClick={scrollToTop}
        to="history"
        className={({ isActive }) =>
          isActive ? "mx-4 font-bold text-buttonColor" : "mx-4"
        }
      >
        {t("nav.history", "History")}
      </NavLink>
      <NavLink
        onClick={scrollToTop}
        to="wishlist"
        className={({ isActive }) =>
          isActive ? "mx-4 font-bold text-buttonColor" : "mx-4"
        }
      >
        {t("nav.favourites", "Favourites")}
      </NavLink>
    </nav>
  );
};

export default Nav;
