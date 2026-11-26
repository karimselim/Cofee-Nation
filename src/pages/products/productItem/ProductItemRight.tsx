import { useState } from "react";
import { cartActions } from "../../../setup/cart-slice";
import { useAppDispatch } from "../../../setup/hooks";
import { Product } from "../../../types";

interface Details {
  title: string;
  description: string;
  price: number;
}

const ProductItemRight = ({ details, item }: { details: Details; item: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const dispatch = useAppDispatch();

  const addToCartHandler = () => {
    dispatch(cartActions.adding({ product: item, quantity }));
    setQuantity(1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <aside className="flex flex-col gap-5 justify-between w-full">
      <h1 className="font-black text-5xl uppercase w-full text-center mb-4">
        {details.title}
      </h1>
      <p className="text-justify text-buttonColor text-lg md:min-h-[200px]">
        {details.description}
      </p>
      <p className="text-buttonColor text-lg mb-8">
        Delivery only on <span className="font-bold">Monday to Friday</span> at
        <span className="font-bold"> 1 - 7 pm</span>
      </p>
      <div className="flex justify-between w-full">
        <div className="buttons flex border-2 border-gray-400 rounded-md w-32 h-10 font-bold justify-evenly">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <input
            type="number"
            aria-label="Quantity"
            value={quantity}
            readOnly
            className=" outline-none border-l-2 border-r-2 border-gray-400 text-center w-16"
          />
          <button
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex justify-center items-center"
          >
            +
          </button>
        </div>
        <p className="font-bold text-xl">{`IDR ${details.price}.000`}</p>
      </div>
      <div>
        <button
          onClick={addToCartHandler}
          className="bg-buttonColor w-full text-white text-lg font-bold py-3 rounded-xl"
        >
          {added ? "Added to cart ✓" : "Add To Cart"}
        </button>
        <button
          disabled
          className="bg-firstColor disabled:bg-gray-300 text-buttonColor w-full text-lg font-bold py-3 rounded-xl cursor-not-allowed flex justify-center leading-loose px-4 duration-200 ease-in-out mt-4"
        >
          Ask a Staff
        </button>
      </div>
    </aside>
  );
};

export default ProductItemRight;
