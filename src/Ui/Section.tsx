import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

const Section = (props: Props) => {
  return (
    <section
      className={`global-px flex flex-col py-8 md:py-20 text-center ${
        props.className || ""
      }`}
    >
      {props.children}
    </section>
  );
};

export default Section;
