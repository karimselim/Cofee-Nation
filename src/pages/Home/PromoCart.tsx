import { Button, Section } from "../../Ui";

const PromoCart = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <Section className="mb-6 md:mb-[-8rem]">
      <div className="shadow-primary w-full flex justify-between items-center text-center max-md:flex-col md:text-left py-10 md:py-14 px-8 md:px-16 rounded-2xl bg-surface border border-line">
        <aside className="flex flex-col flex-1 space-y-3">
          <p className="text-2xl md:text-3xl font-bold uppercase tracking-[0.08em] text-ink">
            Check our promo today!
          </p>
          <p className="text-muted">Let's see the deals and pick yours</p>
        </aside>
        <div className="hidden lg:block lg:flex-1 md:w-[75%]"></div>
        <aside className="flex-1 w-full">
          <Button
            onClick={scrollToTop}
            to="/products"
            className="bg-accent text-onAccent hover:bg-accentHover rounded-full ml-auto w-full md:w-[75%] py-4 font-semibold uppercase text-[11px] tracking-[0.2em]"
          >
            See promo
          </Button>
        </aside>
      </div>
    </Section>
  );
};

export default PromoCart;
