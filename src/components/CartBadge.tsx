import { useAppSelector } from "../setup/hooks";

/** Small number next to the cart link: how many items are in the cart. */
const CartBadge = () => {
  const count = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0));
  if (count === 0) return null;
  return (
    <span
      data-testid="cart-count"
      aria-label={`${count} item${count === 1 ? "" : "s"} in cart`}
      className="ml-1 inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-buttonColor px-1 text-xs font-bold text-white"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default CartBadge;
