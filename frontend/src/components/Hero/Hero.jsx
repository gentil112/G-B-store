import React from "react";
import Image1 from "../../assets/hero/women.png";
import Image2 from "../../assets/hero/people.png";
import Image3 from "../../assets/hero/Sale.png";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
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
      <button className="mt-4 h-2.5 w-2.5 rounded-full bg-orange-200 transition-all duration-300 hover:bg-primary" />
    ),
    prevArrow: (
      <button className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-white/80 p-3 text-primary shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-primary hover:text-white">
        <FaArrowLeft className="text-sm" />
      </button>
    ),
    nextArrow: (
      <button className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-white/80 p-3 text-primary shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-primary hover:text-white">
        <FaArrowRight className="text-sm" />
      </button>
    ),
  };
  return (
    <div
      className="relative min-h-[90vh] sm:min-h-[650px] md:min-h-[750px] overflow-hidden
     flex justify-center
     items-center dark:bg-gray-950 dark:text-white
     duration-200"
    >
      {/* background pattern */}
      <div
        className="h-[400px] w-[400px] sm:h-[700px] sm:w-[700px] bg-primary/30
      absolute -top-1/2 left-1/4  rounded-[3rem] rotate-45
      -z-9 shadow-[0_20px_80px_-30px_rgba(251,146,60,0.8)]"
      ></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(251,146,60,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,146,60,0.14)_1px,transparent_1px)] bg-[size:26px_26px] opacity-60" />
      {/* hero section */}
      <div className="container relative z-10 py-4 sm:py-0 px-3 sm:px-0">
        <SliderComponent {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 items-center gap-3 sm:gap-6 sm:grid-cols-2">
                {/* text content section */}
                <div
                  className=" flex flex-col justify-center gap-2 sm:gap-4
          pt-2 sm:pt-0 text-center sm:text-left
          order-2 sm:order-1 relative z-10"
                >
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-primary"
                  >
                    Fashion Forward
                  </p>
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-3xl sm:text-5xl md:text-6xl
                     lg:text-7xl font-black uppercase tracking-tight"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-300"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                    className="flex justify-center sm:justify-start"
                  >
                    <button
                      className="bg-gradient-to-r
              from-primary to-secondary hover:scale-105
              duration-200 text-white py-2 px-4 sm:py-2.5 sm:px-5
              rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-orange-900/20"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
                {/* image  section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10 rounded-[2rem] bg-white/40 p-4 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.45)] backdrop-blur-sm dark:bg-gray-900/40"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] md:h-[450px]
              md:w-[450px] sm:scale-100
              object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </SliderComponent>
      </div>
    </div>
  );
};

export default Hero;
