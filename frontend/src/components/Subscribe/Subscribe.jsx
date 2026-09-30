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
      className="mb-20 text-white dark:text-white"
      style={BannerImg}
    >
      <div className="container py-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-black/30 p-6 shadow-2xl shadow-black/35 backdrop-blur-md dark:border-white/10 dark:bg-black/70 dark:shadow-black/60 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 text-center lg:max-w-xl lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-200 dark:text-orange-300">
                Exclusive drops
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl dark:text-white">
                Get Notified About New Arrivals
              </h1>
            </div>

            <div className="w-full max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  data-aos="fade-up"
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder:text-orange-50/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-white/10 dark:bg-black/40 dark:text-white dark:placeholder:text-white/60"
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
