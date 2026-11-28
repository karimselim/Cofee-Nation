import { Header2, Section, TextHolder } from "../../Ui";
import global from "../../assists/images/global.svg";

const VisitStore = () => {
  return (
    <Section>
      <TextHolder>
        <p className="uppercase tracking-[0.35em] text-accent text-[11px] mb-3">
          Find us
        </p>
        <Header2>Visit Our Store in the Spot on the Map Below</Header2>
        <p className="text-muted">
          See our store in every city on the spot and spen your good day there.
          See you soon!
        </p>
      </TextHolder>
      <img src={global} alt="" className="opacity-80 mx-auto max-w-full" />
    </Section>
  );
};

export default VisitStore;
