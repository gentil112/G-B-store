import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import Skeleton from "../components/Skeleton";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#fcfaf7] py-10 dark:bg-gray-950 sm:py-16">
      <div className="container px-3 sm:px-0">
        <header className="mx-auto mb-8 max-w-[600px] text-center sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
            OUR SHOP'S TOUCH
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            All products
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Explore every piece in our collection.
          </p>
        </header>

        {loading && (
          <div
            role="status"
            aria-label="Loading products"
            className="grid grid-cols-2 gap-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white p-3 shadow-[0_12px_35px_rgba(55,35,20,0.07)] dark:border-white/10 dark:bg-gray-900"
              >
                <Skeleton className="h-[150px] w-full rounded-[1rem] sm:h-[275px]" />
                <div className="space-y-2 px-1 pb-1 pt-3 sm:pt-4">
                  <Skeleton className="h-2 w-1/3 sm:h-3" />
                  <Skeleton className="h-4 w-3/4 sm:h-5" />
                  <div className="flex justify-between gap-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex justify-center py-10">
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-10 text-center text-gray-500 dark:text-gray-400">
            No products are available right now.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="group block overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white p-3 shadow-[0_12px_35px_rgba(55,35,20,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(55,35,20,0.14)] dark:border-white/10 dark:bg-gray-900"
              >
                <div className="overflow-hidden rounded-[1rem] bg-[#f2ece4] dark:bg-gray-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[150px] w-full object-cover transition duration-700 ease-out group-hover:scale-105 sm:h-[275px]"
                  />
                </div>
                <div className="px-1 pb-1 pt-2 sm:pt-4">
                  <p className="mb-1 text-[7px] font-bold uppercase tracking-[0.16em] text-gray-400 sm:mb-2 sm:text-[10px]">
                    {product.category}
                  </p>
                  <h2 className="truncate text-xs font-bold text-gray-900 dark:text-white sm:text-base">
                    {product.name}
                  </h2>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <p className="text-[8px] text-gray-500 dark:text-gray-400 sm:text-xs">
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of Stock"}
                    </p>
                    <span className="text-xs font-black text-gray-900 dark:text-white sm:text-sm">
                      {product.price.toLocaleString()} Rwf
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductsPage;
