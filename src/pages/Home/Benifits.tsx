import team from "../../assists/images/pour.webp";
import check from "../../assists/icons/check-circle.svg";
import { Header2 } from "../../Ui";

const Benifits = () => {
  return (
    <div className="py-10 md:py-20 global-px flex flex-col lg:flex-row lg:gap-20 items-center">
      <aside className="flex-1 img w-full">
        <img
          src={team}
          alt="Pouring a fresh cup of coffee"
          className="rounded-2xl border border-line w-full h-[320px] md:h-[420px] object-cover"
        />
      </aside>
      <aside className="flex flex-col flex-1 gap-6 mt-10 lg:mt-0">
        <p className="uppercase tracking-[0.35em] text-accent text-[11px]">About us</p>
        <Header2> We Provide Good Coffee and Healthy Meals</Header2>
        <p className="text-muted leading-7">
          You can explore the menu that we provide with fun and have their own
          taste and make your day better.
        </p>
        <ul className="flex flex-col gap-5 text-muted">
          <li className="flex gap-4">
            <img src={check} alt="" className="w-6 opacity-90" />
            <p>High quality beans</p>
          </li>
          <li className="flex gap-4">
            <img src={check} alt="" className="w-6 opacity-90" />
            <p>Healthy meals, you can request the ingredients</p>
          </li>
          <li className="flex gap-4">
            <img src={check} alt="" className="w-6 opacity-90" />
            <p>Chat with our staff to get better experience for ordering</p>
          </li>
          <li className="flex gap-4">
            <img src={check} alt="" className="w-6 opacity-90" />
            <p>Free member card with a minimum purchase of EGP 600.</p>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Benifits;
