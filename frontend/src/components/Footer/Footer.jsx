import React from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import DarkMode from "../navbar/DarkMode";

const Footer = () => {
  return (
    <footer className="overflow-hidden bg-[#f7f4ee] text-[#171512] transition-colors dark:bg-[#171512] dark:text-white">
      <div className="container py-16 sm:py-20 lg:py-24">
        <div
          className="relative border-b border-black/10 pb-16 dark:border-white/15"
          data-aos="fade-up"
        >
          <div className="relative">
            <div className="absolute -left-10 -top-12 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
            <p className="relative mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              The G&amp;B edit
            </p>
            <h2 className="relative max-w-xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Dress like you mean it.
            </h2>
            <p className="relative mt-6 max-w-md text-sm leading-6 text-black/60 sm:text-base dark:text-white/60">
              New drops, considered edits, and first access to the pieces worth
              keeping.
            </p>
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-8">
          <div>
            <a
              href="/"
              className="flex w-fit items-center gap-3 transition-opacity hover:opacity-80"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-black text-white shadow-lg shadow-primary/20">
                G&amp;B
              </span>
              <span className="text-2xl font-black tracking-[0.2em] text-[#171512] dark:text-white">
                STORE
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-6 text-black/55 dark:text-white/50">
              Modern essentials for people who move with intention.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/#products"
                  className="text-sm text-black/60 transition-colors hover:text-[#171512] dark:text-white/55 dark:hover:text-white"
                >
                  Shop all
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-sm text-black/60 transition-colors hover:text-[#171512] dark:text-white/55 dark:hover:text-white"
                >
                  Cart
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#login"
                  className="text-sm text-black/60 transition-colors hover:text-[#171512] dark:text-white/55 dark:hover:text-white"
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="#profile"
                  className="text-sm text-black/60 transition-colors hover:text-[#171512] dark:text-white/55 dark:hover:text-white"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-black/10 pt-6 text-[11px] uppercase tracking-[0.16em] text-black/45 sm:flex-row sm:items-center sm:justify-between dark:border-white/15 dark:text-white/40">
          <p>© 2026 G&B Store. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <DarkMode />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="flex items-center gap-2 text-primary transition-colors hover:text-[#171512] dark:hover:text-white"
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
