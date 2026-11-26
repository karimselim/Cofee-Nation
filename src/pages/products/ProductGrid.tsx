import { Link } from "react-router-dom";
import { ProductsSection } from "./";
import { productPath } from "../../data/products";
import { Product } from "../../types";

const ProductGrid = ({ products }: { products: Product[] }) => (
  <ProductsSection>
    {products.map((prod) => (
      <Link
        to={productPath(prod)}
        className="flex flex-col shadow-lg hover:shadow-xl rounded-3xl w-36 bg-white p-5 duration-200 break-words justify-between"
        key={`${prod.category}-${prod.id}`}
      >
        <img
          src={prod.image}
          alt={prod.title}
          loading="lazy"
          className="rounded-full mt-[-50%] aspect-square mb-3 shadow-lg object-cover"
        />
        <article className="flex gap-5 flex-col text-center">
          <p className="text-lg font-black min-h-[102px]">
            {prod.title.split(" ").slice(0, 3).join(" ")}
          </p>
          <p className="font-bold end text-buttonColor mt-auto">{`IDR ${prod.price}.000`}</p>
        </article>
      </Link>
    ))}
  </ProductsSection>
);

export default ProductGrid;
