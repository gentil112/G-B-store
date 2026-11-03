import React from "react";
import { Link, useLocation } from "react-router-dom";

const PAGE_CONTENT = {
  "/gift-cards": {
    title: "Gift cards",
    message:
      "Gift card products and redemption details are not configured yet.",
  },
  "/our-story": {
    title: "Our story",
    message: "Brand history and founder details have not been provided yet.",
  },
  "/journal": {
    title: "Journal",
    message: "No journal entries are currently available.",
  },
  "/sustainability": {
    title: "Sustainability",
    message: "Verified sustainability information has not been provided yet.",
  },
  "/stockists": {
    title: "Stockists",
    message: "No stockist locations have been provided yet.",
  },
  "/contact": {
    title: "Contact us",
    message:
      "A public support email address or phone number has not been configured.",
  },
  "/shipping-returns": {
    title: "Shipping & returns",
    message:
      "Shipping costs, delivery estimates, and return terms have not been provided yet.",
  },
  "/size-guide": {
    title: "Size guide",
    message: "A size chart has not been provided yet.",
  },
  "/faq": {
    title: "Frequently asked questions",
    message: "Frequently asked questions have not been provided yet.",
  },
  "/privacy": {
    title: "Privacy",
    message: "The store privacy policy has not been provided yet.",
  },
  "/terms": {
    title: "Terms & conditions",
    message: "Store terms and conditions have not been provided yet.",
  },
};

const FooterInfoPage = () => {
  const { pathname } = useLocation();
  const page = PAGE_CONTENT[pathname];

  if (!page) return null;

  return (
    <main className="min-h-[60vh] bg-[#fcfaf7] py-16 text-[#171512] dark:bg-gray-950 dark:text-white sm:py-20">
      <div className="container">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          G&amp;B Store
        </p>
        <h1 className="text-3xl font-black sm:text-5xl">{page.title}</h1>
        <p className="mt-6 max-w-2xl border-t border-black/10 pt-6 text-base leading-7 text-black/60 dark:border-white/15 dark:text-white/60">
          {page.message}
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
        >
          Browse products
        </Link>
      </div>
    </main>
  );
};

export default FooterInfoPage;
