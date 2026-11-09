import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import Skeleton from "../Skeleton";
import { API_BASE_URL } from "../../config/api";

const TopProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/top`);

        if (!response.ok) {
          throw new Error("Failed to fetch top products");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching top products:", error);
        setError("Unable to load top products.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const toggleLike = (id) => {
    setLikedIds((previousIds) => {
      const nextIds = new Set(previousIds);
      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }
      return nextIds;
    });
  };

  return (
    <section className="bg-[#f7f4ef] py-12 text-[#29241e] transition-colors duration-300 dark:bg-[#171511] dark:text-[#f3eee6] sm:py-20">
      <div className="container max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <header className="mb-8 border-b border-[#b99467]/25 pb-6 sm:mb-10 sm:flex sm:items-end sm:justify-between sm:pb-8">
          <p
            data-aos="fade-up"
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs"
          >
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            G&B / Most purchased
          </p>
          <div className="mt-3 sm:mt-0">
            <h2
              data-aos="fade-up"
              className="font-serif text-3xl font-normal leading-tight sm:text-5xl"
            >
              Best sellers
            </h2>
            <p
              data-aos="fade-up"
              className="mt-2 max-w-md text-xs leading-6 text-[#71685e] dark:text-[#c4bbb0] sm:text-sm"
            >
              The pieces customers have purchased most, ranked by units sold.
            </p>
          </div>
        </header>

        {loading && (
          <div
            role="status"
            aria-label="Loading top products"
            className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:gap-x-8"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="w-full">
                <Skeleton className="aspect-[4/5] w-full rounded-none" />
                <Skeleton className="mt-4 h-5 w-3/4" />
                <Skeleton className="mt-3 h-4 w-1/3" />
                <Skeleton className="mt-5 h-11 w-full rounded-none" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="py-8 text-center text-sm text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-20 text-center font-serif text-2xl text-[#71685e] dark:text-[#c4bbb0]">
            Best sellers will appear here after customers place orders.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:gap-x-8">
            {products.map((product, index) => (
              <article
                key={product._id}
                data-aos="zoom-in"
                className="group relative mx-auto flex h-full w-full max-w-[390px] flex-col focus-within:outline-none md:max-w-none"
              >
                <span className="absolute left-3 top-3 z-10 bg-[#f7f4ef]/95 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#514332] dark:bg-[#171511]/95 dark:text-[#e5d8c5] sm:left-4 sm:top-4">
                  {String(index + 1).padStart(2, "0")} / Best seller
                </span>

                <button
                  type="button"
                  onClick={() => toggleLike(product._id)}
                  aria-label={
                    likedIds.has(product._id)
                      ? `Remove ${product.name} from favorites`
                      : `Add ${product.name} to favorites`
                  }
                  aria-pressed={likedIds.has(product._id)}
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center bg-[#f7f4ef]/95 text-[#514332] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:bg-[#171511]/95 dark:text-[#e5d8c5] dark:hover:bg-[#29251f] sm:right-4 sm:top-4"
                >
                  <FaHeart
                    className={`text-base transition-colors ${
                      likedIds.has(product._id)
                        ? "text-red-500"
                        : "text-gray-300 dark:text-gray-500"
                    }`}
                  />
                </button>

                <Link
                  to={`/product/${product._id}`}
                  className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650]"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#eee7dd] dark:bg-[#29251f]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />
                  </div>

                  <div className="pt-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#927650] dark:text-[#c6a77d] sm:text-[10px]">
                      {product.category}
                    </p>
                    <h3 className="mt-1 text-base font-medium text-[#29241e] transition-colors group-hover:text-[#806545] dark:text-[#f3eee6] dark:group-hover:text-[#d4b68f] sm:text-lg">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-[#71685e] dark:text-[#c4bbb0]">
                      {product.description}
                    </p>
                  </div>
                </Link>

                <div className="mt-auto pt-4">
                  <div className="mb-4 flex items-center justify-between gap-2 border-t border-[#b99467]/20 pt-3">
                    <span className="font-serif text-xl text-[#29241e] dark:text-[#f3eee6]">
                      {product.price.toLocaleString()} Rwf
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8c8173] dark:text-[#b8ad9f]">
                      {product.unitsSold.toLocaleString()} sold
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={product.stock < 1}
                    className="flex min-h-11 w-full items-center justify-center gap-2 bg-[#29241e] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#68543d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] disabled:cursor-not-allowed disabled:bg-[#b9b1a6] disabled:text-[#514332] dark:bg-[#eee7dc] dark:text-[#29241e] dark:hover:bg-white dark:disabled:bg-[#51483d] dark:disabled:text-[#c4bbb0]"
                  >
                    <FaShoppingCart className="text-sm" />
                    {product.stock > 0 ? "Add to cart" : "Out of stock"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopProducts;
