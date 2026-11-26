import { useAppDispatch, useAppSelector } from "../setup/hooks";
import { cartActions } from "../setup/cart-slice";
import { DeliveryMethod } from "../types";
import { SHOP_CLOSE, SHOP_OPEN } from "../utils/validation";

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
        <label htmlFor="order-time">Set Time</label>
        <input
          id="order-time"
          type="time"
          min={SHOP_OPEN}
          max={SHOP_CLOSE}
          value={prefs.time}
          disabled={prefs.when === "now"}
          aria-invalid={!!timeError || undefined}
          onChange={(e) => dispatch(cartActions.setPrefs({ time: e.target.value }))}
          className="ml-4 bg-[#BABABA59] px-8 rounded-lg font-bold py-2 disabled:opacity-50"
        />
        <p className="text-sm text-gray-500 mt-1">
          {prefs.when === "now"
            ? "Choose “No” to pick a later time."
            : `Open ${SHOP_OPEN} to ${SHOP_CLOSE}.`}
        </p>
        {timeError && (
          <p role="alert" className="text-red-500">
            {timeError}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderOptions;
