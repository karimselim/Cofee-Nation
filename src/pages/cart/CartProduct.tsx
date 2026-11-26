import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { cartActions } from "../../setup/cart-slice";
import { useAppDispatch } from "../../setup/hooks";
import { formatMoney } from "../../utils/money";
import { CartItem } from "../../types";

const roundBtn =
  "w-8 aspect-square bg-buttonColor text-white flex justify-center items-center rounded-full font-extrabold text-lg";

const CartProduct = ({ item }: { item: CartItem }) => {
  const dispatch = useAppDispatch();
  const { image, price, quantity, title, key } = item;

  return (
    <div className="flex gap-4 justify-between">
      <div className=" flex-1">
        <img
          src={image}
          alt={title}
          className=" rounded-full object-cover h-auto aspect-square"
        />
      </div>
      <div className="flex flex-col gap-3 flex-[2_2_0]">
        <p className="font-semibold">{title.split(" ").slice(0, 3).join(" ")}</p>
        <div className="flex gap-4">
          <button
            aria-label={`Decrease ${title}`}
            className={roundBtn}
            onClick={() => dispatch(cartActions.reducing(key))}
          >
            -
          </button>
          <p>{quantity}</p>
          <button
            aria-label={`Increase ${title}`}
            className={roundBtn}
            onClick={() => dispatch(cartActions.increasing(key))}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6 flex-1 items-end">
        <button
          aria-label={`Remove ${title}`}
          className={roundBtn}
          onClick={() => dispatch(cartActions.removing(key))}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <p>{formatMoney(price * quantity)}</p>
      </div>
    </div>
  );
};

export default CartProduct;
