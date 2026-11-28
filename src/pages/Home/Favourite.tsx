import { Section, Header2, TextHolder } from "../../Ui";
import MealCard from "./MealCard";

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
        <MealCard />
        <MealCard />
        <MealCard />
      </div>
    </Section>
  );
}

export default Favourite;
