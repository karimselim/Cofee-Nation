import { Link } from "react-router-dom";
import { ProductItemLeft, ProductItemRight, ProductItemBottom } from "..";
import { Product } from "../../../types";

const ProductItem = ({ prod }: { prod: Product }) => {
  const details = {
    title: prod.title,
    image: prod.image,
    description: prod.description || "This item has no description yet*",
    price: prod.price,
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
        {details.title.split(" ").slice(0, 3).join(" ")}
      </nav>
      <div className="flex gap-16 flex-col md:flex-row justify-between my-10">
        <ProductItemLeft details={details} />
        <ProductItemRight details={details} item={prod} />
      </div>
      <ProductItemBottom details={details} />
    </section>
  );
};

export default ProductItem;
