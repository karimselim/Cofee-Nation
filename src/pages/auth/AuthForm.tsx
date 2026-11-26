import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordContent from "./PasswordContent";
import PasswordInput from "../../Ui/PasswordInput";
import googleLogo from "../../assists/icons/google.svg";
import jokopi from "../../assists/jokopi.svg";
import { useUserAuth } from "../../setup/context/user-auth-context";
import { describeAuthError } from "../../auth/errors";
import {
  validateEmail,
  validateLoginPassword,
  validateNewPassword,
  validatePhone,
} from "../../utils/validation";

const fieldClass = (invalid: boolean) =>
  `w-full border-2 rounded-2xl p-3 mt-2 ${invalid ? "border-red-500" : "border-gray-400"}`;

const AuthForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signup, login, signinWithGoogle, resendVerification } = useUserAuth();

  const isRegister = location.pathname.includes("register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", phone: "", form: "" });
  const [notVerified, setNotVerified] = useState(false);
  const [info, setInfo] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [busy, setBusy] = useState(false);

  if (location.pathname.includes("forgotPassword")) return <PasswordContent />;

  const clear = (field: keyof typeof errors) =>
    setErrors((e) => ({ ...e, [field]: "", form: "" }));

  const fail = (error: unknown) => {
    const { field, message } = describeAuthError(error);
    setNotVerified(
      typeof error === "object" && !!error && (error as { code?: string }).code === "app/email-not-verified"
    );
    setErrors((e) => ({ ...e, [field]: message }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setInfo("");
    setNotVerified(false);
    const next = {
      email: validateEmail(email),
      password: isRegister ? validateNewPassword(password) : validateLoginPassword(password),
      phone: isRegister ? validatePhone(phone) : "",
      form: "",
    };
    setErrors(next);
    if (next.email || next.password || next.phone) return;

    setBusy(true);
    try {
      if (isRegister) {
        await signup(email.trim(), password);
        setSentTo(email.trim());
        setPassword("");
      } else {
        await login(email.trim(), password);
        navigate("/products");
      }
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setBusy(true);
    try {
      await resendVerification(email.trim(), password);
      setInfo("We sent a new verification link. Check your inbox and spam folder.");
      setErrors((x) => ({ ...x, form: "" }));
      setNotVerified(false);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setErrors({ email: "", password: "", phone: "", form: "" });
    setBusy(true);
    try {
      await signinWithGoogle();
      navigate("/");
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="logo flex items-center font-bold ml-2 text-xl justify-between mb-10">
        <Link to="/" className="logo flex items-center gap-4 border-none outline-none">
          <img src={jokopi} alt="Coffee Nation logo" className="w-8" />
          Coffee Nation
        </Link>
        <h1 className="text-buttonColor font-semibold">{isRegister ? "Signup" : "Login"}</h1>
      </header>

      {sentTo ? (
        <div role="status" className="rounded-2xl border-2 border-firstColor p-5 space-y-3">
          <p className="font-bold text-lg">Check your email</p>
          <p>
            We sent a verification link to <b>{sentTo}</b>. Open it to confirm that this
            address is yours, then log in.
          </p>
          <Link
            to="/auth/login"
            className="bg-buttonColor text-white font-bold rounded-2xl py-2 px-6 inline-block"
          >
            Go to login
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="mt-16 flex flex-col space-y-3 md:space-y-4 gap-5">
            <div>
              <label htmlFor="email" className="text-footerTextColor font-bold">
                Email address :
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                aria-invalid={!!errors.email || undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clear("email");
                }}
                className={fieldClass(!!errors.email)}
                placeholder="Enter your email address"
              />
              <p id="email-error" role="alert" className="text-red-500">
                {errors.email}
              </p>
            </div>
            <div className="my-4">
              <label htmlFor="password" className="text-footerTextColor font-bold">
                Password :
              </label>
              <PasswordInput
                id="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clear("password");
                }}
                placeholder="Enter your password"
              />
              <p id="password-error" role="alert" className="text-red-500">
                {errors.password}
              </p>
              {isRegister && (
                <p className="text-sm text-gray-500">
                  At least 8 characters, with a letter and a number.
                </p>
              )}
            </div>
            {isRegister && (
              <div className="my-4">
                <label htmlFor="phone" className="text-footerTextColor font-bold">
                  Phone Number (Optional) :
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  aria-invalid={!!errors.phone || undefined}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clear("phone");
                  }}
                  className={fieldClass(!!errors.phone)}
                  placeholder="Enter your phone number"
                />
                <p role="alert" className="text-red-500">
                  {errors.phone}
                </p>
              </div>
            )}
          </div>

          {!isRegister && (
            <div className="mb-4 mt-8 flex justify-end">
              <Link to="/auth/forgotPassword" className="hover:underline font-medium text-sm">
                Forgot password?
              </Link>
            </div>
          )}

          {errors.form && (
            <p role="alert" className="text-red-500 mb-2">
              {errors.form}
            </p>
          )}
          {notVerified && (
            <button
              type="button"
              onClick={resend}
              disabled={busy}
              className="underline text-buttonColor font-semibold mb-2"
            >
              Send the verification email again
            </button>
          )}
          {info && (
            <p role="status" className="text-green-700 mb-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full capitalize bg-firstColor text-lg hover:bg-hoveredColor disabled:opacity-60 font-bold text-buttonColor mt-5 rounded-2xl py-2 mb-4 shadow-xl"
          >
            {isRegister ? "Signup" : "Login"}
          </button>
          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="w-full flex justify-center items-center font-bold text-lg text-buttonColor rounded-2xl py-2 my-4 shadow-xl gap-2"
          >
            <img src={googleLogo} alt="" className="w-6 h-6" />
            {isRegister ? "Signup with Google" : "Login with Google"}
          </button>
        </form>
      )}

      <div className="flex items-center justify-center relative w-full">
        <hr className="w-full h-px dark:bg-gray-700 my-6 border-0" />
        <span className="absolute bg-white -translate-x-1/2 left-1/2 px-3 w-max">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}
        </span>
      </div>
      <Link
        to={isRegister ? "/auth/login" : "/auth/register"}
        className="flex justify-center bg-buttonColor text-lg font-bold text-white rounded-2xl py-2 mb-4 shadow-xl"
      >
        {isRegister ? "Login here" : "Signup"}
      </Link>
    </>
  );
};

export default AuthForm;
