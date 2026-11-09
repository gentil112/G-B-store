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
    <main className="min-h-screen bg-[#f7f4ef] py-9 text-[#29241e] dark:bg-[#171511] dark:text-[#f3eee6] sm:py-16">
      <div className="container max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <header className="mb-8 border-b border-[#b99467]/25 pb-7 sm:mb-10 sm:flex sm:items-end sm:justify-between sm:pb-9">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              G&B / The collection
            </p>
            <h1 className="mt-3 font-serif text-4xl font-normal leading-none sm:mt-4 sm:text-6xl">
              All pieces
            </h1>
            <p className="mt-3 max-w-md text-xs leading-6 text-[#71685e] dark:text-[#c4bbb0] sm:text-sm">
              Considered essentials, chosen to be worn on repeat.
            </p>
          </div>
          {!loading && !error && products.length > 0 && (
            <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#8c8173] dark:text-[#b8ad9f] sm:mb-1 sm:mt-0">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
          )}
        </header>

        {loading && (
          <div
            role="status"
            aria-label="Loading products"
            className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7"
          >
            {Array.from({ length: 8 }, (_, index) => (
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

        {error && (
          <div className="flex justify-center py-10">
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-20 text-center font-serif text-2xl text-[#71685e] dark:text-[#c4bbb0]">
            No products are available right now.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="group block min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#eee7dd] dark:bg-[#29251f]">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />
                </div>
                <div className="pt-3 sm:pt-4">
                  <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#927650] dark:text-[#c6a77d] sm:mb-2 sm:text-[10px]">
                    {product.category}
                  </p>
                  <h2 className="truncate text-sm font-medium text-[#29241e] transition-colors group-hover:text-[#806545] dark:text-[#f3eee6] dark:group-hover:text-[#d4b68f] sm:text-base">
                    {product.name}
                  </h2>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductsPage;
