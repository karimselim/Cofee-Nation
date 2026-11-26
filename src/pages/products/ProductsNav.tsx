import { NavLink } from "react-router-dom";
import { MessageKey, useT } from "../../i18n";

const tabs = [
  { to: "/products", label: "Favorite & Promo", key: "tabs.favorites" as MessageKey, end: true },
  { to: "/products/1", label: "Coffee", key: "tabs.coffee" as MessageKey, end: false },
  { to: "/products/2", label: "Iced", key: "tabs.iced" as MessageKey, end: false },
  { to: "/products/3", label: "Foods", key: "tabs.foods" as MessageKey, end: false },
  { to: "/products/4", label: "Add-on", key: "tabs.addon" as MessageKey, end: false },
];

const activeClass =
  "font-bold text-buttonColor relative after:h-[2px] after:absolute after:w-full after:bg-buttonColor after:-bottom-2 after:left-0";

const ProductsNav = () => {
  const t = useT();
  return (
  <nav
    aria-label="Product categories"
    className="flex gap-5 flex-wrap justify-between items-center h-fit w-[-webkit-fill-available]"
  >
    {tabs.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        end={tab.end}
        className={({ isActive }) => (isActive ? activeClass : "")}
      >
        {t(tab.key, tab.label)}
      </NavLink>
    ))}
  </nav>
  );
};

export default ProductsNav;
