import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/products", label: "Favorite & Promo", end: true },
  { to: "/products/1", label: "Coffee", end: false },
  { to: "/products/2", label: "Iced", end: false },
  { to: "/products/3", label: "Foods", end: false },
  { to: "/products/4", label: "Add-on", end: false },
];

const activeClass =
  "font-bold text-accent relative after:h-[2px] after:absolute after:w-full after:bg-accent after:-bottom-2 after:left-0";

const ProductsNav = () => (
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
        {tab.label}
      </NavLink>
    ))}
  </nav>
);

export default ProductsNav;
