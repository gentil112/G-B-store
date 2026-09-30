import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="flex min-h-[60vh] items-center justify-center bg-[#fcfaf7] px-5 py-16 text-center text-[#171512] dark:bg-gray-950 dark:text-white">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
        404
      </p>
      <h1 className="mt-3 text-3xl font-black sm:text-5xl">Page not found</h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/60 dark:text-white/60">
        This address does not match a page on G&amp;B Store.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
      >
        Return home
      </Link>
    </div>
  </main>
);

export default NotFoundPage;
