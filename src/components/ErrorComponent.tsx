import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import empty from "../assists/images/empty-box.svg";
import Button from "../Ui/Button";

const ErrorComponent = ({ message }: { message?: string }) => {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const text =
    message ??
    (notFound || !error
      ? "Page not found"
      : "Something went wrong. Please try again.");

  return (
    <div className="flex h-screen w-screen items-center justify-center text-center">
      <div className="flex flex-col w-72 gap-6">
        <img src={empty} alt="" />
        <h1 className="font-bold text-xl">{text}</h1>
        <Button
          to="/"
          className="bg-buttonColor text-lg font-bold text-white rounded-2xl py-2 mb-4 shadow-xl"
        >
          back to home
        </Button>
      </div>
    </div>
  );
};

export default ErrorComponent;
