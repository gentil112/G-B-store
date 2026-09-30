import React, { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa6";

const TestimonialsData = [
  {
    id: 1,
    name: "Mia Carter",
    role: "Style Shopper",
    quote:
      "The fit, fabric, and finish feel premium. I ordered one piece and instantly wanted more.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jordan Lee",
    role: "Repeat Customer",
    quote:
      "Clean design, fast delivery, and the product quality is exactly what I wanted for everyday wear.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ava Thompson",
    role: "New Customer",
    quote:
      "Everything looks elevated and the shopping experience feels super polished from start to finish.",
    rating: 4.8,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TestimonialsData.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % TestimonialsData.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + TestimonialsData.length) % TestimonialsData.length,
    );
  };

  return (
    <section className="mb-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <p
            data-aos="fade-up"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-primary"
          >
            Customer reviews
          </p>
          <h2
            data-aos="fade-up"
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Testimonials
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-orange-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,247,237,0.92))] p-4 shadow-[0_25px_80px_-28px_rgba(0,0,0,0.45)] backdrop-blur-sm dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(17,24,39,0.95),rgba(31,41,55,0.92))] sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {TestimonialsData.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-orange-200 dark:bg-orange-800"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="rounded-full border border-orange-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-gray-900 dark:text-gray-200"
              >
                Prev
              </button>
              <button
                onClick={nextSlide}
                className="rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-sm font-semibold text-white shadow-lg shadow-orange-900/20 transition hover:scale-[1.02]"
              >
                Next
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {TestimonialsData.map((item) => (
                <div
                  key={item.id}
                  className="min-w-full px-1"
                  data-aos="fade-up"
                >
                  <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-gray-900 dark:shadow-black/30">
                    <div className="mb-4 flex items-center justify-between">
                      <FaQuoteLeft className="text-2xl text-primary" />
                      <div className="flex items-center gap-1 text-sm text-yellow-400">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <FaStar
                            key={index}
                            className={
                              index < Math.round(item.rating)
                                ? "opacity-100"
                                : "opacity-30"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mb-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      “{item.quote}”
                    </p>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
