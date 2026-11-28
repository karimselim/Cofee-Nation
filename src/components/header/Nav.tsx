import { NavLink } from "react-router-dom";
import CartBadge from "../CartBadge";

const Nav = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const base =
    "mx-4 uppercase text-[12px] tracking-[0.2em] text-muted hover:text-ink duration-200";
  const active = "mx-4 uppercase text-[12px] tracking-[0.2em] text-accent font-semibold";
  return (
    <nav className="flex py-5 md:py-6 max-lg:hidden">
      <NavLink
        onClick={scrollToTop}
        to="/"
        className={({ isActive }) => (isActive ? active : base)}
        end
      >
        Home
      </NavLink>
      <NavLink
        onClick={scrollToTop}
        to="/products"
        className={({ isActive }) => (isActive ? active : base)}
      >
        Products
      </NavLink>
      <NavLink
        onClick={scrollToTop}
        to="yourCart"
        className={({ isActive }) => (isActive ? active : base)}
      >
        Your cart
        <CartBadge />
      </NavLink>
      <NavLink
        onClick={scrollToTop}
        to="history"
        className={({ isActive }) => (isActive ? active : base)}
      >
        History
      </NavLink>
      <NavLink
        onClick={scrollToTop}
        to="wishlist"
        className={({ isActive }) => (isActive ? active : base)}
      >
        Favourites
      </NavLink>
    </nav>
  );
};

export default Nav;
