import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SORT_OPTIONS, filterProducts, parseMaxPrice, parseSort } from "../../utils/catalog";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import { usePagination } from "../../hooks/usePagination";
import { getByCategory, getFeatured } from "../../data/products";
import { Category } from "../../types";

/** One page for every product tab: the favorites mix or a single category. */
const CategoryPage = ({ category }: { category?: Category }) => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = parseSort(params.get("sort"));
  const maxRaw = params.get("max") ?? "";
  const maxPrice = parseMaxPrice(maxRaw);
  const maxInvalid = maxRaw !== "" && maxPrice === null;

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const items = useMemo(
    () =>
      filterProducts(category ? getByCategory(category) : getFeatured(), { q, sort, maxPrice }),
    [category, q, sort, maxPrice]
  );
  const { currentProducts, paginate, productsPerPage, currentPage, setCurrentPage } =
    usePagination(items);

  const field = "bg-white rounded-lg border border-gray-200 px-3 py-2 outline-none";

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-wrap gap-3 items-end"
      >
        <div className="flex flex-col text-left">
          <label htmlFor="product-search" className="text-sm">Search</label>
          <input
            id="product-search"
            type="search"
            maxLength={50}
            placeholder="Search by name"
            value={q}
            onChange={(e) => update("q", e.target.value)}
            className={field}
          />
        </div>
        <div className="flex flex-col text-left">
          <label htmlFor="product-max" className="text-sm">Max price (EGP)</label>
          <input
            id="product-max"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 150"
            value={maxRaw}
            aria-invalid={maxInvalid || undefined}
            onChange={(e) => update("max", e.target.value)}
            className={`${field} w-32`}
          />
        </div>
        <div className="flex flex-col text-left">
          <label htmlFor="product-sort" className="text-sm">Sort by</label>
          <select
            id="product-sort"
            value={sort}
            onChange={(e) => update("sort", e.target.value === "default" ? "" : e.target.value)}
            className={field}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </form>
      {maxInvalid && (
        <p role="alert" className="text-red-500 mt-2 text-left">
          Max price must be a whole number above 0.
        </p>
      )}
      {items.length === 0 && (
        <p role="status" className="my-10">No products match your search.</p>
      )}
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
