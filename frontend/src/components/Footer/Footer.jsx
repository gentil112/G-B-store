import React from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import DarkMode from "../navbar/DarkMode";

const Footer = () => {
  return (
    <footer className="overflow-hidden border-t border-[#b99467]/30 bg-[#f7f4ef] text-[#29241e] transition-colors dark:border-white/10 dark:bg-[#171511] dark:text-[#f3eee6]">
      <div className="container max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div
          className="grid gap-8 border-b border-[#b99467]/25 py-12 dark:border-white/15 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:py-20"
          data-aos="fade-up"
        >
          <div>
            <p className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#927650] dark:text-[#c6a77d] sm:text-xs">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              The G&amp;B edit
            </p>
            <h2 className="max-w-3xl font-serif text-4xl font-normal leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Dress like you mean it.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#71685e] dark:text-[#c4bbb0] sm:text-base">
              New drops, considered edits, and first access to the pieces worth
              keeping.
            </p>
          </div>
          <Link
            to="/products"
            className="group inline-flex w-fit items-center gap-7 border border-[#b99467]/45 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#29241e] hover:text-[#f7f4ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:border-[#c6a77d]/35 dark:text-[#e8d8c3] dark:hover:bg-[#eee7dc] dark:hover:text-[#29241e]"
          >
            Explore the collection
            <FaArrowUpLong
              className="rotate-45 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid gap-10 border-b border-[#b99467]/25 py-10 dark:border-white/15 sm:grid-cols-2 sm:gap-12 sm:py-12 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-8 lg:py-14">
          <div>
            <Link
              to="/"
              aria-label="G&B Store home"
              className="group flex w-fit items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650]"
            >
              <span className="flex h-12 w-12 items-center justify-center border border-[#b99467]/50 bg-[#f1ece3] font-serif text-sm tracking-[0.08em] text-[#765b3c] transition-colors group-hover:border-[#927650] dark:border-[#c6a77d]/35 dark:bg-[#211e1a] dark:text-[#e2c6a2]">
                G&amp;B
              </span>
              <span>
                <span className="block text-lg font-semibold tracking-[0.2em] text-[#29241e] dark:text-[#f3eee6] sm:text-xl">
                  STORE
                </span>
                <span className="mt-1 block text-[8px] uppercase tracking-[0.22em] text-[#8c8173] dark:text-[#b8ad9f]">
                  Everyday, considered
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#71685e] dark:text-[#b8ad9f]">
              Modern essentials for people who move with intention.
            </p>
          </div>

          <nav aria-label="Shop links">
            <h3 className="mb-5 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#927650] dark:text-[#c6a77d]">
              <span className="h-px w-5 bg-current" aria-hidden="true" />
              Shop
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/products"
                  className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#71685e] transition-colors hover:text-[#765b3c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-[#e2c6a2]"
                >
                  Shop all
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#71685e] transition-colors hover:text-[#765b3c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-[#e2c6a2]"
                >
                  Your cart
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Account links">
            <h3 className="mb-5 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#927650] dark:text-[#c6a77d]">
              <span className="h-px w-5 bg-current" aria-hidden="true" />
              Account
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/login"
                  className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#71685e] transition-colors hover:text-[#765b3c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-[#e2c6a2]"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#71685e] transition-colors hover:text-[#765b3c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:text-[#b8ad9f] dark:hover:text-[#e2c6a2]"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-5 py-5 text-[9px] font-medium uppercase tracking-[0.15em] text-[#8c8173] dark:text-[#9b9184] sm:flex-row sm:items-center sm:justify-between sm:text-[10px]">
          <p>© 2026 G&amp;B Store. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <DarkMode />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="group flex items-center gap-2 text-[#765b3c] transition-colors hover:text-[#29241e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#927650] dark:text-[#c6a77d] dark:hover:text-white"
            >
              Back to top
              <FaArrowUpLong
                className="transition-transform group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
