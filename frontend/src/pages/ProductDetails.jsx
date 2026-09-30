import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Skeleton from "../components/Skeleton";
import { API_BASE_URL } from "../config/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Product ID:", id);

        const response = await fetch(`${API_BASE_URL}/products/${id}`);

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        console.log("Product data:", data);

        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] px-4 py-10 dark:bg-gray-950 sm:py-20">
        <div
          role="status"
          aria-label="Loading product details"
          className="mx-auto max-w-6xl"
        >
          <Skeleton className="mb-8 h-4 w-32" />
          <div className="grid gap-8 rounded-3xl bg-white p-5 shadow-sm dark:bg-gray-900 md:grid-cols-2 md:p-8">
            <Skeleton className="h-[400px] w-full rounded-2xl md:h-[550px]" />
            <div className="flex flex-col justify-center space-y-5 py-4">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-10 w-4/5 sm:h-14" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-px w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="mt-2 h-5 w-1/2" />
              <Skeleton className="h-14 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg">{error}</p>

        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-gray-950 px-5 py-3 text-sm font-bold text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] px-4 py-10 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-sm font-semibold text-gray-600 transition hover:text-primary dark:text-gray-300"
        >
          ← Back to products
        </button>

        {/* Product container */}
        <div className="grid gap-8 rounded-3xl bg-white p-5 shadow-sm dark:bg-gray-900 md:grid-cols-2 md:p-8">
          {/* Product image */}
          <div className="overflow-hidden rounded-2xl bg-[#f2ece4] dark:bg-gray-800">
            <img
              src={product.image}
              alt={product.name}
              className="h-[400px] w-full object-cover md:h-[550px]"
            />
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-5xl">
              {product.name}
            </h1>

            {/* Price */}
            <p className="mt-5 text-2xl font-black text-gray-900 dark:text-white">
              {product.price.toLocaleString()} Rwf
            </p>

            {/* Divider */}
            <div className="my-6 h-px bg-gray-200 dark:bg-gray-700" />

            {/* Description */}
            <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Stock:{" "}
                <span className="font-normal">
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock"}
                </span>
              </p>
            </div>

            {/* Add to cart */}
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="mt-8 w-full rounded-full bg-gray-950 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {product.stock > 0 ? "Add to cart" : "Out of stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
