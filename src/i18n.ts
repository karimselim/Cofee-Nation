import { useSyncExternalStore } from "react";

export type Lang = "en" | "ar";
const KEY = "cn:lang";

const ar = {
  "nav.home": "الرئيسية",
  "nav.products": "المنتجات",
  "nav.cart": "السلة",
  "nav.history": "الطلبات",
  "nav.favourites": "المفضلة",
  "nav.login": "تسجيل الدخول",
  "nav.signup": "إنشاء حساب",
  "tabs.favorites": "المفضل والعروض",
  "tabs.coffee": "قهوة",
  "tabs.iced": "مثلجات",
  "tabs.foods": "أكل",
  "tabs.addon": "إضافات",
  "search.label": "بحث",
  "search.placeholder": "ابحث بالاسم",
  "search.max": "أقصى سعر (جنيه)",
  "search.sort": "ترتيب حسب",
  "search.none": "مفيش منتجات مطابقة لبحثك.",
  "sort.default": "المميز",
  "sort.price-asc": "السعر: الأقل للأعلى",
  "sort.price-desc": "السعر: الأعلى للأقل",
  "sort.name": "الاسم أ إلى ي",
  "cart.title": "أكمل طلبك دلوقتي!",
  "cart.summary": "ملخص الطلب",
  "cart.empty": "السلة فاضية.",
  "cart.browse": "تصفح المنتجات",
  "cart.promo": "كود الخصم",
  "cart.apply": "تطبيق",
  "cart.subtotal": "المجموع الفرعي",
  "cart.tax": "الضريبة والرسوم",
  "cart.shipping": "الشحن",
  "cart.total": "الإجمالي",
  "fav.save": "♡ أضف للمفضلة",
  "fav.saved": "♥ في المفضلة",
  "lang.switch": "English",
} as const;

export type MessageKey = keyof typeof ar;

const getStored = (): Lang => {
  try {
    return localStorage.getItem(KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
};

let lang: Lang = getStored();
const listeners = new Set<() => void>();

const apply = () => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
};

export const initLang = apply;

export const setLang = (next: Lang) => {
  lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* ignore */
  }
  apply();
  listeners.forEach((l) => l());
};

export const useLang = (): Lang =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => lang
  );

/** Hook returning t(key, englishText). English text stays in the component; Arabic is looked up. */
export const useT = () => {
  const l = useLang();
  return (key: MessageKey, en: string) => (l === "ar" ? ar[key] : en);
};
