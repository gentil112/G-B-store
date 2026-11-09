import React from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import DarkMode from "../navbar/DarkMode";

const Footer = () => {
  return (
    <footer className="overflow-hidden bg-[#f7f4ef] text-[#29241e] transition-colors dark:bg-[#171511] dark:text-[#f3eee6]">
      <div className="container max-w-[1440px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div
          className="border-b border-[#b99467]/25 pb-10 dark:border-white/15 sm:pb-12"
          data-aos="fade-up"
        >
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs">
              The G&amp;B edit
            </p>
            <h2 className="max-w-xl font-serif text-4xl font-normal leading-tight sm:text-6xl">
              Dress like you mean it.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#71685e] dark:text-[#c4bbb0] sm:mt-5 sm:text-base">
              New drops, considered edits, and first access to the pieces worth
              keeping.
            </p>
          </div>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 sm:gap-12 sm:py-12 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-8">
          <div>
            <a
              href="/"
              className="flex w-fit items-center gap-3 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-black text-white shadow-[0_4px_12px_rgba(237,137,0,0.22)]">
                G&amp;B
              </span>
              <span className="text-xl font-black tracking-[0.2em] text-[#29241e] dark:text-white sm:text-2xl">
                STORE
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#71685e] dark:text-[#b8ad9f]">
              Modern essentials for people who move with intention.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#927650] dark:text-[#c6a77d] sm:mb-5 sm:text-xs">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/#products"
                  className="text-sm text-[#71685e] transition-colors hover:text-[#29241e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-white"
                >
                  Shop all
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-sm text-[#71685e] transition-colors hover:text-[#29241e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-white"
                >
                  Cart
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#927650] dark:text-[#c6a77d] sm:mb-5 sm:text-xs">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#login"
                  className="text-sm text-[#71685e] transition-colors hover:text-[#29241e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-white"
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="#profile"
                  className="text-sm text-[#71685e] transition-colors hover:text-[#29241e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-white"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-[#b99467]/25 pt-5 text-[10px] uppercase tracking-[0.15em] text-[#8c8173] sm:flex-row sm:items-center sm:justify-between dark:border-white/15 dark:text-[#9b9184] sm:text-[11px]">
          <p>© 2026 G&B Store. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <DarkMode />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="flex items-center gap-2 text-[#927650] transition-colors hover:text-[#29241e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:text-[#c6a77d] dark:hover:text-white"
            >
              Back to top <FaArrowUpLong />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
