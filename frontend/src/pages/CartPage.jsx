import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/navbar/Navbar";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] bg-[#f7f4ef] px-4 py-10 text-[#29241e] dark:bg-[#171511] dark:text-[#f3eee6] sm:py-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5 border-b border-[#b99467]/25 pb-7 sm:mb-11 sm:pb-9">
            <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              G&amp;B / Your selection
            </p>
            <h1 className="mt-3 font-serif text-4xl font-normal leading-none tracking-tight text-[#29241e] dark:text-[#f3eee6] sm:mt-4 sm:text-6xl">
              My Cart
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#71685e] dark:text-[#c4bbb0]">
              Considered pieces, set aside for you.
            </p>
            </div>
            {cartItems.length > 0 && (
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8c8173] dark:text-[#b8ad9f]">
                {totalItems} {totalItems === 1 ? "piece" : "pieces"}
              </p>
            )}
          </div>

          {cartItems.length === 0 ? (
            <section className="border border-[#b99467]/25 bg-[#fffefa] px-6 py-14 text-center dark:border-white/10 dark:bg-[#211e1a] sm:py-20">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#927650] dark:text-[#c6a77d]">
                A little room for something special
              </p>
              <h2 className="mt-4 font-serif text-3xl font-normal text-[#29241e] dark:text-[#f3eee6] sm:text-4xl">
                Your cart is waiting.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71685e] dark:text-[#c4bbb0]">
                Add some products to your cart to see them here.
              </p>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-8 bg-[#29241e] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#514332] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:bg-[#eee7dc] dark:text-[#29241e] dark:hover:bg-white"
              >
                Explore the collection
              </button>
            </section>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
              <div className="divide-y divide-[#b99467]/25 border-y border-[#b99467]/25 dark:divide-white/10 dark:border-white/10">
                {cartItems.map((item) => (
                  <article
                    key={item._id}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:py-6"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-40 w-full object-cover sm:h-32 sm:w-28"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`${item.name} image unavailable`}
                        className="h-40 w-full bg-[#eee7dd] dark:bg-[#29251f] sm:h-32 sm:w-28"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      {item.category && (
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#927650] dark:text-[#c6a77d]">
                          {item.category}
                        </p>
                      )}
                      <h2 className="mt-1 font-serif text-xl font-normal text-[#29241e] dark:text-[#f3eee6] sm:text-2xl">
                        {item.name}
                      </h2>
                      <p className="mt-2 text-sm text-[#71685e] dark:text-[#c4bbb0]">
                        {item.price.toLocaleString()} Rwf
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item._id)}
                        aria-label={`Decrease ${item.name} quantity`}
                        className="flex h-9 w-9 items-center justify-center border border-[#b99467]/35 text-lg text-[#514332] transition hover:border-[#927650] hover:text-[#927650] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:border-white/15 dark:text-[#f3eee6]"
                      >
                        -
                      </button>
                      <span
                        className="flex h-9 min-w-9 items-center justify-center px-2 text-sm tabular-nums text-[#29241e] dark:text-[#f3eee6]"
                        aria-label={`Quantity: ${item.quantity}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item._id)}
                        disabled={item.quantity >= (Number(item.stock) || 0)}
                        aria-label={`Increase ${item.name} quantity`}
                        className="flex h-9 w-9 items-center justify-center border border-[#b99467]/35 text-lg text-[#514332] transition hover:border-[#927650] hover:text-[#927650] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-[#f3eee6]"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="ml-1 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8c8173] transition-colors hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="font-serif text-lg text-[#29241e] dark:text-[#f3eee6] sm:min-w-28 sm:text-right">
                      {(item.price * item.quantity).toLocaleString()} Rwf
                    </p>
                  </article>
                ))}
              </div>

              <section className="border border-[#b99467]/25 bg-[#fffefa] p-6 dark:border-white/10 dark:bg-[#211e1a] lg:sticky lg:top-8">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#927650] dark:text-[#c6a77d]">
                    Your selection
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-normal text-[#29241e] dark:text-[#f3eee6]">
                    Order Summary
                  </h2>
                  <div className="mt-6 space-y-4 border-t border-[#b99467]/20 pt-5 dark:border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#71685e] dark:text-[#c4bbb0]">
                        Items
                      </span>
                      <span className="tabular-nums text-[#29241e] dark:text-[#f3eee6]">
                        {totalItems}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#71685e] dark:text-[#c4bbb0]">
                        Subtotal
                      </span>
                      <span className="tabular-nums text-[#29241e] dark:text-[#f3eee6]">
                        {totalPrice.toLocaleString()} Rwf
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#b99467]/20 pt-4 dark:border-white/10">
                      <span className="font-serif text-xl text-[#29241e] dark:text-[#f3eee6]">
                        Total
                      </span>
                      <span className="font-serif text-xl text-[#765b3c] dark:text-[#e2c6a2]">
                        {totalPrice.toLocaleString()} Rwf
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    className="mt-7 w-full bg-[#29241e] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#514332] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:bg-[#eee7dc] dark:text-[#29241e] dark:hover:bg-white"
                  >
                    Continue to checkout
                  </button>
                  <p className="mt-4 text-center text-[9px] uppercase tracking-[0.14em] text-[#8c8173] dark:text-[#b8ad9f]">
                    Delivery details at checkout
                  </p>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CartPage;
