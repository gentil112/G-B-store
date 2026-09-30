import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const orderData = {
        customer: formData,

        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),

        totalPrice,
      };

      console.log("Sending order:", orderData);

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      console.log("Order created:", data);

      clearCart();

      navigate("/order-confirmation", {
        state: {
          order: data.order,
        },
      });
    } catch (error) {
      console.error("Order error:", error);

      setError(
        error.message || "Something went wrong while placing your order.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (confirmedOrder) {
    const confirmationItems = confirmedOrder.items || [];
    const confirmationTotal = confirmedOrder.totalPrice || 0;

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfaf7] px-4 py-10 dark:bg-gray-950">
        <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.25)] dark:bg-gray-900 sm:p-10">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/30">
            ✓
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            ORDER CONFIRMED
          </p>

          <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
            Thank you, {confirmedOrder.customer?.name || "Customer"}!
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Your order has been placed successfully and is now being prepared
            for delivery.
          </p>

          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300">
            Order ID: <span className="font-bold">{confirmedOrder._id}</span>
          </div>

          <div className="mt-8 space-y-4">
            {confirmationItems.map((item) => (
              <div
                key={item._id || `${item.name}-${item.quantity}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />

                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Qty {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-bold text-gray-900 dark:text-white">
                  {(item.price * item.quantity).toLocaleString()} Rwf
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Total Paid
            </span>

            <span className="text-2xl font-black text-primary">
              {confirmationTotal.toLocaleString()} Rwf
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 w-full rounded-full bg-gray-950 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfaf7] px-4 dark:bg-gray-950">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Your cart is empty
        </h1>

        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Add some products before checking out.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-full bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] px-4 py-10 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            CHECKOUT
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white sm:text-5xl">
            Complete your order
          </h1>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 rounded-2xl bg-green-100 px-5 py-4 text-sm font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 px-5 py-4 text-sm font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Customer information */}
          <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900 sm:p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Customer Information
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Address */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your delivery address"
                  required
                  rows="4"
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gray-950 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900 sm:p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Your Order
            </h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity} × {item.price.toLocaleString()} Rwf
                    </p>
                  </div>

                  <p className="font-bold text-gray-900 dark:text-white">
                    {(item.price * item.quantity).toLocaleString()} Rwf
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-gray-200 dark:bg-gray-700" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Total
              </span>

              <span className="text-xl font-black text-primary">
                {totalPrice.toLocaleString()} Rwf
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
