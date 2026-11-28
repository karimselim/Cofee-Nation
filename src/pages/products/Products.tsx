import promoImage from "../../assists/images/latte-wood.webp";
import Footer from "../../components/Footer";
import ProductsLayout from "./ProductsLayout";

const Products = () => {
  return (
    <>
      <section className="flex flex-row-reverse max-md:flex-col global-px">
        <aside className="flex flex-[2_2_0%] py-5 md:pl-16 flex-col">
          <h1 className="sr-only">Our products</h1>
          <ProductsLayout />
        </aside>
        <aside className="flex flex-1 flex-col global-px py-8 text-center left items-center gap-4 border-r-2 border-line max-md:border-0">
          <h2 className="font-bold text-2xl">Promo Today</h2>
          <p className="text-center">
            Coupons will be updated every weeks.
            <br /> Check them out!
          </p>
          <div className="promos flex flex-col items-center gap-3">
            <img
              src={promoImage}
              alt="A cup of coffee"
              className="w-52 h-52 object-cover rounded-full border border-line"
            />
            <p className="text-accent font-semibold">No promo today</p>
            <p className="font-medium text-sm text-muted">Dont worry, check tommorow</p>
          </div>
        </aside>
      </section>
      <Footer />
    </>
  );
};

export default Products;
