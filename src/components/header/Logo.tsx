import { Link } from "react-router-dom";
import jokopi from "../../assists/jokopi.svg";

const Logo = () => {
  return (
    <div className="logo flex items-center py-4 md:py-5 font-bold text-lg">
      <Link to="/" className="logo flex items-center gap-3 border-none">
        <img src={jokopi} alt="Coffee Nation logo" className="shrink-0 w-9 md:w-10" />
        <span className="uppercase whitespace-nowrap tracking-[0.12em] md:tracking-[0.18em] text-ink text-[13px] md:text-base">Coffee Nation</span>
      </Link>
    </div>
  );
};

export default Logo;
