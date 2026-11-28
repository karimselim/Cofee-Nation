import { formatMoney } from "../../../utils/money";

interface Props {
  title: string;
  description: string;
  quantity: number;
  onQuantityChange: (q: number) => void;
  unit: number;
  total: number;
  sizeLabel: string;
  added: boolean;
  onAdd: () => void;
}

const ProductItemRight = ({
  title,
  description,
  quantity,
  onQuantityChange,
  unit,
  total,
  sizeLabel,
  added,
  onAdd,
}: Props) => (
  <aside className="flex flex-col gap-5 justify-between w-full">
    <h1 className="font-black text-5xl uppercase w-full text-center mb-4">{title}</h1>
    <p className="text-justify text-accent text-lg md:min-h-[200px]">{description}</p>
    <p className="text-accent text-lg mb-8">
      Delivery only on <span className="font-bold">Monday to Friday</span> at
      <span className="font-bold"> 1 - 7 pm</span>
    </p>
    <div className="flex justify-between w-full items-center">
      <div className="buttons flex border-2 border-line rounded-md w-32 h-10 font-bold justify-evenly">
        <button
          aria-label="Decrease quantity"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        >
          -
        </button>
        <input
          type="number"
          aria-label="Quantity"
          value={quantity}
          readOnly
          className=" outline-none border-l-2 border-r-2 border-line text-center w-16"
        />
        <button
          aria-label="Increase quantity"
          onClick={() => onQuantityChange(quantity + 1)}
          className="flex justify-center items-center"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="font-bold text-xl" data-testid="product-total">
          {formatMoney(total)}
        </p>
        <p className="text-sm text-muted">
          {formatMoney(unit)} each · {sizeLabel}
        </p>
      </div>
    </div>
    <div>
      <button
        onClick={onAdd}
        className="bg-accent w-full text-onAccent text-lg font-bold py-3 rounded-xl"
      >
        {added ? "Added to cart ✓" : "Add To Cart"}
      </button>
      <button
        disabled
        className="bg-accent disabled:bg-gray-300 text-onAccent w-full text-lg font-bold py-3 rounded-xl cursor-not-allowed flex justify-center leading-loose px-4 duration-200 ease-in-out mt-4"
      >
        Ask a Staff
      </button>
    </div>
  </aside>
);

export default ProductItemRight;
