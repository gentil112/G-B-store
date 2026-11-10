import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import Footer from "../components/Footer/Footer";

const MyOrdersPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const body = await response.text();
        let data;

        try {
          data = body ? JSON.parse(body) : {};
        } catch {
          const routeHint =
            response.status === 404
              ? " Confirm the backend is running the latest code and exposes /api/orders/my-orders."
              : " Confirm the backend URL is correct.";
          throw new Error(
            `The orders service returned an unexpected response (${response.status}).${routeHint}`,
          );
        }

        if (!response.ok)
          throw new Error(data.message || "Unable to load orders.");
        return data;
      })
      .then((data) => {
        if (active) setOrders(data.orders || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load orders.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] bg-[#f7f4ef] px-4 py-10 text-[#29241e] dark:bg-[#171511] dark:text-[#f3eee6] sm:py-16">
        <div className="mx-auto max-w-5xl">
          <header className="mb-9 flex flex-wrap items-end justify-between gap-5 border-b border-[#b99467]/25 pb-7 sm:mb-11 sm:pb-9">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs">
                <span className="h-px w-8 bg-current" aria-hidden="true" />
                G&amp;B / Your account
              </p>
              <h1 className="mt-3 font-serif text-4xl font-normal leading-none tracking-tight text-[#29241e] dark:text-[#f3eee6] sm:mt-4 sm:text-6xl">
                My Orders
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#71685e] dark:text-[#c4bbb0]">
                Track your purchases and revisit the pieces you chose.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="border border-[#b99467]/45 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#927650] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:border-[#c6a77d]/35 dark:text-[#e8d8c3] dark:hover:bg-[#c6a77d] dark:hover:text-[#29241e]"
            >
              Account details
            </button>
          </header>

          {loading ? (
            <div
              className="border-y border-[#b99467]/25 py-8 text-sm text-[#71685e] dark:border-white/10 dark:text-[#c4bbb0]"
              role="status"
            >
              Gathering your order history…
            </div>
          ) : error ? (
            <p
              className="border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : orders.length === 0 ? (
            <section className="border border-[#b99467]/25 bg-[#fffefa] px-6 py-14 text-center dark:border-white/10 dark:bg-[#211e1a] sm:py-20">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#927650] dark:text-[#c6a77d]">
                Your next favorite is out there
              </p>
              <h2 className="mt-4 font-serif text-3xl font-normal text-[#29241e] dark:text-[#f3eee6] sm:text-4xl">
                No orders just yet.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#71685e] dark:text-[#c4bbb0]">
                Once you find the pieces you love, your order history will be waiting here.
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
            <div className="mt-8 space-y-5">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="border border-[#b99467]/25 bg-[#fffefa] p-5 dark:border-white/10 dark:bg-[#211e1a] sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#b99467]/20 pb-5 dark:border-white/10">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#927650] dark:text-[#c6a77d]">
                        Order placed
                      </p>
                      <p className="mt-1 font-serif text-xl text-[#29241e] dark:text-[#f3eee6]">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="mt-1 break-all text-[10px] tracking-wide text-[#8c8173] dark:text-[#b8ad9f]">
                        ORDER #{order._id}
                      </p>
                    </div>
                    <span className="border border-[#b99467]/35 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#765b3c] dark:border-[#c6a77d]/30 dark:text-[#e2c6a2]">
                      {order.status}
                    </span>
                  </div>
                  <div className="divide-y divide-[#b99467]/15 dark:divide-white/10">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.productId || item.name}-${index}`}
                        className="flex items-center gap-4 py-4 first:pt-5"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-16 object-cover sm:h-24 sm:w-20"
                          />
                        ) : (
                          <div
                            role="img"
                            aria-label={`${item.name} image unavailable`}
                            className="h-20 w-16 bg-[#eee7dd] dark:bg-[#29251f] sm:h-24 sm:w-20"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-lg text-[#29241e] dark:text-[#f3eee6]">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-[#71685e] dark:text-[#c4bbb0]">
                            Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm tabular-nums text-[#29241e] dark:text-[#f3eee6]">
                          {(item.price * item.quantity).toLocaleString()} Rwf
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between border-t border-[#b99467]/20 pt-5 dark:border-white/10">
                    <span className="font-serif text-xl text-[#29241e] dark:text-[#f3eee6]">
                      Total
                    </span>
                    <span className="font-serif text-xl text-[#765b3c] dark:text-[#e2c6a2]">
                      {order.totalPrice.toLocaleString()} Rwf
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyOrdersPage;
