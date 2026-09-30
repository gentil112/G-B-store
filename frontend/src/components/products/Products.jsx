import React, { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Skeleton from "../Skeleton";
import { API_BASE_URL } from "../../config/api";
import "aos/dist/aos.css";

const Products = () => {
  // Store products received from the backend
  const [products, setProducts] = useState([]);

  // Store loading state
  const [loading, setLoading] = useState(true);

  // Store error message
  const [error, setError] = useState("");

  // Get products from our Express backend
  useEffect(() => {
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
    <div id="products" className="bg-[#fcfaf7] py-10 sm:py-20 dark:bg-gray-950">
      <div className="container px-3 sm:px-0">
        {/* Header section */}
        <div className="text-center mb-5 sm:mb-10 max-w-[600px] mx-auto">
          <p
            data-aos="fade-up"
            className="text-xs font-bold uppercase tracking-[0.28em] text-primary"
          >
            OUR SHOP'S TOUCH
          </p>

          <h1
            data-aos="fade-up"
            className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl"
          >
            Our products
          </h1>

          <p
            data-aos="fade-up"
            className="mt-2 sm:mt-4 text-xs sm:text-sm leading-6 text-gray-500 dark:text-gray-400"
          >
            T-shirt, pants and hoodie
          </p>
        </div>

        {/* Body section */}
        <div>
          {/* Product skeletons */}
          {loading && (
            <div
              role="status"
              aria-label="Loading products"
              className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-5"
            >
              {Array.from({ length: 5 }, (_, index) => (
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

          {/* Error message */}
          {error && (
            <div className="flex justify-center py-10">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Products */}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-5">
              {/* Product cards */}
              {products.map((product, index) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="block"
                >
                  <div
                    data-aos="fade-up"
                    data-aos-delay={index * 200}
                    className="group relative overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white p-3 shadow-[0_12px_35px_rgba(55,35,20,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(55,35,20,0.14)] dark:border-white/10 dark:bg-gray-900"
                  >
                    {/* Product image */}
                    <div className="relative overflow-hidden rounded-[1rem] bg-[#f2ece4] dark:bg-gray-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-[150px] w-full object-cover transition duration-700 ease-out group-hover:scale-105 sm:h-[275px]"
                      />
                    </div>

                    {/* Product information */}
                    <div className="px-1 pb-1 pt-2 sm:pt-4">
                      {/* Category */}
                      <div className="mb-1 sm:mb-2 flex items-center justify-between gap-1 sm:gap-2">
                        <p className="text-[7px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                          {product.category}
                        </p>
                      </div>

                      {/* Product name */}
                      <h3 className="truncate text-xs sm:text-base font-bold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>

                      {/* Stock and price */}
                      <div className="mt-1 flex items-center justify-between gap-1">
                        <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </p>

                        <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                          {product.price.toLocaleString()} Rwf
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View all button */}
          <div className="flex justify-center">
            <button className="mt-6 sm:mt-12 flex cursor-pointer items-center gap-2 sm:gap-3 rounded-full bg-gray-950 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-primary">
              View all pieces
              <FiArrowUpRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
