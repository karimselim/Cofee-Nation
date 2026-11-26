import { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../../components";
import CartRight, { CheckoutErrors } from "./CartRight";
import CartProduct from "./CartProduct";
import { useAppDispatch, useAppSelector } from "../../setup/hooks";
import { cartActions } from "../../setup/cart-slice";
import { ordersActions } from "../../setup/orders-slice";
import { notificationsActions } from "../../setup/notifications-slice";
import { useUserAuth } from "../../setup/context/user-auth-context";
import { Order, PaymentMethod } from "../../types";
import { formatMoney } from "../../utils/money";
import { summarize } from "../../utils/pricing";
import { validateAddress, validateNotes, validateTime } from "../../utils/validation";

const money = formatMoney;

const METHOD_LABEL: Record<PaymentMethod, string> = {
  card: "Card",
  bank: "Bank account",
  cash: "Cash on delivery",
};

const DELIVERY_LABEL = { "dine-in": "Dine in", delivery: "Door delivery", pickup: "Pickup" } as const;

const noErrors: CheckoutErrors = { address: "", notes: "", time: "", method: "", cart: "" };

const YourCart = () => {
  const items = useAppSelector((state) => state.cart.items);
  const prefs = useAppSelector((state) => state.cart.prefs);
  const dispatch = useAppDispatch();
  const { user } = useUserAuth();

  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [errors, setErrors] = useState<CheckoutErrors>(noErrors);
  const [order, setOrder] = useState<Order | null>(null);

  const totals = summarize(items);
  const isEmpty = items.length === 0;
  const addressRequired = prefs.delivery === "delivery";

  const clearError = (field: keyof CheckoutErrors) =>
    setErrors((e) => ({ ...e, [field]: "", cart: "" }));

  const payHandler = () => {
    const next: CheckoutErrors = {
      cart: isEmpty ? "Your cart is empty. Add something before paying." : "",
      address: addressRequired || address.trim() ? validateAddress(address) : "",
      notes: validateNotes(notes),
      time: prefs.when === "later" ? validateTime(prefs.time) : "",
      method: method ? "" : "Please choose a payment method.",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    const number = `CN-${Date.now().toString().slice(-6)}`;
    const placed: Order = {
      id: `${Date.now()}`,
      number,
      createdAt: new Date().toISOString(),
      items,
      ...totals,
      address: address.trim(),
      notes: notes.trim(),
      method: method as PaymentMethod,
      prefs,
    };
    // Demo checkout: no real payment is taken, the order is only confirmed here.
    setOrder(placed);
    if (user) {
      dispatch(ordersActions.add(placed));
      dispatch(
        notificationsActions.add({
          title: `Order ${number} confirmed`,
          body: `We received your order (${money(placed.total)}). You can see it in History.`,
        })
      );
    } else {
      dispatch(
        notificationsActions.flash({
          title: `Order ${number} confirmed`,
          body: "Log in next time to keep your orders in History.",
        })
      );
    }
    dispatch(cartActions.clear());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (order) {
    const count = order.items.reduce((n, i) => n + i.quantity, 0);
    return (
      <>
        <div className="bg-cover bg-center bg-cart">
          <section className="global-px py-16">
            <div
              role="status"
              className="rounded-lg bg-white p-8 max-w-xl mx-auto text-center flex flex-col gap-4"
            >
              <h1 className="text-buttonColor font-bold text-2xl lg:text-3xl">Order confirmed</h1>
              <p>Thank you! Your order number is</p>
              <p className="font-extrabold text-xl" data-testid="order-number">
                {order.number}
              </p>
              <p>
                {count} item{count === 1 ? "" : "s"} · Total <b>{money(order.total)}</b> ·{" "}
                {METHOD_LABEL[order.method]}
              </p>
              <p>
                {DELIVERY_LABEL[order.prefs.delivery]}
                {order.prefs.when === "later" ? ` at ${order.prefs.time}` : ", now"}
              </p>
              {order.address && <p>Delivering to: {order.address}</p>}
              <p className="text-sm text-gray-500">This is a demo shop. No payment was taken.</p>
              {user ? (
                <Link to="/history" className="underline text-buttonColor font-semibold">
                  See it in your order history
                </Link>
              ) : (
                <p className="text-sm">
                  <Link to="/auth/login" className="underline text-buttonColor font-semibold">
                    Log in
                  </Link>{" "}
                  to keep your orders in your history.
                </p>
              )}
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
                  <h3 className="text-buttonColor font-bold text-lg lg:text-3xl">Order Summary</h3>
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
                    <p className="flex flex-1 justify-end">{money(totals.subtotal)}</p>
                  </div>
                  <div className="flex uppercase lg:text-lg">
                    <p className="flex flex-[2_2_0]">TAX & FEES</p>
                    <p className="flex flex-1 justify-end">{money(totals.tax)}</p>
                  </div>
                  <div className="flex uppercase lg:text-lg">
                    <p className="flex flex-[2_2_0]">shipping</p>
                    <p className="flex flex-1 justify-end">{money(totals.shipping)}</p>
                  </div>
                </div>
                <div className="flex uppercase lg:text-xl font-bold justify-between">
                  <p>Total</p>
                  <p data-testid="cart-total">{money(totals.total)}</p>
                </div>
              </section>
            </aside>
            <CartRight
              address={address}
              notes={notes}
              onAddressChange={(v) => {
                setAddress(v);
                clearError("address");
              }}
              onNotesChange={(v) => {
                setNotes(v);
                clearError("notes");
              }}
              method={method}
              onMethodChange={(m) => {
                setMethod(m);
                clearError("method");
              }}
              onPay={payHandler}
              payDisabled={false}
              errors={errors}
              addressRequired={addressRequired}
            />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default YourCart;
