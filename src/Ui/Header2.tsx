import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

const Header2 = (props: Props) => {
  return (
    <h2
      className={`text-3xl md:text-4xl font-bold uppercase tracking-[0.1em] mb-5 leading-[1.2] text-ink ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </h2>
  );
};

export default Header2;
