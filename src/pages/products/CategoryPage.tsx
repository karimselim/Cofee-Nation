import { useMemo } from "react";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import { usePagination } from "../../hooks/usePagination";
import { getByCategory, getFeatured } from "../../data/products";
import { Category } from "../../types";

/** One page for every product tab: the favorites mix or a single category. */
const CategoryPage = ({ category }: { category?: Category }) => {
  const items = useMemo(
    () => (category ? getByCategory(category) : getFeatured()),
    [category]
  );
  const { currentProducts, paginate, productsPerPage, currentPage, setCurrentPage } =
    usePagination(items);

  return (
    <div>
      <ProductGrid products={currentProducts} />
      <Pagination
        paginate={paginate}
        ProductsPerPage={productsPerPage}
        totalProducts={items.length}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <p className="text-buttonColor my-8">
        *prices shown are after the current discount
      </p>
    </div>
  );
};

export default CategoryPage;
