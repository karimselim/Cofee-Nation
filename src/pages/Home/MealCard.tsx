import check from "../../assists/icons/check.svg";
import { Button } from "../../Ui";
import { Product } from "../../types";
import { productPath } from "../../data/products";
import { formatMoney } from "../../utils/money";

const MealCard = ({ product }: { product: Product }) => {
  return (
    <div
      data-testid="favourite-card"
      className="card flex flex-col border border-line bg-surface rounded-2xl px-6 py-8 items-center gap-5 flex-1 hover:border-accent/60 duration-200"
    >
      <img
        src={product.image}
        alt={product.title}
        className="rounded-full w-36 h-36 object-cover object-center scale-105 mb-4 border border-line"
      />
      <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-ink text-center">
        {product.title}
      </h3>
      <ul className="mb-6 flex flex-col gap-4 text-left text-muted text-sm">
        {product.ingredients.slice(0, 4).map((ingredient) => (
          <li key={ingredient} className="flex gap-4">
            <img src={check} alt="" className="w-5 opacity-90" />
            <p>{ingredient}</p>
          </li>
        ))}
      </ul>
      <p className="price font-bold text-2xl text-accent">{formatMoney(product.price)}</p>
      <Button
        to={productPath(product)}
        className="bg-accent text-onAccent hover:bg-accentHover w-40 rounded-full py-3 font-semibold uppercase text-[11px] tracking-[0.2em]"
      >
        Order Now
      </Button>
    </div>
  );
};

export default MealCard;
