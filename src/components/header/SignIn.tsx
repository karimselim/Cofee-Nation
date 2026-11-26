import { NavLink } from "react-router-dom";
import { useUserAuth } from "../../setup/context/user-auth-context";
import { useT } from "../../i18n";
import LoggedInIcons from "./LoggedInIcons";

const SignIn = () => {
  const { user } = useUserAuth();
  const t = useT();

  return user ? (
    <div className="max-lg:hidden">{<LoggedInIcons />}</div>
  ) : (
    <div className="sign-in py-5 md:py-8 max-lg:hidden">
      <NavLink
        to="auth/login"
        className="capitalize whitespace-nowrap m-2 font-semibold py-2 px-6 rounded-3xl border border-firstColor hover:bg-firstColor duration-200 hover:text-white"
      >
        {t("nav.login", "Login")}
      </NavLink>
      <NavLink
        to="auth/register"
        className="capitalize whitespace-nowrap ml-2 py-2 px-6 rounded-3xl bg-firstColor duration-200 ease-in-out text-buttonColor font-semibold hover:bg-hoveredColor"
      >
        {t("nav.signup", "Sign up")}
      </NavLink>
    </div>
  );
};

export default SignIn;
