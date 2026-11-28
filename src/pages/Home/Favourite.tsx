import { Section, Header2, TextHolder } from "../../Ui";
import MealCard from "./MealCard";
import { products } from "../../data/products";

/** Three different catalogue products, one per row of the favourite section. */
const favouriteTitles = ["Latte", "Cold Brew", "Matcha Latte"];
const favourites = favouriteTitles
  .map((title) => products.find((p) => p.title === title))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

function Favourite() {
  return (
    <Section>
      <TextHolder>
        <p className="uppercase tracking-[0.35em] text-accent text-[11px] mb-3">
          Our products
        </p>
        <Header2 className="mb-4">Here is People's Favorite</Header2>
        <p className="text-muted">
          Let's choose and have a bit taste of people's favourite. It might be
          yours too!
        </p>
      </TextHolder>
      <div className="cards flex flex-wrap gap-8 justify-center">
        {favourites.map((product) => (
          <MealCard key={`${product.category}-${product.id}`} product={product} />
        ))}
      </div>
    </Section>
  );
}

export default Favourite;
