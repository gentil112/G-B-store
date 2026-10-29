import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCheck, FiTruck } from "react-icons/fi";
import BannerImg from "../../assets/TopProducts/tshirt1.jpg";

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-[#f4efe8] py-12 dark:bg-[#171411] sm:py-20">
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-[#b99467]/20" />
      <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border border-[#b99467]/20" />

      <div className="container relative">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-[#b99467]/20 bg-[#fbf9f5] shadow-[0_30px_90px_-45px_rgba(47,34,21,0.35)] dark:bg-[#211d19] md:grid-cols-[1.05fr_0.95fr]">
          <div
            data-aos="fade-right"
            className="relative min-h-[320px] overflow-hidden bg-[#d8cec0] sm:min-h-[480px]"
          >
            <img
              src={BannerImg}
              alt="A featured piece from the G&B Store collection"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17120e]/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75 sm:text-xs">
                  G&amp;B — The edit
                </p>
                <p className="mt-1 font-serif text-2xl sm:text-3xl">
                  Made to be worn well.
                </p>
              </div>
              <span className="hidden border border-white/50 px-3 py-2 text-[10px] uppercase tracking-[0.2em] backdrop-blur-sm sm:block">
                Est. in style
              </span>
            </div>
          </div>

          <div className="px-6 pb-8 pt-2 sm:px-10 sm:py-12 lg:px-14">
            <p
              data-aos="fade-up"
              className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9b754b] dark:text-[#d4ad7e] sm:text-xs"
            >
              <span className="h-px w-8 bg-current" />
              A little something special
            </p>
            <h2
              data-aos="fade-up"
              className="mt-5 font-serif text-4xl leading-[1.08] text-[#26211b] dark:text-[#f5efe6] sm:text-5xl lg:text-6xl"
            >
              Considered style.
              <span className="mt-1 block italic text-[#9b754b] dark:text-[#d4ad7e]">
                Exceptional value.
              </span>
            </h2>
            <p
              data-aos="fade-up"
              className="mt-5 max-w-md text-sm leading-7 text-[#71685d] dark:text-[#c2b9ae] sm:text-base"
            >
              Discover enduring favorites and new-season essentials, selected
              for comfort, quality, and the way they make you feel.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#5e554a] dark:text-[#d0c7bb] sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <FiCheck className="text-[#9b754b] dark:text-[#d4ad7e]" />
                Quality pieces
              </span>
              <span className="inline-flex items-center gap-2">
                <FiTruck className="text-[#9b754b] dark:text-[#d4ad7e]" />
                Delivery available
              </span>
            </div>

            <Link
              to="/products"
              data-aos="fade-up"
              className="mt-8 inline-flex items-center gap-8 bg-[#26211b] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#9b754b] dark:bg-[#f5efe6] dark:text-[#26211b] dark:hover:bg-[#d4ad7e]"
            >
              Discover the collection
              <FiArrowUpRight className="text-lg" />
            </Link>

            <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#9b9287] dark:text-[#92887d]">
              Thoughtfully chosen. Effortlessly yours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
