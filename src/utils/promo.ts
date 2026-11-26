export interface PromoCode {
  code: string;
  description: string;
  percent?: number;
  amount?: number;
  minSubtotal?: number;
  expires?: string; // ISO date, last valid day
}

export const PROMO_CODES: PromoCode[] = [
  { code: "WELCOME10", description: "10% off", percent: 10 },
  { code: "COFFEE20", description: "20% off orders of 300 EGP or more", percent: 20, minSubtotal: 300 },
  { code: "SAVE50", description: "50 EGP off", amount: 50 },
  { code: "OLDDEAL", description: "Expired offer", percent: 15, expires: "2020-01-01" },
];

export type PromoResult =
  | { ok: true; promo: PromoCode; discount: number }
  | { ok: false; error: string };

export const applyPromo = (
  input: string,
  subtotal: number,
  alreadyApplied: string | null,
  today: Date = new Date()
): PromoResult => {
  const code = input.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a promo code." };
  if (!/^[A-Z0-9]{3,20}$/.test(code)) {
    return { ok: false, error: "Promo codes use only letters and numbers." };
  }
  if (alreadyApplied) {
    return { ok: false, error: `${alreadyApplied} is already applied. Remove it to use another code.` };
  }
  const promo = PROMO_CODES.find((p) => p.code === code);
  if (!promo) return { ok: false, error: "This promo code is not valid." };
  if (promo.expires && new Date(promo.expires + "T23:59:59") < today) {
    return { ok: false, error: "This promo code has expired." };
  }
  if (subtotal <= 0) return { ok: false, error: "Add something to your cart first." };
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return { ok: false, error: `This code needs a subtotal of at least ${promo.minSubtotal} EGP.` };
  }
  const raw = promo.percent ? Math.round((subtotal * promo.percent) / 100) : promo.amount ?? 0;
  return { ok: true, promo, discount: Math.min(raw, subtotal) };
};

/** Recompute a discount when the cart changes. Returns 0 if the code no longer applies. */
export const discountFor = (promo: PromoCode | null, subtotal: number): number => {
  if (!promo || subtotal <= 0) return 0;
  if (promo.minSubtotal && subtotal < promo.minSubtotal) return 0;
  const raw = promo.percent ? Math.round((subtotal * promo.percent) / 100) : promo.amount ?? 0;
  return Math.min(raw, subtotal);
};
