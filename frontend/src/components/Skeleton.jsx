import React from "react";

const Skeleton = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded bg-gray-200 dark:bg-gray-800 motion-reduce:animate-none ${className}`}
  />
);

export default Skeleton;
