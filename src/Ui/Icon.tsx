import { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
}

const Icon = (props: Props) => {
  return (
    <div className="flex items-center justify-center aspect-square w-10 p-2 rounded-full bg-firstColor text-buttonColor">
      {props.children}
    </div>
  );
};

export default Icon;
