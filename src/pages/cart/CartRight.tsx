import OrderOptions from "../../components/OrderOptions";
import PaymentMethods from "./PaymentMethods";
import { PaymentMethod } from "../../types";

export interface CheckoutErrors {
  address: string;
  notes: string;
  time: string;
  method: string;
  cart: string;
}

interface CartRightProps {
  address: string;
  notes: string;
  onAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  method: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  onPay: () => void;
  payDisabled: boolean;
  errors: CheckoutErrors;
  addressRequired: boolean;
}

const inputClass = (invalid: boolean) =>
  `w-full bg-surface2 outline-none rounded-lg border px-3 py-2 ${
    invalid ? "border-red-500" : "border-line focus:border-accent"
  }`;

const CartRight = ({
  address,
  notes,
  onAddressChange,
  onNotesChange,
  method,
  onMethodChange,
  onPay,
  payDisabled,
  errors,
  addressRequired,
}: CartRightProps) => (
  <aside className="flex-1 flex gap-5 flex-col">
    <section className="flex gap-5 flex-col w-full">
      <header className="text-white flex text-xl lg:text-2xl font-extrabold text-center md:text-left items-center">
        <h3>Order options</h3>
      </header>
      <div className="rounded-2xl border border-line bg-surface p-5 lg:p-7">
        <OrderOptions timeError={errors.time} />
      </div>
    </section>
    <section className="flex gap-5 flex-col w-full">
      <header className="text-white flex text-xl lg:text-2xl font-extrabold text-center md:text-left items-center">
        <h3>Address details</h3>
      </header>
      <form
        onSubmit={(e) => e.preventDefault()}
        noValidate
        className="rounded-2xl border border-line bg-surface p-5 lg:p-7 flex flex-col gap-4"
      >
        <div>
          <label htmlFor="delivery-address" className="block mb-1">
            <b>Delivery</b> to {addressRequired ? "(required)" : "(optional for pickup and dine in)"}
          </label>
          <input
            id="delivery-address"
            type="text"
            autoComplete="street-address"
            placeholder="Street, building, area, city"
            value={address}
            maxLength={250}
            aria-invalid={!!errors.address || undefined}
            aria-describedby={errors.address ? "address-error" : undefined}
            onChange={(e) => onAddressChange(e.target.value)}
            className={inputClass(!!errors.address)}
          />
          {errors.address && (
            <p id="address-error" role="alert" className="text-red-500 mt-1">
              {errors.address}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="order-notes" className="block mb-1">
            Notes (optional)
          </label>
          <input
            id="order-notes"
            type="text"
            placeholder="For example: no sugar, ring the bell"
            value={notes}
            aria-invalid={!!errors.notes || undefined}
            onChange={(e) => onNotesChange(e.target.value)}
            className={inputClass(!!errors.notes)}
          />
          {errors.notes && (
            <p role="alert" className="text-red-500 mt-1">
              {errors.notes}
            </p>
          )}
        </div>
      </form>
    </section>
    <PaymentMethods
      method={method}
      onMethodChange={onMethodChange}
      onPay={onPay}
      disabled={payDisabled}
      error={errors.method || errors.cart}
    />
  </aside>
);

export default CartRight;
