import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SORT_OPTIONS, filterProducts, parseMaxPrice, parseSort } from "../../utils/catalog";
import Dropdown from "../../components/Dropdown";
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

  const field =
    "w-full h-11 bg-surface rounded-lg border border-line px-3 outline-none focus:border-accent hover:border-accent";

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-[minmax(0,1fr)_9rem] lg:grid-cols-[minmax(0,1fr)_9rem_14rem] items-end"
      >
        <div className="flex flex-col text-left">
          <label htmlFor="product-search" className="text-sm mb-1 text-muted">Search</label>
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
          <label htmlFor="product-max" className="text-sm mb-1 text-muted">Max price (EGP)</label>
          <input
            id="product-max"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 150"
            value={maxRaw}
            aria-invalid={maxInvalid || undefined}
            onChange={(e) => update("max", e.target.value)}
            className={field}
          />
        </div>
        <Dropdown
          label="Sort by"
          value={sort}
          options={SORT_OPTIONS}
          onChange={(v) => update("sort", v === "default" ? "" : v)}
          className="sm:col-span-2 lg:col-span-1"
        />
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
      <p className="text-accent my-8">
        *prices shown are after the current discount
      </p>
    </div>
  );
};

export default CategoryPage;
