/** Shop currency. Prices in the data file are whole Egyptian pounds. */
export const CURRENCY = "EGP";

export const formatMoney = (amount: number): string =>
  `${CURRENCY} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
