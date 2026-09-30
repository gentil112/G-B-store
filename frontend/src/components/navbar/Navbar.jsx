import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DarkMode from "./DarkMode";
import { useAuth } from "../../context/AuthContext";
import { apiCall } from "../../hooks/useApi";
import { useCart } from "../../context/CartContext";
const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/#",
  },
  { id: 2, name: "Top Rated", link: "/#products" },
  { id: 3, name: "T-shirts", link: "/#products" },
  { id: 4, name: "Pants", link: "/#products" },
];
const DropdownLinks = [
  { id: 1, name: "Trending products", link: "/#" },
  { id: 2, name: "Best Sellers", link: "/#" },
  { id: 3, name: "Top rated", link: "/#" },
];
const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleOpenLoginModal = () => {
      setAuthMode("login");
      resetAuthModal();
      setIsOpen(true);
    };

    const handleLogoutEvent = () => {
      setIsAccountMenuOpen(false);
      setIsOpen(false);
      resetAuthModal();
      // Call the logout function from context to update authentication state
      logout();
    };

    window.addEventListener("open-login-modal", handleOpenLoginModal);
    window.addEventListener("user-logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("open-login-modal", handleOpenLoginModal);
      window.removeEventListener("user-logout", handleLogoutEvent);
    };
  }, [logout]);

  // Monitor authentication state changes and close menu when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAccountMenuOpen(false);
      setIsOpen(false);
      resetAuthModal();
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetAuthModal = () => {
    setMessage("");
    setFormData({ name: "", email: "", password: "" });
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setIsAccountMenuOpen(false);
    resetAuthModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
    const payload =
      authMode === "register"
        ? formData
        : { email: formData.email, password: formData.password };

    try {
      const data = await apiCall(endpoint, "POST", payload);

      if (authMode === "login") {
        // Store token and user in context
        login(data.user, data.token);
        setMessage(
          `Welcome back${data.user?.name ? `, ${data.user.name}` : ""}!`,
        );

        // Close modal after short delay to show success message
        setTimeout(() => {
          closeAuthModal();
        }, 1000);
      } else {
        setMessage(
          `Welcome ${data.user?.name || "there"}! Please login to continue.`,
        );
        // Switch to login mode after successful registration
        setTimeout(() => {
          setAuthMode("login");
          resetAuthModal();
        }, 1500);
      }

      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage(error.message);
    }
  };
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div
      className=" shadow-md bg-white dark:bg-gray-900
     dark:text-white"
    >
      {/* upper navbar */}
      <div className="bg-primary/40 py-2 sm:py-0 ">
        <div className="w-full flex justify-between items-center gap-2 px-5">
          <div>
            <a
              href="#"
              className="flex items-center gap-2 sm:gap-3 rounded-full border border-black/10 bg-white/70 px-2 sm:px-3 py-2 sm:py-1.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-gray-900/60 flex-shrink-0"
            >
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs sm:text-sm font-black text-white shadow-md">
                G&B
              </span>
              <span className="text-sm sm:text-lg font-black tracking-[0.15em] sm:tracking-[0.25em] text-gray-900 dark:text-white whitespace-nowrap">
                STORE
              </span>
            </a>
          </div>
          {/* search and controls bar  */}
          <div
            className="flex justify-end
          items-center gap-2 sm:gap-3 flex-1"
          >
            {/* search icon for small devices */}
            <button className="sm:hidden text-gray-900 dark:text-white hover:text-primary transition-colors flex-shrink-0">
              <IoMdSearch className="text-xl" />
            </button>

            <div
              className="group relative hidden
                 sm:block"
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-[150px] md:w-[200px]
             group-hover:w-[250px] md:group-hover:w-[300px] transition-all duration-300
             rounded-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-1
              focus:border-primary
              dark:border-gray-500
              dark:bg-gray-800"
              />
              <IoMdSearch
                className="text-gray-500 
            group-hover:text-primary absolute
            top-1/2 -translate-y-1/2 right-3 text-sm"
              />
            </div>
            {/* order button */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="relative bg-gradient-to-r from-primary to-secondary transition-all duration-200
             text-white py-1 px-2 sm:px-4 rounded-full flex
             items-center gap-2 sm:gap-3 group flex-shrink-0"
            >
              <span className="transition-all duration-200 text-xs font-bold sm:text-sm">
                Cart
              </span>

              <FaCartShopping className="text-lg sm:text-xl text-white drop-shadow-sm" />

              {/* Cart item count */}
              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-2 flex h-5 min-w-5
      items-center justify-center rounded-full bg-red-500
      px-1 text-[10px] font-bold text-white"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                className="rounded-full bg-gray-900 px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-primary dark:bg-white dark:text-gray-900 whitespace-nowrap"
              >
                <span className="hidden sm:inline">
                  {isAuthenticated ? user?.name || "Account" : "Account"}
                </span>
                <span className="sm:hidden">
                  {isAuthenticated ? "U" : "A/C"}
                </span>
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 z-[10000] mt-2 w-40 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Logged in as
                        </p>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          navigate("/my-orders");
                        }}
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-primary/10 dark:hover:text-primary"
                      >
                        My Orders
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          window.location.hash = "profile";
                        }}
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-primary/10 dark:hover:text-primary flex items-center gap-2"
                      >
                        <svg
                          className="text-lg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          width="20"
                          height="20"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        View Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                          // Dispatch logout event to update other components
                          window.dispatchEvent(new Event("user-logout"));
                        }}
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 flex items-center gap-2"
                      >
                        <MdLogout className="text-lg" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          window.location.hash = "register";
                        }}
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-primary/10 hover:text-primary dark:text-gray-200"
                      >
                        Register
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          window.location.hash = "login";
                        }}
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-primary/10 hover:text-primary dark:text-gray-200"
                      >
                        Login
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* dark mode switch */}
            <div>
              <DarkMode />
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {authMode === "login"
                  ? "Login to your account"
                  : "Create account"}
              </h2>
              <button
                type="button"
                onClick={closeAuthModal}
                className="text-sm font-semibold text-gray-500 hover:text-primary"
              >
                Close
              </button>
            </div>

            <div className="mb-4 flex rounded-full bg-gray-100 p-1 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  authMode === "register"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 dark:text-gray-300"
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  authMode === "login"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 dark:text-gray-300"
                }`}
              >
                Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {authMode === "register" && (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              )}
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-4 py-2 font-semibold text-white transition hover:bg-secondary"
              >
                {authMode === "login" ? "Login" : "Register"}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
                {message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* lower navbar */}
      <div className="flex justify-center">
        <ul className="sm:flex hidden items-center gap-2">
          {Menu.map((data) => (
            <li key={data.id}>
              <a
                href={data.link}
                className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.22em] text-gray-700 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-gray-200"
              >
                {data.name}
              </a>
            </li>
          ))}
          {/* simple  dropdown and links*/}
          <li
            className="group relative 
          cursor-pointer"
          >
            <a
              href="#"
              className="flex items-center gap-[2px] py-2 text-sm font-semibold uppercase tracking-[0.22em] text-gray-700 transition-all duration-200 hover:text-primary dark:text-gray-200"
            >
              Trending products
              <span>
                <FaCaretDown
                  className="transition-all
                duration-200
                group-hover:rotate-180"
                />
              </span>
            </a>
            <div
              className=" absolute z-[9999]
            hidden 
            group-hover:block w-[150px] rounded-md
            bg-white p-2 text-black shadow-md"
            >
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="inline-block w-full rounded-md p-2 text-sm font-medium uppercase tracking-[0.18em] text-gray-700 hover:bg-primary/20 hover:text-primary dark:text-gray-800"
                    >
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
