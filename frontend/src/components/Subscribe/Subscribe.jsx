import React from "react";
import Banner from "../../assets/website/orange.jpg";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const Subscribe = () => {
  return (
    <div
      data-aos="zoom-in"
      className="relative isolate mb-20 overflow-hidden text-gray-950 transition-colors duration-300 dark:text-white"
      style={BannerImg}
    >
      <div className="absolute inset-0 -z-10 bg-white/20 transition-colors duration-300 dark:bg-black/55" />
      <div className="container relative z-10 py-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/40 bg-white/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-md transition-colors duration-300 dark:border-white/10 dark:bg-black/70 dark:shadow-black/60 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 text-center lg:max-w-xl lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-800 dark:text-orange-300">
                Exclusive drops
              </p>
              <h1 className="text-3xl font-bold text-gray-950 sm:text-4xl dark:text-white">
                Get Notified About New Arrivals
              </h1>
            </div>

            <div className="w-full max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  data-aos="fade-up"
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/60"
                />
                <button
                  data-aos="fade-up"
                  className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg shadow-orange-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/40 dark:shadow-black/50"
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
