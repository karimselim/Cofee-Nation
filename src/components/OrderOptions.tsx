import { useAppDispatch, useAppSelector } from "../setup/hooks";
import { cartActions } from "../setup/cart-slice";
import { DeliveryMethod } from "../types";
import { SHOP_CLOSE, SHOP_OPEN, validateTime } from "../utils/validation";

const METHODS: { value: DeliveryMethod; label: string }[] = [
  { value: "dine-in", label: "Dine In" },
  { value: "delivery", label: "Door Delivery" },
  { value: "pickup", label: "Pickup" },
];

const choice = (active: boolean) =>
  `text-start rounded-lg p-2 flex items-center font-bold ${
    active ? "bg-buttonColor text-white" : "text-gray-500 bg-[#BABABA59] hover:text-gray-600 hover:bg-gray-100"
  }`;

/** Delivery method and time. Shared by the product page and the cart. */
const OrderOptions = ({ timeError = "" }: { timeError?: string }) => {
  const prefs = useAppSelector((s) => s.cart.prefs);
  const dispatch = useAppDispatch();
  // Check as the user types, once a full HH:MM is entered, so 06:00 is refused straight away.
  const live = prefs.when === "later" && prefs.time.length === 5 ? validateTime(prefs.time) : "";
  const shownError = timeError || live;

  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold text-left text-lg">Delivery and Time</p>
      <div role="group" aria-label="Delivery method" className="flex gap-2 w-full">
        {METHODS.map((m) => (
          <button
            key={m.value}
            type="button"
            aria-pressed={prefs.delivery === m.value}
            onClick={() => dispatch(cartActions.setPrefs({ delivery: m.value }))}
            className={choice(prefs.delivery === m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex items-center" role="group" aria-label="When">
        <p className="mr-10">Now</p>
        <div className="flex gap-4">
          <button
            type="button"
            aria-pressed={prefs.when === "now"}
            onClick={() => dispatch(cartActions.setPrefs({ when: "now" }))}
            className={`${choice(prefs.when === "now")} px-7 py-2`}
          >
            Yes
          </button>
          <button
            type="button"
            aria-pressed={prefs.when === "later"}
            onClick={() => dispatch(cartActions.setPrefs({ when: "later" }))}
            className={`${choice(prefs.when === "later")} px-7 py-2`}
          >
            No
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="order-time" className="block">Set Time</label>
        <input
          id="order-time"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="HH:MM, e.g. 15:30"
          maxLength={5}
          value={prefs.time}
          disabled={prefs.when === "now"}
          aria-invalid={!!shownError || undefined}
          aria-describedby={shownError ? "order-time-error" : undefined}
          onChange={(e) => {
            let v = e.target.value.replace(/[^0-9:]/g, "");
            if (/^\d{2}$/.test(v) && e.target.value.length > prefs.time.length) v += ":";
            dispatch(cartActions.setPrefs({ time: v }));
          }}
          className={`mt-2 block w-40 bg-gray-50 rounded-lg border px-3 h-11 font-bold outline-none text-buttonColor disabled:opacity-50 ${
            shownError ? "border-red-500" : "border-gray-200 hover:border-buttonColor focus:border-buttonColor"
          }`}
        />
        <p className="text-sm text-gray-500 mt-1">
          {prefs.when === "now"
            ? "Choose “No” to pick a later time."
            : `Open ${SHOP_OPEN} to ${SHOP_CLOSE}.`}
        </p>
        {shownError && (
          <p id="order-time-error" role="alert" className="text-red-500">
            {shownError}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderOptions;
