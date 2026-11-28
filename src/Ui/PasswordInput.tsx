import { InputHTMLAttributes, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  invalid?: boolean;
};

/** Password field with a show/hide (eye) button. */
const PasswordInput = ({ invalid, className = "", ...rest }: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mt-2">
      <input
        {...rest}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={`w-full border-2 rounded-2xl p-3 pr-12 ${
          invalid ? "border-red-500" : "border-line"
        } ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-accent"
      >
        <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
      </button>
    </div>
  );
};

export default PasswordInput;
