import { Link } from "react-router-dom";
import { Footer } from "../components";
import { useAppSelector } from "../setup/hooks";
import { formatMoney } from "../utils/money";
import { lineTotal } from "../utils/pricing";

const DELIVERY = { "dine-in": "Dine in", delivery: "Door delivery", pickup: "Pickup" } as const;
const METHOD = { card: "Card", bank: "Bank account", cash: "Cash on delivery" } as const;

const History = () => {
  const orders = useAppSelector((s) => s.orders.orders);

  return (
    <>
      <section className="bg-history bg-cover bg-center pt-8">
        <article className="text-white flex py-6 md:py-12 font-medium flex-col justify-center items-center gap-4 global-px">
          <h1 className="text-3xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)] font-extrabold">
            Let′s see what you have bought!
          </h1>
          <p>{orders.length ? "Select an order to see its details" : "Your paid orders will show up here"}</p>
        </article>
      </section>
      <section className="global-px py-10 min-h-[40vh]">
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4">You haven't placed any orders yet.</p>
            <Link to="/products" className="bg-accent text-onAccent font-bold rounded-xl px-6 py-3">
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4 max-w-3xl mx-auto">
            {orders.map((o) => (
              <li key={o.id} data-testid="order" className="rounded-xl border border-line bg-surface">
                <details>
                  <summary className="cursor-pointer p-4 flex flex-wrap gap-x-6 gap-y-1 justify-between items-center">
                    <span className="font-bold">{o.number}</span>
                    <span className="text-muted">{new Date(o.createdAt).toLocaleString()}</span>
                    <span className="font-bold">{formatMoney(o.total)}</span>
                  </summary>
                  <div className="px-4 pb-4 flex flex-col gap-2 border-t border-line pt-3">
                    {o.items.map((i) => (
                      <div key={i.key} className="flex justify-between">
                        <span>
                          {i.quantity} × {i.title} ({i.size})
                        </span>
                        <span>{formatMoney(lineTotal(i))}</span>
                      </div>
                    ))}
                    <hr />
                    <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatMoney(o.subtotal)}</span></div>
                    {o.discount > 0 && (
                      <div className="flex justify-between text-sm"><span>Discount {o.promoCode ? `(${o.promoCode})` : ""}</span><span>-{formatMoney(o.discount)}</span></div>
                    )}
                    <div className="flex justify-between text-sm"><span>Tax & fees</span><span>{formatMoney(o.tax)}</span></div>
                    <div className="flex justify-between text-sm"><span>Shipping</span><span>{formatMoney(o.shipping)}</span></div>
                    <div className="flex justify-between font-bold"><span>Total</span><span>{formatMoney(o.total)}</span></div>
                    <p className="text-sm text-muted">
                      {DELIVERY[o.prefs.delivery]}
                      {o.prefs.when === "later" ? ` at ${o.prefs.time}` : ", now"} · Paid with {METHOD[o.method]} (demo)
                    </p>
                    {o.address && <p className="text-sm text-muted">Address: {o.address}</p>}
                    {o.notes && <p className="text-sm text-muted">Notes: {o.notes}</p>}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Footer />
    </>
  );
};

export default History;
