import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProductItemLeft, ProductItemRight, ProductItemBottom } from "..";
import { useT } from "../../../i18n";
import { Product, Size } from "../../../types";
import { SIZES, unitPrice } from "../../../utils/pricing";
import { cartActions } from "../../../setup/cart-slice";
import { notificationsActions } from "../../../setup/notifications-slice";
import { useAppDispatch, useAppSelector } from "../../../setup/hooks";
import { wishlistActions } from "../../../setup/wishlist-slice";
import { useUserAuth } from "../../../setup/context/user-auth-context";

const ProductItem = ({ prod }: { prod: Product }) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const { user } = useUserAuth();
  const saved = useAppSelector((st) =>
    st.wishlist.items.some((p) => p.id === prod.id && p.category === prod.category)
  );
  const toggleSaved = () => {
    if (!user) {
      dispatch(
        notificationsActions.flash({
          title: "Log in to save favourites",
          body: "Favourites are kept in your account.",
        })
      );
      return;
    }
    dispatch(wishlistActions.toggle(prod));
  };
  const [size, setSize] = useState<Size>("R");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const unit = unitPrice(prod, size);
  const total = unit * quantity;
  const sizeLabel = SIZES.find((s) => s.value === size)?.label ?? size;

  const addToCart = () => {
    dispatch(cartActions.adding({ product: prod, size, quantity }));
    dispatch(
      notificationsActions.flash({
        title: "Added to cart",
        body: `${quantity} × ${prod.title} (${size})`,
      })
    );
    setQuantity(1);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="global-px py-10 relative">
      <nav className="text-buttonColor font-semibold">
        <Link
          to="/products"
          className="after:content-['>'] after:font-semibold after:text-gray-500 after:mx-1 text-gray-600 font-normal"
        >
          Favourite & Promo
        </Link>
        {prod.title.split(" ").slice(0, 3).join(" ")}
        <button
          type="button"
          onClick={toggleSaved}
          aria-pressed={saved}
          className="ml-6 text-sm font-semibold border border-buttonColor rounded-full px-3 py-1"
        >
          {saved ? t("fav.saved", "♥ Saved to favourites") : t("fav.save", "♡ Save to favourites")}
        </button>
      </nav>
      <div className="flex gap-16 flex-col md:flex-row justify-between my-10">
        <ProductItemLeft details={{ title: prod.title, image: prod.image }} />
        <ProductItemRight
          title={prod.title}
          description={prod.description || "This item has no description yet*"}
          quantity={quantity}
          onQuantityChange={setQuantity}
          unit={unit}
          total={total}
          sizeLabel={sizeLabel}
          added={added}
          onAdd={addToCart}
        />
      </div>
      <ProductItemBottom
        product={prod}
        size={size}
        onSizeChange={setSize}
        quantity={quantity}
        total={total}
        onAdd={addToCart}
      />
    </section>
  );
};

export default ProductItem;
