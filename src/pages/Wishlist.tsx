import { Link } from "react-router-dom";
import { Footer } from "../components";
import { useAppDispatch, useAppSelector } from "../setup/hooks";
import { wishlistActions } from "../setup/wishlist-slice";
import { productPath } from "../data/products";
import { formatMoney } from "../utils/money";

const Wishlist = () => {
  const items = useAppSelector((s) => s.wishlist.items);
  const dispatch = useAppDispatch();
  return (
    <>
      <section className="global-px py-10 min-h-[50vh]">
        <div className="max-w-3xl mx-auto">
        <h1 className="text-accent text-3xl font-extrabold mb-6 text-center">Your favourites</h1>
        {items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-lg mb-4">You have no favourites yet.</p>
            <Link to="/products" className="bg-accent text-onAccent font-bold rounded-xl px-6 py-3">
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4">
            {items.map((p) => (
              <li
                key={`${p.category}-${p.id}`}
                data-testid="wishlist-item"
                className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3"
              >
                <img src={p.image} alt="" className="w-16 h-16 rounded-full object-cover" />
                <Link to={productPath(p)} className="flex-1 font-semibold underline">
                  {p.title}
                </Link>
                <span>{formatMoney(p.price)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${p.title} from favourites`}
                  onClick={() => dispatch(wishlistActions.toggle(p))}
                  className="text-red-400 font-bold px-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Wishlist;
