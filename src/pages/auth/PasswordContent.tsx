import { useState } from "react";
import { Link } from "react-router-dom";
import jokopi from "../../assists/jokopi.svg";
import Button from "../../Ui/Button";
import { useUserAuth } from "../../setup/context/user-auth-context";

const PasswordContent = () => {
  const [email, setEmail] = useState("");
  const [error, SetError] = useState("");
  const [submitting, setSubmitting] = useState("");
  const { resetPassword } = useUserAuth();

  const resetPasswordHandler = async () => {
    try {
      await resetPassword(email);
      setSubmitting(
        "If u didn't receive a message please try again after a minute"
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === "Firebase: Error (auth/missing-email).") {
        SetError("Please enter your Email");
      } else {
        SetError("Please enter a valid Email");
      }
    }
  };

  return (
    <>
      <header className="logo flex items-center font-bold ml-2 text-xl justify-center mb-16">
        <Link
          to="/"
          className="logo flex items-center gap-4 border-none outline-none"
        >
          <img src={jokopi} alt="Coffee Nation logo" className="w-8" />
          Coffee Nation
        </Link>
      </header>
      <form className="flex flex-col gap-4 md:gap-5">
        <h1 className="text-3xl font-bold text-center">Forgot your password?</h1>
        <p className="text-xl text-center">Don’t worry, we got your back!</p>
        <input
          onChange={(e) => {
            SetError("");
            setEmail(e.target.value);
          }}
          type="text"
          className={`w-full border-2 border-gray-400 rounded-2xl p-3 mt-2 ${
            error && "border-red-500"
          }`}
          placeholder="Enter your email address to get link"
        />
        <p className="text-red-500">{error || submitting}</p>
        <Button
          onClick={resetPasswordHandler}
          to=""
          className="bg-firstColor text-lg hover:bg-hoveredColor font-bold text-buttonColor rounded-2xl py-2 shadow-xl"
        >
          Send
        </Button>
      </form>
    </>
  );
};

export default PasswordContent;
