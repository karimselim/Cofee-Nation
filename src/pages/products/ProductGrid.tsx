import { Link } from "react-router-dom";
import { ProductsSection } from "./";
import { productPath } from "../../data/products";
import { formatMoney } from "../../utils/money";
import { Product } from "../../types";

const ProductGrid = ({ products }: { products: Product[] }) => (
  <ProductsSection>
    {products.map((prod) => (
      <Link
        to={productPath(prod)}
        className="group flex flex-col items-center gap-4 shadow-lg hover:shadow-xl hover:border-accent/60 border border-line rounded-2xl w-full max-w-[176px] h-full bg-surface p-4 duration-200"
        key={`${prod.category}-${prod.id}`}
      >
        <img
          src={prod.image}
          alt={prod.title}
          loading="lazy"
          className="rounded-full w-28 h-28 object-cover border border-line bg-surface2"
        />
        <article className="flex flex-col gap-2 text-center flex-1 justify-between w-full">
          <p data-testid="title" className="text-[13px] font-bold uppercase tracking-[0.06em] min-h-[44px] leading-5 break-words">
            {prod.title.split(" ").slice(0, 3).join(" ")}
          </p>
          <p data-testid="price" className="font-bold end text-accent mt-auto">{formatMoney(prod.price)}</p>
        </article>
      </Link>
    ))}
  </ProductsSection>
);

export default ProductGrid;
