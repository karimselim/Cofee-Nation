import { useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "../../i18n";
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
import { summarize, lineTotal } from "../../utils/pricing";
import { PromoCode, applyPromo, discountFor } from "../../utils/promo";
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
  const t = useT();
  const dispatch = useAppDispatch();
  const { user } = useUserAuth();

  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [errors, setErrors] = useState<CheckoutErrors>(noErrors);
  const [order, setOrder] = useState<Order | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const rawSubtotal = items.reduce((n, i) => n + lineTotal(i), 0);
  const discount = discountFor(promo, rawSubtotal);
  const totals = summarize(items, discount);
  const promoLost = !!promo && discount === 0 && rawSubtotal > 0;

  const submitPromo = () => {
    const res = applyPromo(promoInput, rawSubtotal, promo?.code ?? null);
    if (res.ok) {
      setPromo(res.promo);
      setPromoInput("");
      setPromoError("");
    } else {
      setPromoError(res.error);
    }
  };
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
      promoCode: promo && discount > 0 ? promo.code : undefined,
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
            {t("cart.title", "Checkout your item now!")}
          </h1>
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
            <aside className="flex flex-1 gap-5 w-full h-auto">
              <section className="rounded-lg bg-white p-5 lg:p-7 w-full flex-col">
                <header className="w-full text-center my-4 lg:my-6">
                  <h3 className="text-buttonColor font-bold text-lg lg:text-3xl">{t("cart.summary", "Order Summary")}</h3>
                </header>
                {isEmpty ? (
                  <div className="flex flex-col items-center gap-4 my-10 text-center">
                    <p className="text-lg">{t("cart.empty", "Your cart is empty.")}</p>
                    <Link
                      to="/products"
                      className="bg-buttonColor text-white font-bold rounded-xl px-6 py-3"
                    >
                      {t("cart.browse", "Browse products")}
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
                <div className="my-4">
                  <label htmlFor="promo-code" className="block mb-1">{t("cart.promo", "Promo code")}</label>
                  {promo ? (
                    <p className="flex items-center gap-3" data-testid="promo-applied">
                      <span>
                        <b>{promo.code}</b> applied ({promo.description})
                      </span>
                      <button
                        type="button"
                        className="underline text-buttonColor"
                        onClick={() => {
                          setPromo(null);
                          setPromoError("");
                        }}
                      >
                        Remove promo code
                      </button>
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        id="promo-code"
                        type="text"
                        maxLength={20}
                        value={promoInput}
                        placeholder="e.g. WELCOME10"
                        aria-invalid={!!promoError || undefined}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && submitPromo()}
                        className="flex-1 bg-gray-50 outline-none rounded-lg border border-gray-200 px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={submitPromo}
                        className="bg-buttonColor text-white font-bold rounded-lg px-4"
                      >
                        {t("cart.apply", "Apply")}
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p role="alert" className="text-red-500 mt-1">{promoError}</p>
                  )}
                  {promoLost && (
                    <p role="alert" className="text-red-500 mt-1">
                      {promo?.code} no longer applies to this cart.
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-full my-4">
                  <div className="flex uppercase lg:text-lg">
                    <p className="flex flex-[2_2_0]">{t("cart.subtotal", "subtotal")}</p>
                    <p className="flex flex-1 justify-end">{money(totals.subtotal)}</p>
                  </div>
                  {discount > 0 && (
                    <div className="flex uppercase lg:text-lg text-green-700" data-testid="promo-discount">
                      <p className="flex flex-[2_2_0]">Discount ({promo?.code})</p>
                      <p className="flex flex-1 justify-end">-{money(discount)}</p>
                    </div>
                  )}
                  <div className="flex uppercase lg:text-lg">
                    <p className="flex flex-[2_2_0]">{t("cart.tax", "TAX & FEES")}</p>
                    <p className="flex flex-1 justify-end">{money(totals.tax)}</p>
                  </div>
                  <div className="flex uppercase lg:text-lg">
                    <p className="flex flex-[2_2_0]">{t("cart.shipping", "shipping")}</p>
                    <p className="flex flex-1 justify-end">{money(totals.shipping)}</p>
                  </div>
                </div>
                <div className="flex uppercase lg:text-xl font-bold justify-between">
                  <p>{t("cart.total", "Total")}</p>
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
