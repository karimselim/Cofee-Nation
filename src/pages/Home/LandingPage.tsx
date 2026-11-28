import { Button, Icon } from "../../Ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot, faUser, faStore } from "@fortawesome/free-solid-svg-icons";

const stats = [
  { icon: faUser, value: "90+", label: "Staff" },
  { icon: faMugHot, value: "800+", label: "Customers" },
  { icon: faStore, value: "30+", label: "Stores" },
];

const LandingPage = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-landing bg-cover bg-center opacity-70" aria-hidden="true"></div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-page via-page/85 to-page/10"
          aria-hidden="true"
        ></div>
        <div className="global-px relative pt-14 md:pt-20 pb-12 md:pb-16">
          <article className="flex flex-col gap-6 max-w-2xl">
            <p className="uppercase tracking-[0.4em] text-accent text-[11px] md:text-xs">
              Freshly roasted · since 2023
            </p>
            <h1 className="font-extrabold uppercase text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
              Start Your Day with Coffee and Good Meals
            </h1>
            <p className="text-muted leading-7 max-w-xl">
              We provide high quality beans, good taste, and healthy meals made
              by love just for you. Start your day with us for a bigger smile!
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                onClick={scrollToTop}
                to="/products"
                className="bg-accent text-onAccent hover:bg-accentHover font-semibold uppercase text-xs tracking-[0.2em] px-8 py-4 rounded-full"
              >
                get started
              </Button>
              <Button
                to="/products"
                className="border border-line text-ink hover:border-accent hover:text-accent font-semibold uppercase text-xs tracking-[0.2em] px-8 py-4 rounded-full"
              >
                see the menu
              </Button>
            </div>
          </article>

          <section className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line rounded-2xl border border-line bg-surface/80 backdrop-blur-sm">
            {stats.map((stat) => (
              <aside
                key={stat.label}
                className="flex justify-center items-center gap-4 py-6 px-4"
              >
                <Icon>
                  <FontAwesomeIcon icon={stat.icon} />
                </Icon>
                <div className="flex flex-col items-start">
                  <p className="font-bold text-xl text-ink">{stat.value}</p>
                  <p className="text-muted text-sm">{stat.label}</p>
                </div>
              </aside>
            ))}
          </section>
        </div>
      </section>
      <div className="mb-10"></div>
    </>
  );
};

export default LandingPage;
