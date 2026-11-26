import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "cn:theme";

export const getStoredTheme = (): Theme => {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const applyTheme = (t: Theme) => {
  document.documentElement.setAttribute("data-theme", t);
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="ml-3 shrink-0 rounded-full border border-firstColor w-9 h-9 flex items-center justify-center text-lg"
    >
      {dark ? "☀" : "☾"}
    </button>
  );
};

export default ThemeToggle;
