import { useEffect, useState } from "react";

export const PRODUCTS_PER_PAGE = 8;

export function usePagination<T>(items: T[], perPage = PRODUCTS_PER_PAGE) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  // when the list changes (another tab) go back to the first page
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const paginate = (page: number, lastPage: number) => {
    setCurrentPage(Math.min(Math.max(1, page), lastPage));
  };

  const last = currentPage * perPage;
  const currentProducts = items.slice(last - perPage, last);

  return {
    paginate,
    currentProducts,
    productsPerPage: perPage,
    setCurrentPage,
    currentPage,
    totalPages,
    realProducts: items,
  };
}
