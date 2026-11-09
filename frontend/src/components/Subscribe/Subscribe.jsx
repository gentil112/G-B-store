import React from "react";

const Subscribe = () => {
  return (
    <section
      data-aos="zoom-in"
      className="bg-[#eee7dd] py-10 text-[#29241e] transition-colors duration-300 dark:bg-[#211d19] dark:text-[#f3eee6] sm:py-14"
    >
      <div className="container max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid gap-7 border-y border-[#b99467]/30 py-7 sm:gap-9 sm:py-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Exclusive drops
            </p>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight sm:text-4xl">
              Get notified about new arrivals
            </h2>
            <p className="mt-2 text-xs leading-6 text-[#71685e] dark:text-[#c4bbb0] sm:text-sm">
              Notes from the collection, delivered occasionally.
            </p>
          </div>

          <div className="w-full lg:max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                data-aos="fade-up"
                type="email"
                aria-label="Email address"
                autoComplete="email"
                placeholder="Your email address"
                className="min-h-12 min-w-0 flex-1 border border-[#b99467]/35 bg-[#fffefa] px-4 text-sm text-[#29241e] placeholder:text-[#8c8173] focus:border-[#927650] focus:outline-none focus:ring-2 focus:ring-[#927650]/30 dark:border-white/15 dark:bg-[#171511] dark:text-[#f3eee6] dark:placeholder:text-[#9b9184]"
              />
              <button
                data-aos="fade-up"
                type="button"
                className="min-h-12 bg-[#29241e] px-7 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#68543d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:bg-[#eee7dc] dark:text-[#29241e] dark:hover:bg-white"
              >
                Join the list
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
