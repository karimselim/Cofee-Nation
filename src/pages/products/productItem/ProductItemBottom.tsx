import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Product, Size } from "../../../types";
import { SIZES, unitPrice } from "../../../utils/pricing";
import { formatMoney } from "../../../utils/money";

interface Props {
  product: Product;
  size: Size;
  onSizeChange: (s: Size) => void;
  quantity: number;
  total: number;
  onAdd: () => void;
}

const ProductItemBottom = ({ product, size, onSizeChange, quantity, total, onAdd }: Props) => (
  <footer className="flex md:flex-row flex-col gap-8">
    <aside className="shadow-primary px-5 py-8 space-y-4 text-xl flex-1 rounded-xl w-full gap-4 flex flex-col text-center font-bold">
      <p id="size-label">Choose a size</p>
      <div role="radiogroup" aria-labelledby="size-label" className="flex justify-center gap-4">
        {SIZES.map((s) => (
          <button
            key={s.value}
            role="radio"
            aria-checked={size === s.value}
            aria-label={`${s.label}, ${formatMoney(unitPrice(product, s.value))}`}
            onClick={() => onSizeChange(s.value)}
            className={`aspect-square w-12 p-2 text-center rounded-full ${
              size === s.value ? "bg-firstColor" : "bg-gray-400"
            }`}
          >
            {s.value}
          </button>
        ))}
      </div>
      <p className="text-base font-normal text-gray-600">
        {SIZES.map((s) => `${s.value} ${formatMoney(unitPrice(product, s.value))}`).join(" · ")}
      </p>
    </aside>
    <aside className="flex flex-[3_3_0] rounded-xl shadow-primary px-8 md:px-14 py-8 gap-4 items-center">
      <img
        src={product.image}
        alt=""
        className="h-24 aspect-square rounded-full object-cover"
      />
      <header className="flex flex-col flex-[4_4_0]">
        <h2 className="font-black text-xl text-center md:text-left uppercase">{product.title}</h2>
        <p className="text-gray-600">
          {quantity} × {size} · {formatMoney(total)}
        </p>
      </header>
      <button
        aria-label="Add to cart"
        onClick={onAdd}
        className="flex bg-firstColor rounded-full aspect-square h-14 items-center justify-center text-buttonColor"
      >
        <FontAwesomeIcon icon={faArrowRight} className="text-4xl" />
      </button>
    </aside>
  </footer>
);

export default ProductItemBottom;
