import { setLang, useLang } from "../i18n";

const LangToggle = () => {
  const lang = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className="ml-2 shrink-0 rounded-full border border-firstColor px-3 h-9 text-sm font-semibold"
    >
      {lang === "ar" ? "English" : "عربي"}
    </button>
  );
};

export default LangToggle;
