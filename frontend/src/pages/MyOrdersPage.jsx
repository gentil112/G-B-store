import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

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
      <main className="min-h-screen bg-[#fcfaf7] px-4 py-10 dark:bg-gray-950 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            ACCOUNT
          </p>
          <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your purchases and review order details.
          </p>

          {loading ? (
            <p className="mt-8 text-gray-600 dark:text-gray-300" role="status">
              Loading your orders…
            </p>
          ) : error ? (
            <p
              className="mt-8 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950/40 dark:text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : orders.length === 0 ? (
            <section className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                No orders yet
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your completed purchases will appear here.
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 rounded-full bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-primary"
              >
                Start shopping
              </button>
            </section>
          ) : (
            <div className="mt-8 space-y-5">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-3xl bg-white p-5 shadow-sm dark:bg-gray-900 sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Order placed{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-gray-900 dark:text-white">
                        Order #{order._id}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold capitalize text-primary">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.productId || item.name}-${index}`}
                        className="flex items-center gap-4"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {(item.price * item.quantity).toLocaleString()} Rwf
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex justify-between border-t border-gray-200 pt-4 font-bold dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total
                    </span>
                    <span className="text-primary">
                      {order.totalPrice.toLocaleString()} Rwf
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MyOrdersPage;
