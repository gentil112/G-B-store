import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const DarkMode = () => {
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem("theme") || "light",
  );

  React.useEffect(() => {
    const handleThemeChange = (event) => setTheme(event.detail);

    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, [theme]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.dispatchEvent(
      new CustomEvent("theme-change", { detail: nextTheme }),
    );
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-pressed={theme === "dark"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b99467]/25 bg-[#fbf9f5] text-[#9b754b] transition hover:border-primary hover:bg-primary/10 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/10 dark:bg-white/5 dark:text-[#d4ad7e]"
    >
      {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
    </button>
  );
};

export default DarkMode;
