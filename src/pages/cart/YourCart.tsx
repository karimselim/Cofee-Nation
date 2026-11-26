import { Footer } from "../../components";
import CartRight from "./CartRight";
import { formatMoney } from "../../utils/money";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../setup/hooks";
import { cartActions } from "../../setup/cart-slice";
import { PaymentMethod } from "./PaymentMethods";
import CartProduct from "./CartProduct";

const money = formatMoney;

interface Order {
  number: string;
  total: number;
  count: number;
  address: string;
  method: PaymentMethod;
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  card: "Card",
  bank: "Bank account",
  cash: "Cash on delivery",
};

const YourCart = () => {
  const items = useAppSelector((state) => state.cart.items);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal * 0.05;
  const isEmpty = items.length === 0;
  const total = subtotal + tax + shipping;

  const dispatch = useAppDispatch();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const payHandler = () => {
    if (isEmpty) return setError("Your cart is empty.");
    if (!address.trim()) return setError("Please enter a delivery address.");
    if (!method) return setError("Please choose a payment method.");
    // Demo checkout: no real payment is taken, the order is only confirmed here.
    setOrder({
      number: `CN-${Date.now().toString().slice(-6)}`,
      total,
      count: items.reduce((n, i) => n + i.quantity, 0),
      address: address.trim(),
      method,
    });
    dispatch(cartActions.clear());
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (order) {
    return (
      <>
        <div className="bg-cover bg-center bg-cart">
          <section className="global-px py-16">
            <div
              role="status"
              className="rounded-lg bg-white p-8 max-w-xl mx-auto text-center flex flex-col gap-4"
            >
              <h1 className="text-buttonColor font-bold text-2xl lg:text-3xl">
                Order confirmed
              </h1>
              <p>Thank you! Your order number is</p>
              <p className="font-extrabold text-xl" data-testid="order-number">
                {order.number}
              </p>
              <p>
                {order.count} item{order.count === 1 ? "" : "s"} · Total{" "}
                <b>{money(order.total)}</b> · {METHOD_LABEL[order.method]}
              </p>
              <p>Delivering to: {order.address}</p>
              <p className="text-sm text-gray-500">
                This is a demo shop. No payment was taken.
              </p>
              <Link
                to="/products"
                className="bg-buttonColor text-white font-bold rounded-xl px-6 py-3 mx-auto"
              >
                Keep shopping
              </Link>
            </div>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="bg-cover bg-center bg-cart">
        <section className="global-px space-y-3 py-10">
          <h1 className="text-white text-2xl md:text-3xl text-center md:text-left font-extrabold ">
            Checkout your item now!
          </h1>
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
            <aside className="flex flex-1 gap-5 w-full h-auto">
              <section className="rounded-lg bg-white p-5 lg:p-7 w-full flex-col">
                <header className="w-full text-center my-4 lg:my-6">
                  <h3 className="text-buttonColor font-bold text-lg lg:text-3xl">
                    Order Summary
                  </h3>
                </header>
                {isEmpty ? (
                  <div className="flex flex-col items-center gap-4 my-10 text-center">
                    <p className="text-lg">Your cart is empty.</p>
                    <Link
                      to="/products"
                      className="bg-buttonColor text-white font-bold rounded-xl px-6 py-3"
                    >
                      Browse products
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 mt-10 mb-6">
                    {items.map((item) => (
                      <CartProduct key={item.key} item={item} />
                    ))}
                  </div>
                )}
                <hr />
                <div className="flex flex-col w-full my-4">
                  <div className="flex uppercase lg:text-lg">
                    <p className="flex flex-[2_2_0]">subtotal</p>
                    <p className="flex flex-1 justify-end">
                      {money(subtotal)}
                    </p>
                  </div>
                  <div className="flex uppercase lg:text-lg">
                    <p className="flex flex-[2_2_0]">TAX & FEES</p>
                    <p className="flex flex-1 justify-end">{money(tax)}</p>
                  </div>
                  <div className="flex uppercase lg:text-lg">
                    <p className="flex flex-[2_2_0]">shipping</p>
                    <p className="flex flex-1 justify-end">{money(shipping)}</p>
                  </div>
                </div>
                <div className="flex uppercase lg:text-xl font-bold justify-between">
                  <p>Total</p>
                  <p>{money(total)}</p>
                </div>
              </section>
            </aside>
            <CartRight
              address={address}
              notes={notes}
              onAddressChange={(v) => {
                setAddress(v);
                setError("");
              }}
              onNotesChange={setNotes}
              method={method}
              onMethodChange={(m) => {
                setMethod(m);
                setError("");
              }}
              onPay={payHandler}
              payDisabled={isEmpty}
              error={error}
            />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default YourCart;
