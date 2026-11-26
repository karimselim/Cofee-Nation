import { Footer } from "../../components";
import CartRight from "./CartRight";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../setup/hooks";
import CartProduct from "./CartProduct";

const money = (n: number) => `IDR ${n.toFixed(3)}`;

const YourCart = () => {
  const items = useAppSelector((state) => state.cart.items);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal * 0.05;
  const isEmpty = items.length === 0;

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
                  <p>{money(subtotal + tax + shipping)}</p>
                </div>
              </section>
            </aside>
            <CartRight />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default YourCart;
