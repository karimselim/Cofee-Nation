// Business rules exposed over REST. These mirror src/utils/pricing.ts, promo.ts and validation.ts.
const { round, unitPrice, products } = require("./catalog");

const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 22 * 60;
const SHOP_OPEN = "09:00";
const SHOP_CLOSE = "22:00";
const TAX_RATE = 0.1;
const SHIPPING_RATE = 0.05;

const PROMOS = {
  WELCOME10: { percent: 10, description: "10% off" },
  COFFEE20: { percent: 20, minSubtotal: 300, description: "20% off orders of 300 EGP or more" },
  SAVE50: { amount: 50, description: "50 EGP off" },
  OLDDEAL: { percent: 15, expires: "2020-01-01", description: "Expired offer" },
};

const toMinutes = (value) => {
  if (typeof value !== "string") return null;
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
};

const validateTime = (value) => {
  if (!value) return "Please choose the time you want your order.";
  const minutes = toMinutes(String(value));
  if (minutes === null) return "Enter a real time like 14:30.";
  if (minutes < OPEN_MINUTES || minutes > CLOSE_MINUTES) {
    return `We are open from ${SHOP_OPEN} to ${SHOP_CLOSE}. Pick a time in that range.`;
  }
  return "";
};

const validateAddress = (value) => {
  const text = (value || "").trim();
  if (!text) return "Please enter your delivery address.";
  if (text.length < 10) return "The address is too short. Add street, building and area.";
  if (text.length > 200) return "The address is too long (200 characters at most).";
  if (!/[A-Za-z\u0600-\u06FF]/.test(text)) return "The address must contain letters, not only numbers.";
  return "";
};

const validateNotes = (value) =>
  (value || "").length > 200 ? "Notes can be 200 characters at most." : "";

const findProduct = (productId) => {
  const [category, id] = String(productId).split("-");
  return products.find((p) => p.category === category && String(p.id) === id) || null;
};

const priceCart = (items = []) => {
  const lines = items.map((item) => {
    const product = findProduct(item.productId);
    if (!product) return { error: `Unknown product: ${item.productId}` };
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { error: `Quantity must be a whole number of 1 or more for ${item.productId}` };
    }
    const size = item.size || "R";
    if (!["R", "L", "XL"].includes(size)) return { error: `Unknown size: ${size}` };
    const unit = unitPrice(product, size);
    return {
      key: `${item.productId}-${size}`,
      productId: item.productId,
      title: product.title,
      size,
      quantity,
      unit,
      total: unit * quantity,
    };
  });

  const failed = lines.find((line) => line.error);
  if (failed) return { error: failed.error };

  const subtotal = round(lines.reduce((sum, line) => sum + line.total, 0));
  return { lines, subtotal };
};

/** Applies tax and shipping to the amount that is left after a discount, like summarize() in the app. */
const totalsFor = (subtotal, discount = 0) => {
  const taxable = Math.max(0, subtotal - discount);
  const tax = round(taxable * TAX_RATE);
  const shipping = round(taxable * SHIPPING_RATE);
  return {
    subtotal,
    discount,
    tax,
    shipping,
    total: round(taxable + tax + shipping),
  };
};

const applyPromo = (code, subtotal, today = new Date()) => {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return { ok: false, error: "Enter a promo code." };
  if (!/^[A-Z0-9]{3,20}$/.test(normalized)) {
    return { ok: false, error: "Promo codes use only letters and numbers." };
  }
  const promo = PROMOS[normalized];
  if (!promo) return { ok: false, error: "This promo code is not valid." };
  if (promo.expires && new Date(`${promo.expires}T23:59:59`) < today) {
    return { ok: false, error: "This promo code has expired." };
  }
  if (subtotal <= 0) return { ok: false, error: "Add something to your cart first." };
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return {
      ok: false,
      error: `This code needs a subtotal of at least ${promo.minSubtotal} EGP.`,
    };
  }
  const raw = promo.percent ? Math.round((subtotal * promo.percent) / 100) : promo.amount ?? 0;
  return {
    ok: true,
    code: normalized,
    description: promo.description,
    discount: Math.min(raw, subtotal),
  };
};

const checkout = (body = {}) => {
  const errors = {};
  const items = Array.isArray(body.items) ? body.items : [];

  if (items.length === 0) {
    errors.cart = "Your cart is empty. Add something before paying.";
  } else {
    const priced = priceCart(items);
    if (priced.error) errors.items = priced.error;
  }

  const delivery = body.delivery || "pickup";
  if (!["dine-in", "delivery", "pickup"].includes(delivery)) {
    errors.delivery = "Choose dine in, delivery or pickup.";
  }
  if (delivery === "delivery") {
    const addressError = validateAddress(body.address);
    if (addressError) errors.address = addressError;
  }
  const notesError = validateNotes(body.notes);
  if (notesError) errors.notes = notesError;

  const when = body.when || "now";
  if (!["now", "later"].includes(when)) errors.when = "Choose now or a later time.";
  if (when === "later") {
    const timeError = validateTime(body.time);
    if (timeError) errors.time = timeError;
  }

  if (!["card", "bank", "cash"].includes(body.method)) {
    errors.method = "Please choose a payment method.";
  }

  if (Object.keys(errors).length > 0) return { status: 400, body: { errors } };

  const priced = priceCart(items);
  let discount = 0;
  let promoCode;
  if (body.promo) {
    const promo = applyPromo(body.promo, priced.subtotal);
    if (!promo.ok) return { status: 400, body: { errors: { promo: promo.error } } };
    discount = promo.discount;
    promoCode = promo.code;
  }

  return {
    status: 201,
    body: {
      order: {
        number: `CN-${String(Date.now()).slice(-6)}`,
        items: priced.lines,
        ...totalsFor(priced.subtotal, discount),
        promoCode,
        delivery,
        when,
        time: when === "later" ? body.time : undefined,
        method: body.method,
      },
    },
  };
};

module.exports = {
  round,
  SHOP_OPEN,
  SHOP_CLOSE,
  TAX_RATE,
  SHIPPING_RATE,
  PROMOS,
  toMinutes,
  validateTime,
  validateAddress,
  validateNotes,
  priceCart,
  totalsFor,
  applyPromo,
  checkout,
};
