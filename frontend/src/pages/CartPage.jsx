import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-[#fcfaf7] px-4 py-10 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Page title */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            YOUR SHOPPING CART
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white sm:text-5xl">
            My Cart
          </h1>
        </div>

        {/* Empty cart */}
        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm dark:bg-gray-900">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Your cart is empty.
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add some products to your cart to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart items */}
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900 sm:flex-row sm:items-center"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-full rounded-2xl object-cover sm:h-28 sm:w-28"
                />

                {/* Product information */}
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {item.category}
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.price.toLocaleString()} Rwf
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  {/* Minus button */}
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xl font-bold text-gray-900 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    -
                  </button>

                  {/* Quantity */}
                  <span className="flex h-10 min-w-10 items-center justify-center rounded-lg bg-gray-100 px-3 text-base font-bold text-gray-900 dark:bg-gray-800 dark:text-white">
                    {item.quantity}
                  </span>

                  {/* Plus button */}
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xl font-bold text-gray-900 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                </div>

                {/* Price */}
                <p className="text-lg font-black text-gray-900 dark:text-white">
                  {(item.price * item.quantity).toLocaleString()} Rwf
                </p>
              </div>
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Items
                  </span>

                  <span className="font-semibold text-gray-900 dark:text-white">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900 dark:text-white">
                    {totalPrice.toLocaleString()} Rwf
                  </span>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total
                  </span>

                  <span className="text-xl font-black text-primary">
                    {totalPrice.toLocaleString()} Rwf
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-full bg-gray-950 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
