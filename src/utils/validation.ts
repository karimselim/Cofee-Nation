export type FieldError = string | "";

export const validateEmail = (email: string): FieldError => {
  const value = email.trim();
  if (!value) return "Please enter your email address.";
  if (value.length > 254) return "That email address is too long.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    return "That doesn't look like an email address. Use the form name@example.com.";
  }
  return "";
};

export const validateLoginPassword = (password: string): FieldError =>
  password ? "" : "Please enter your password.";

export const validateNewPassword = (password: string): FieldError => {
  if (!password) return "Please choose a password.";
  if (password.length < 8) return "Your password must be at least 8 characters long.";
  if (password.length > 128) return "Your password can be 128 characters at most.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Your password must contain at least one letter and one number.";
  }
  return "";
};

/** Optional phone number: digits with an optional leading +, 8 to 15 digits. */
export const validatePhone = (phone: string): FieldError => {
  const value = phone.replace(/[\s-]/g, "");
  if (!value) return "";
  if (!/^\+?\d{8,15}$/.test(value)) {
    return "Enter a valid phone number (8 to 15 digits, for example 01012345678).";
  }
  return "";
};

export const validateAddress = (address: string): FieldError => {
  const value = address.trim();
  if (!value) return "Please enter your delivery address.";
  if (value.length < 10) return "The address is too short. Add street, building and area.";
  if (value.length > 200) return "The address is too long (200 characters at most).";
  if (!/[A-Za-z\u0600-\u06FF]/.test(value)) return "The address must contain letters, not only numbers.";
  return "";
};

export const validateNotes = (notes: string): FieldError =>
  notes.length > 200 ? "Notes can be 200 characters at most." : "";

export const SHOP_OPEN = "09:00";
export const SHOP_CLOSE = "22:00";

export const validateTime = (time: string): FieldError => {
  if (!time) return "Please choose the time you want your order.";
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return "Enter a real time like 14:30.";
  if (time < SHOP_OPEN || time > SHOP_CLOSE) {
    return `We are open from ${SHOP_OPEN} to ${SHOP_CLOSE}. Pick a time in that range.`;
  }
  return "";
};
