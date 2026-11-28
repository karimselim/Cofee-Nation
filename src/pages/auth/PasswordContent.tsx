import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import jokopi from "../../assists/jokopi.svg";
import { useUserAuth } from "../../setup/context/user-auth-context";
import { describeAuthError } from "../../auth/errors";
import { validateEmail } from "../../utils/validation";

const PasswordContent = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);
  const { resetPassword } = useUserAuth();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSent("");
    const problem = validateEmail(email);
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      await resetPassword(email.trim());
      setSent(
        `If an account exists for ${email.trim()}, a reset link is on its way. Check your inbox and spam folder, or try again in a minute.`
      );
    } catch (err) {
      setError(describeAuthError(err).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="logo flex items-center font-bold ml-2 text-xl justify-center mb-16">
        <Link to="/" className="logo flex items-center gap-4 border-none outline-none">
          <img src={jokopi} alt="Coffee Nation logo" className="w-8" />
          Coffee Nation
        </Link>
      </header>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4 md:gap-5">
        <h1 className="text-3xl font-bold text-center">Forgot your password?</h1>
        <p className="text-xl text-center">Don’t worry, we got your back!</p>
        <label htmlFor="reset-email" className="sr-only">
          Email address
        </label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={!!error || undefined}
          onChange={(e) => {
            setError("");
            setEmail(e.target.value);
          }}
          className={`w-full border-2 rounded-2xl p-3 mt-2 ${
            error ? "border-red-500" : "border-line"
          }`}
          placeholder="Enter your email address to get link"
        />
        <p role="alert" className="text-red-500">
          {error}
        </p>
        {sent && (
          <p role="status" className="text-emerald-400">
            {sent}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="capitalize bg-accent text-lg hover:bg-accentHover disabled:opacity-60 font-bold text-onAccent rounded-2xl py-2 shadow-xl"
        >
          Send
        </button>
        <Link
          to="/auth/login"
          className="text-center font-semibold text-accent hover:underline"
        >
          Back to login
        </Link>
      </form>
    </>
  );
};

export default PasswordContent;
