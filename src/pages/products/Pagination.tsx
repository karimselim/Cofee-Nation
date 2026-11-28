import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faAngleRight,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";

interface PaginationProps {
  ProductsPerPage: number;
  totalProducts: number;
  paginate: (page: number, lastPage: number) => void;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}

const Pagination = ({
  ProductsPerPage,
  totalProducts,
  paginate,
  setCurrentPage,
  currentPage,
}: PaginationProps) => {
  const lastPage = Math.max(1, Math.ceil(totalProducts / ProductsPerPage));
  const [inputPage, setInputPage] = useState(String(currentPage));

  // keep the page box in sync with the real page
  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const goTo = (page: number) => {
    const clamped = Math.min(Math.max(1, page), lastPage);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const page = parseInt(inputPage, 10);
    if (Number.isNaN(page)) {
      setInputPage(String(currentPage));
      return;
    }
    paginate(page, lastPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex mt-8 justify-between xl:justify-center items-center relative">
      <div className="buttons flex">
        {currentPage > 1 && (
          <button
            onClick={() => goTo(currentPage - 1)}
            className="mr-2 group border border-accent text-accent px-4 py-2 rounded-lg font-bold hover:bg-accentHover hover:text-onAccent duration-300 ease-in-out flex gap-2 items-center"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className=" text-lg group-hover:-translate-x-1 duration-100"
            />
            Previous
          </button>
        )}
        {currentPage < lastPage && (
          <button
            onClick={() => goTo(currentPage + 1)}
            className="rounded-xl px-5 py-2 bg-accent hover:bg-accentHover text-onAccent font-bold flex items-center gap-2 duration-300 group"
          >
            Next
            <FontAwesomeIcon
              icon={faArrowRight}
              className="group-hover:translate-x-1 duration-100"
            />
          </button>
        )}
      </div>
      <div className="input hidden sm:flex right-0 absolute items-center justify-center text-sm">
        <label htmlFor="page-input">Page</label>
        <div className="">
          <input
            id="page-input"
            className="text-center bg-surface2 text-ink border-line mx-2 w-10 h-7 rounded outline-none border"
            type="number"
            value={inputPage}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputPage(e.target.value)
            }
            onKeyDown={submitInput}
            max={lastPage}
            min={1}
          />
          of {lastPage}
        </div>
        <div className="ml-3 flex">
          {currentPage > 1 && (
            <button
              aria-label="Previous page"
              className="px-2 py-1 bg-accent hover:bg-accentHover text-onAccent flex duration-75"
              onClick={() => goTo(currentPage - 1)}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}
          {currentPage < lastPage && (
            <button
              aria-label="Next page"
              onClick={() => goTo(currentPage + 1)}
              className="px-2 py-1 bg-accent hover:bg-accentHover text-onAccent flex duration-75"
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
