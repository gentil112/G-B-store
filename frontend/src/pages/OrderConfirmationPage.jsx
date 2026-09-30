import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the order sent from CheckoutPage
  const order = location.state?.order;

  // If someone visits this page without an order
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-900">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            No Order Found
          </h1>

          <p className="mb-6 text-gray-600 dark:text-gray-300">
            We couldn't find your order information.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl dark:bg-green-900/30">
            ✅
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Order Placed Successfully!
        </h1>

        <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
          Thank you for your order. We have received your request.
        </p>

        {/* Order information */}
        <div className="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-300">Order ID</span>

            <span className="break-all text-right font-semibold text-gray-900 dark:text-white">
              {order._id}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Customer</span>

            <span className="font-semibold text-gray-900 dark:text-white">
              {order.customer.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total</span>

            <span className="font-bold text-primary">
              {order.totalPrice.toLocaleString()} Rwf
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Status</span>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
              {order.status}
            </span>
          </div>
        </div>

        {/* Ordered products */}
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Your Items
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-700"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900 dark:text-white">
                  {(item.price * item.quantity).toLocaleString()} Rwf
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue shopping */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 w-full rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
