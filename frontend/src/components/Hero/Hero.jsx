import React from "react";
import Slider from "react-slick";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Image1 from "../../assets/hero/women.png";
import Image2 from "../../assets/hero/people.png";
import Image3 from "../../assets/hero/Sale.png";

const SliderComponent = Slider?.default || Slider;

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: " free delivery",
    description: " image one description",
  },
  {
    id: 2,
    img: Image2,
    title: " quality products at affordable prices",
    description: " image two description",
  },
  {
    id: 3,
    img: Image3,
    title: "   up to 15% off on t-shirts and pants",
    description: " image three description",
  },
];

const Hero = () => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
    customPaging: () => (
      <button className="hero-slider-dot" />
    ),
    prevArrow: (
      <button
        type="button"
        aria-label="Previous slide"
        className="hero-slider-arrow"
      >
        <FaChevronLeft aria-hidden="true" />
      </button>
    ),
    nextArrow: (
      <button
        type="button"
        aria-label="Next slide"
        className="hero-slider-arrow"
      >
        <FaChevronRight aria-hidden="true" />
      </button>
    ),
  };

  return (
    <section
      aria-label="Featured collections"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#f7f4ef] text-[#29241e] transition-colors duration-300 dark:bg-[#171511] dark:text-[#f3eee6] sm:min-h-[650px] md:min-h-[750px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_44%,rgba(195,160,119,0.18),transparent_48%)]" />
      <div className="container hero-slider relative z-10 px-3 py-8 sm:px-0 sm:py-12">
        <SliderComponent {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid min-h-[620px] grid-cols-1 items-center gap-3 sm:min-h-[560px] sm:grid-cols-[0.9fr_1.1fr] sm:gap-8 lg:gap-14">
                <div className="order-2 flex flex-col items-center text-center sm:order-1 sm:items-start sm:pl-8 sm:text-left lg:pl-12">
                  <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs">
                    <span className="h-px w-8 bg-current" aria-hidden="true" />
                    Fashion Forward
                  </p>
                  <h1 className="max-w-[12ch] font-serif text-[clamp(2.7rem,5.5vw,5.4rem)] font-normal leading-[0.98] tracking-[-0.045em]">
                    {data.title}
                  </h1>
                  <p className="mt-6 max-w-md text-sm leading-7 text-[#71685e] dark:text-[#c4bbb0] sm:text-base">
                    {data.description}
                  </p>
                  <Link
                    to="/products"
                    className="mt-8 inline-flex min-h-12 items-center justify-center bg-[#29241e] px-7 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-[#68543d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:bg-[#eee7dc] dark:text-[#29241e] dark:hover:bg-white"
                  >
                    Order Now
                    <FaArrowRight
                      aria-hidden="true"
                      className="ml-4 text-xs"
                    />
                  </Link>
                </div>

                <div className="order-1 mx-auto w-full max-w-[500px] sm:order-2">
                  <div className="hero-product-image group relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_42%,#fffdfa_0%,#eee7dd_72%,#e5dbce_100%)] p-5 shadow-[0_28px_70px_-38px_rgba(47,35,23,0.5)] dark:bg-[radial-gradient(ellipse_at_50%_42%,#39342d_0%,#2b2721_72%,#211e1a_100%)] sm:p-8">
                    <img
                      src={data.img}
                      alt=""
                      className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </SliderComponent>
      </div>
    </section>
  );
};

export default Hero;
