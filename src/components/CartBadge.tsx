import { useAppSelector } from "../setup/hooks";

/** Small number next to the cart link: how many different orders (cart lines) are in the cart. Quantity does not change it. */
const CartBadge = () => {
  const count = useAppSelector((s) => s.cart.items.length);
  if (count === 0) return null;
  return (
    <span
      data-testid="cart-count"
      aria-label={`${count} order${count === 1 ? "" : "s"} in cart`}
      className="ml-1 inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-buttonColor px-1.5 text-xs font-bold leading-none text-center tabular-nums text-white align-middle"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default CartBadge;
