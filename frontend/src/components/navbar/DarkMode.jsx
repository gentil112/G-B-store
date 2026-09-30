import React from "react";
import LightButton from "../../assets/website/light-button.png";
import DarkButton from "../../assets/website/dark-button.png";
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
    <div className="relative">
      <img
        src={LightButton}
        alt=""
        onClick={toggleTheme}
        className={`w-12 sm:w-10 cursor-pointer
       drop-shadow-[1px_1px_1px_rgba(0,0,0,1)] transition-all
       duration-300 absolute right-0 z-10 ${
         theme === "dark" ? "opacity-0" : "opacity-100"
       } `}
      />
      <img
        src={DarkButton}
        alt=""
        onClick={toggleTheme}
        className="w-12 sm:w-10 cursor-pointer
       drop-shadow-[1px_1px_1px_rgba(0,0,0,1)] transition-all
       duration-300 "
      />
    </div>
  );
};

export default DarkMode;
