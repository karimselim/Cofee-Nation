import { Link } from "react-router-dom";
import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  to: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children?: ReactNode;
}

const Button = ({ to, className = "", onClick, children }: ButtonProps) => {
  return (
    <Link
      onClick={onClick}
      to={to}
      className={`capitalize flex justify-center leading-loose px-4 duration-200 ease-in-out ${className}`}
    >
      {children}
    </Link>
  );
};

export default Button;
