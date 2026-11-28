import product from "../../assists/images/latte-glass.webp";
import check from "../../assists/icons/check.svg";
import { Button } from "../../Ui";

const MealCard = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="card flex flex-col border border-line bg-surface rounded-2xl px-6 py-8 items-center gap-5 flex-1 hover:border-accent/60 duration-200">
      <img
        src={product}
        alt="Hazelnut Latte"
        className="rounded-full w-36 h-36 object-cover mb-4 border border-line"
      />
      <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-ink">
        Hazelnut Latte
      </h3>
      <ul className="mb-6 flex flex-col gap-4 text-left text-muted text-sm">
        <li className="flex gap-4">
          <img src={check} alt="" className="w-5 opacity-90" />
          <p>Hazelnut Syrup</p>
        </li>
        <li className="flex gap-4">
          <img src={check} alt="" className="w-5 opacity-90" />
          <p>Wanilla Whipped Cream</p>
        </li>
        <li className="flex gap-4">
          <img src={check} alt="" className="w-5 opacity-90" />
          <p>Ice / Hot</p>
        </li>
        <li className="flex gap-4 ">
          <img src={check} alt="" className="w-5 opacity-90" />
          <p>Sliced Banana on Top</p>
        </li>
      </ul>
      <p className="price font-bold text-2xl text-accent">EGP 75</p>
      <Button
        onClick={scrollToTop}
        to="/products"
        className="bg-accent text-onAccent hover:bg-accentHover w-40 rounded-full py-3 font-semibold uppercase text-[11px] tracking-[0.2em]"
      >
        Order Now
      </Button>
    </div>
  );
};

export default MealCard;
