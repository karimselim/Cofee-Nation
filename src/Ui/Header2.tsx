import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

const Header2 = (props: Props) => {
  return (
    <h2
      className={`text-4xl font-semibold mb-5 leading-[3rem] ${props.className ?? ""}`}
    >
      {props.children}
    </h2>
  );
};

export default Header2;
