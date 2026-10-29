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
    <section className="py-10 sm:py-16">
      <div className="container">
        <header className="mb-8 text-center sm:mb-12">
          <p
            data-aos="fade-up"
            className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm"
          >
            Most purchased
          </p>
          <h2
            data-aos="fade-up"
            className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-4xl md:text-5xl"
          >
            Best sellers
          </h2>
          <p
            data-aos="fade-up"
            className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 dark:text-gray-400"
          >
            The products customers have purchased most, ranked by units sold.
          </p>
        </header>

        {loading && (
          <div
            role="status"
            aria-label="Loading top products"
            className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 md:gap-6"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="w-full max-w-[300px] rounded-3xl bg-white p-4 shadow-lg dark:bg-gray-800"
              >
                <Skeleton className="h-[200px] w-full rounded-2xl sm:h-[280px]" />
                <Skeleton className="mt-4 h-5 w-3/4" />
                <Skeleton className="mt-3 h-4 w-1/3" />
                <Skeleton className="mt-5 h-10 w-full rounded-xl" />
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
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Best sellers will appear here after customers place orders.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 md:gap-6">
            {products.map((product, index) => (
              <article
                key={product._id}
                data-aos="zoom-in"
                className="group relative flex h-full w-full max-w-[300px] flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
              >
                <span className="absolute left-4 top-4 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-800 shadow-md">
                  #{index + 1} Best seller
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
                  className="absolute right-4 top-4 z-10 rounded-full bg-white p-2.5 shadow-md transition hover:scale-110 dark:bg-gray-700"
                >
                  <FaHeart
                    className={`text-lg transition-colors ${
                      likedIds.has(product._id)
                        ? "text-red-500"
                        : "text-gray-300 dark:text-gray-500"
                    }`}
                  />
                </button>

                <Link to={`/product/${product._id}`} className="block">
                  <div className="flex h-[200px] items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700 sm:h-[280px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="px-4 pb-2 pt-4 sm:px-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {product.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                      {product.description}
                    </p>
                  </div>
                </Link>

                <div className="mt-auto px-4 pb-4 sm:px-5">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="text-xl font-bold text-primary">
                      {product.price.toLocaleString()} Rwf
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {product.unitsSold.toLocaleString()} sold
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={product.stock < 1}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-400"
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
