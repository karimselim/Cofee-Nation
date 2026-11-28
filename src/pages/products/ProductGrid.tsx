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
        className="flex flex-col shadow-lg hover:shadow-xl hover:border-accent/60 border border-line rounded-3xl w-44 bg-surface p-5 duration-200 justify-between"
        key={`${prod.category}-${prod.id}`}
      >
        <img
          src={prod.image}
          alt={prod.title}
          loading="lazy"
          className="rounded-full mt-[-50%] aspect-square mb-3 shadow-lg object-cover"
        />
        <article className="flex gap-5 flex-col text-center">
          <p className="text-base font-bold uppercase tracking-wide min-h-[72px] leading-6 break-words">
            {prod.title.split(" ").slice(0, 3).join(" ")}
          </p>
          <p className="font-bold end text-accent mt-auto">{formatMoney(prod.price)}</p>
        </article>
      </Link>
    ))}
  </ProductsSection>
);

export default ProductGrid;
