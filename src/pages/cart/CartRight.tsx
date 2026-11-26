import PaymentMethods, { PaymentMethod } from "./PaymentMethods";

interface CartRightProps {
  address: string;
  notes: string;
  onAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  method: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  onPay: () => void;
  payDisabled: boolean;
  error: string;
}

const CartRight = ({
  address,
  notes,
  onAddressChange,
  onNotesChange,
  method,
  onMethodChange,
  onPay,
  payDisabled,
  error,
}: CartRightProps) => {
  return (
    <aside className="flex-1 flex gap-5 flex-col">
      <section className="flex gap-5 flex-col w-full">
        <header className="text-white flex text-xl lg:text-2xl font-extrabold text-center md:text-left items-center relative">
          <h3>Address details</h3>
        </header>
        <form className="rounded-xl bg-white p-5 lg:p-7 overflow-hidden">
          <div className="flex gap-1 mb-2 overflow-hidden">
            <label>
              <b>Delivery</b> to
            </label>
            <input
              type="text"
              id="delivery-address"
              aria-label="Delivery address"
              placeholder="Delivery address..."
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              className="bg-gray-50 outline-none flex-1"
            />
          </div>
          <hr />
          <div className="flex my-2">
            <input
              type="text"
              aria-label="Order notes"
              placeholder="Notes (optional)..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="bg-gray-50 outline-none flex-1"
            />
          </div>
        </form>
      </section>
      <PaymentMethods
        method={method}
        onMethodChange={onMethodChange}
        onPay={onPay}
        disabled={payDisabled}
        error={error}
      />
    </aside>
  );
};

export default CartRight;
