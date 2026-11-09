import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa6";

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
    <section className="bg-[#29241e] py-8 text-[#f3eee6] transition-colors duration-300 dark:bg-[#171511] sm:py-12">
      <div className="container max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c6a77d] sm:text-xs">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Customer reviews
            </p>
            <h2 className="mt-3 font-serif text-2xl font-normal leading-tight sm:text-4xl">
              Testimonials
            </h2>
          </div>

          <div className="flex items-center justify-between gap-5 sm:justify-end">
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Choose a testimonial"
            >
              {TestimonialsData.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={`h-2 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77d] ${
                    index === activeIndex
                      ? "w-8 bg-[#c6a77d]"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center border border-white/25 text-[#f3eee6] transition-colors hover:border-[#c6a77d] hover:text-[#c6a77d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a77d]"
              >
                <FaChevronLeft aria-hidden="true" size={13} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center border border-white/25 text-[#f3eee6] transition-colors hover:border-[#c6a77d] hover:text-[#c6a77d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a77d]"
              >
                <FaChevronRight aria-hidden="true" size={13} />
              </button>
            </div>
          </div>
        </header>

        <div className="overflow-hidden border-y border-[#c6a77d]/30">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {TestimonialsData.map((item) => (
              <div
                key={item.id}
                className="min-w-full px-1 py-6 sm:px-8 sm:py-8"
              >
                <div className="mx-auto max-w-3xl">
                  <div className="flex items-center justify-between">
                    <FaQuoteLeft
                      className="text-xl text-[#c6a77d]"
                      aria-hidden="true"
                    />
                    <div
                      className="flex items-center gap-1 text-xs text-[#c6a77d]"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                          key={index}
                          className={
                            index < Math.round(item.rating)
                              ? "opacity-100"
                              : "opacity-30"
                          }
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 font-serif text-xl leading-snug text-[#f3eee6] sm:text-3xl sm:leading-snug">
                    “{item.quote}”
                  </p>

                  <div className="mt-6 border-t border-white/15 pt-4">
                    <h3 className="text-sm font-semibold text-white">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#c6a77d]">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
