import { NavLink } from "react-router-dom";
import { useUserAuth } from "../../setup/context/user-auth-context";
import LoggedInIcons from "./LoggedInIcons";

const SignIn = () => {
  const { user } = useUserAuth();

  return user ? (
    <div className="max-lg:hidden">{<LoggedInIcons />}</div>
  ) : (
    <div className="sign-in py-5 md:py-6 max-lg:hidden flex items-center gap-3">
      <NavLink
        to="auth/login"
        className="uppercase text-[12px] tracking-[0.18em] font-semibold py-2 px-6 rounded-full border border-line text-ink hover:border-accent hover:text-accent duration-200"
      >
        Login
      </NavLink>
      <NavLink
        to="auth/register"
        className="uppercase text-[12px] tracking-[0.18em] py-2 px-6 rounded-full bg-accent text-onAccent font-semibold hover:bg-accentHover duration-200"
      >
        Sign up
      </NavLink>
    </div>
  );
};

export default SignIn;
