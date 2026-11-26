import { useParams } from "react-router-dom";
import ProductItem from "./productItem/ProductItem";
import Footer from "../../components/Footer";
import ErrorComponent from "../../components/ErrorComponent";
import { SEGMENT_CATEGORY, getProduct } from "../../data/products";

const ProductsDetails = () => {
  const { cat = "", id = "" } = useParams();
  const category = SEGMENT_CATEGORY[cat];
  const product = category ? getProduct(category, Number(id)) : undefined;

  if (!product) return <ErrorComponent message="We couldn't find that product." />;

  return (
    <>
      <ProductItem prod={product} />
      <Footer />
    </>
  );
};

export default ProductsDetails;
