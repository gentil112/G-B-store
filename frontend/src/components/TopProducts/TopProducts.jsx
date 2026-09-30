import React, { useState } from "react";
import Img1 from "../../assets/TopProducts/shirt1.jpg";
import Img2 from "../../assets/TopProducts/tshirt1.jpg";
import Img3 from "../../assets/TopProducts/pant1.jpg";
import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const handleOrderPopup = () => {
  alert("Order placed!");
};

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "cotton shirt",
    description: " lorem lorem avagauiqh agvayiqva gahagua hvagaba ",
    price: 25000,
    originalPrice: 30000,
    rating: 4.5,
    reviews: 128,
    badge: "Sale",
  },
  {
    id: 2,
    img: Img2,
    title: "t-shirt design",
    description: " lorem lorem hgagahga hgagaj uabajabua hvhv",
    price: 15000,
    originalPrice: 20000,
    rating: 4.8,
    reviews: 245,
    badge: "Bestseller",
  },
  {
    id: 3,
    img: Img3,
    title: " black pants",
    description: " lorem ipsum, dolor sit amet consectetur adipisicing ",
    price: 20000,
    originalPrice: 25000,
    rating: 4.3,
    reviews: 89,
    badge: "Hot",
  },
];
const TopProducts = () => {
  const { addToCart } = useCart();
  const [hoveredId, setHoveredId] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getDiscountPercentage = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div>
      <div className="container">
        {/* header section  */}
        <div className="text-center mb-8 sm:mb-24">
          <p
            data-aos="fade-up"
            className="text-xs sm:text-sm text-primary font-semibold tracking-wider uppercase"
          >
            ✨ Top Rated products for you
          </p>
          <h1
            data-aos="fade-up"
            className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2"
          >
            Best products
          </h1>
          <p
            data-aos="fade-up"
            className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of premium clothing items,
            carefully curated for style and comfort
          </p>
        </div>
        {/* body section  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 md:gap-6 place-items-center">
          {ProductsData.map((data) => {
            const discount = getDiscountPercentage(
              data.originalPrice,
              data.price,
            );
            return (
              <div
                key={data.id}
                data-aos="zoom-in"
                onMouseEnter={() => setHoveredId(data.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative w-full max-w-[300px] h-full transition-all duration-500"
              >
                {/* Card Container */}
                <div
                  className="relative rounded-3xl bg-white dark:bg-gray-800
                  hover:shadow-2xl shadow-lg
                  overflow-hidden transition-all duration-500 ease-out
                  hover:-translate-y-2 h-full flex flex-col"
                >
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="inline-block bg-yellow-400 text-gray-800
                      text-xs font-bold px-3 py-1 rounded-full shadow-md
                      animate-pulse"
                    >
                      {data.badge}
                    </span>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(data.id)}
                    className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-700 rounded-full p-2.5
                      shadow-md hover:shadow-lg transition-all duration-300
                      hover:scale-110 active:scale-95"
                  >
                    <FaHeart
                      className={`transition-colors duration-300 text-lg ${
                        likedIds.has(data.id)
                          ? "text-red-500"
                          : "text-gray-300 dark:text-gray-500"
                      }`}
                    />
                  </button>

                  {/* Image section with overlay */}
                  <div className="relative h-[150px] sm:h-[200px] md:h-[320px] bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                    <img
                      src={data.img}
                      alt={data.title}
                      className="h-[120px] sm:h-[160px] md:h-[280px] w-auto object-contain
                        transform group-hover:scale-110 duration-500 ease-out
                        drop-shadow-lg"
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div
                        className="absolute bottom-4 right-4 bg-gray-800 dark:bg-gray-900 text-white
                        rounded-full w-12 h-12 flex items-center justify-center
                        font-bold text-sm shadow-lg animate-bounce"
                      >
                        -{discount}%
                      </div>
                    )}
                  </div>

                  {/* Details section */}
                  <div className="flex-1 p-3 sm:p-5 flex flex-col">
                    {/* Rating Section */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm transition-colors ${
                              i < Math.floor(data.rating)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        ({data.reviews})
                      </span>
                    </div>

                    {/* Title */}
                    <h1
                      className="text-lg font-bold capitalize mb-2 line-clamp-2 text-gray-900 dark:text-white
                      group-hover:text-primary transition-colors"
                    >
                      {data.title}
                    </h1>

                    {/* Description */}
                    <p
                      className="text-gray-600 dark:text-gray-400
                      group-hover:text-gray-700 dark:group-hover:text-gray-300
                      duration-300 text-xs line-clamp-2 mb-3 flex-1"
                    >
                      {data.description}
                    </p>

                    {/* Price section */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-primary">
                        Rwf{data.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${data.originalPrice}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() =>
                        addToCart({
                          _id: data.id,
                          name: data.title,
                          image: data.img,
                          category: "Top Products",
                          price: data.price,
                        })
                      }
                      className="w-full bg-primary hover:bg-primary/90
                        text-white font-semibold py-2.5 px-4
                        rounded-xl transition-all duration-300
                        flex items-center justify-center gap-2
                        hover:shadow-lg
                        active:scale-95
                        group/btn"
                    >
                      <FaShoppingCart className="text-sm group-hover/btn:animate-bounce" />
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
