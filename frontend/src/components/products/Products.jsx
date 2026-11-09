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
    <div
      id="products"
      className="bg-[#f7f4ef] py-12 text-[#29241e] dark:bg-[#171511] dark:text-[#f3eee6] sm:py-20"
    >
      <div className="container max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Header section */}
        <div className="mb-7 border-b border-[#b99467]/25 pb-6 sm:mb-9 sm:flex sm:items-end sm:justify-between sm:pb-8">
          <p
            data-aos="fade-up"
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs"
          >
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            G&B / The edit
          </p>
          <div className="mt-3 sm:mt-0">
            <h2
              data-aos="fade-up"
              className="font-serif text-3xl font-normal leading-tight sm:text-5xl"
            >
              A considered edit
            </h2>
            <p
              data-aos="fade-up"
              className="mt-2 text-xs leading-6 text-[#71685e] dark:text-[#c4bbb0] sm:text-sm"
            >
              Everyday pieces, chosen to go the distance.
            </p>
          </div>
          {!loading && !error && products.length > 0 && (
            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#8c8173] dark:text-[#b8ad9f] sm:mb-1 sm:mt-0">
              {Math.min(products.length, 5)} selected pieces
            </p>
          )}
        </div>

        {/* Body section */}
        <div>
          {/* Product skeletons */}
          {loading && (
            <div
              role="status"
              aria-label="Loading products"
              className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-6"
            >
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="overflow-hidden">
                  <Skeleton className="aspect-[4/5] w-full rounded-none" />
                  <div className="space-y-2 pt-3 sm:pt-4">
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
            <div
              id="product-grid"
              className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-6"
            >
              {/* Product cards */}
              {products.slice(0, 5).map((product, index) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="group block min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650]"
                >
                  <div data-aos="fade-up" data-aos-delay={index * 200}>
                    {/* Product image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#eee7dd] dark:bg-[#29251f]">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                      />
                    </div>

                    {/* Product information */}
                    <div className="pt-3 sm:pt-4">
                      {/* Category */}
                      <div className="mb-1.5 sm:mb-2">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#927650] dark:text-[#c6a77d] sm:text-[10px]">
                          {product.category}
                        </p>
                      </div>

                      {/* Product name */}
                      <h3 className="truncate text-sm font-medium text-[#29241e] transition-colors group-hover:text-[#806545] dark:text-[#f3eee6] dark:group-hover:text-[#d4b68f] sm:text-base">
                        {product.name}
                      </h3>

                      {/* Stock and price */}
                      <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#b99467]/20 pt-2.5 sm:mt-3 sm:pt-3">
                        <p className="text-[9px] text-[#8c8173] dark:text-[#b8ad9f] sm:text-[11px]">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of Stock"}
                        </p>

                        <span className="shrink-0 text-xs font-semibold tabular-nums text-[#29241e] dark:text-[#f3eee6] sm:text-sm">
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
          {!loading && !error && products.length > 0 && (
            <div className="flex justify-center">
              <Link
                to="/products"
                className="mt-8 inline-flex min-h-12 cursor-pointer items-center gap-3 bg-[#29241e] px-7 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-[#68543d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:bg-[#eee7dc] dark:text-[#29241e] dark:hover:bg-white sm:mt-10"
              >
                View all pieces
                <FiArrowUpRight className="text-lg transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
