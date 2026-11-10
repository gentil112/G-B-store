import React, { useState, useEffect } from "react";
import { FaCartShopping } from "react-icons/fa6";
import {
  FiChevronDown,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiUser,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import DarkMode from "./DarkMode";
import { useAuth } from "../../context/AuthContext";
import { apiCall } from "../../hooks/useApi";
import { useCart } from "../../context/CartContext";
const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Shop all", link: "/products" },
  { id: 3, name: "Featured", link: "/#products" },
];
const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <div className="relative z-50 border-b border-[#b99467]/20 bg-[#fffefa] text-gray-900 shadow-[0_8px_30px_rgba(55,35,20,0.06)] dark:border-white/10 dark:bg-gray-950 dark:text-white">
      <div className="border-b border-[#b99467]/15 bg-[#f7f1e8] py-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.24em] text-[#816345] dark:border-white/5 dark:bg-[#211d19] dark:text-[#d4ad7e] sm:text-[10px]">
        Thoughtfully chosen · effortlessly yours
      </div>
      <header className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex min-h-[72px] items-center justify-between gap-2 sm:min-h-[82px] sm:gap-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4 lg:gap-10">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls={isMobileMenuOpen ? "mobile-navigation" : undefined}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b99467]/20 text-[#514332] transition hover:border-primary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden dark:text-[#f5efe6]"
            >
              {isMobileMenuOpen ? <FiX size={19} /> : <FiMenu size={19} />}
            </button>
            <Link
              to="/"
              aria-label="G&B Store home"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex shrink-0 items-center gap-2.5 sm:gap-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-black text-white shadow-[0_4px_12px_rgba(237,137,0,0.28)] sm:h-10 sm:w-10 sm:text-sm">
                G&B
              </span>
              <span>
                <span className="block whitespace-nowrap text-[13px] font-black tracking-[0.2em] text-gray-900 dark:text-white sm:text-base sm:tracking-[0.28em]">STORE</span>
                <span className="mt-0.5 hidden text-[8px] uppercase tracking-[0.2em] text-gray-400 sm:block">Everyday, considered</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {Menu.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600 transition hover:bg-primary/10 hover:text-secondary dark:text-gray-300 dark:hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className="group relative inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#b99467]/25 bg-[#fbf9f5] px-3 text-[#514332] transition hover:border-primary hover:bg-primary/10 hover:text-secondary sm:px-4 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <FaCartShopping className="text-[15px] transition-transform group-hover:-rotate-6 sm:text-base" />
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] sm:inline">Bag</span>

              {cartCount > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-1 text-[9px] font-bold text-white shadow-sm"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                aria-label={isAuthenticated ? `Account menu for ${user?.name || "you"}` : "Account menu"}
                aria-haspopup="true"
                aria-expanded={isAccountMenuOpen}
                className="flex h-10 items-center gap-2 rounded-full border border-[#b99467]/25 px-2.5 text-xs font-semibold text-[#514332] transition hover:border-primary hover:bg-primary/10 hover:text-secondary sm:px-3 dark:border-white/10 dark:text-white"
              >
                <FiUser size={15} />
                <span className="hidden max-w-[100px] truncate sm:inline">{isAuthenticated ? user?.name || "Account" : "Account"}</span>
                <FiChevronDown className={`hidden transition-transform sm:block ${isAccountMenuOpen ? "rotate-180" : ""}`} size={13} />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 z-[10000] mt-3 w-72 overflow-hidden border border-[#b99467]/30 bg-[#fffefa] py-2 shadow-[0_22px_60px_rgba(55,35,20,0.16)] dark:border-white/10 dark:bg-[#211e1a]">
                  {isAuthenticated ? (
                    <>
                      <div className="border-b border-[#b99467]/20 bg-[#f7f4ef] px-5 py-4 dark:border-white/10 dark:bg-[#29251f]">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#927650] dark:text-[#c6a77d]">
                          Member account
                        </p>
                        <p className="mt-1 truncate font-serif text-lg text-[#29241e] dark:text-[#f3eee6]">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          navigate("/my-orders");
                        }}
                        className="group flex w-full items-center gap-3 border-l-2 border-transparent px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#f7f4ef] hover:text-[#765b3c] focus-visible:border-[#927650] focus-visible:bg-[#f7f4ef] focus-visible:outline-none dark:text-[#e8d8c3] dark:hover:bg-white/[0.04] dark:hover:text-[#e2c6a2] dark:focus-visible:bg-white/[0.04]"
                      >
                        <FiPackage
                          className="shrink-0 text-base text-[#927650] dark:text-[#c6a77d]"
                          aria-hidden="true"
                        />
                        <span>My orders</span>
                      </button>
                      {user?.role === "admin" && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            navigate("/admin");
                          }}
                          className="group flex w-full items-center gap-3 border-l-2 border-transparent px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#f7f4ef] hover:text-[#765b3c] focus-visible:border-[#927650] focus-visible:bg-[#f7f4ef] focus-visible:outline-none dark:text-[#e8d8c3] dark:hover:bg-white/[0.04] dark:hover:text-[#e2c6a2] dark:focus-visible:bg-white/[0.04]"
                        >
                          <FiGrid
                            className="shrink-0 text-base text-[#927650] dark:text-[#c6a77d]"
                            aria-hidden="true"
                          />
                          <span>Admin dashboard</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="group flex w-full items-center gap-3 border-l-2 border-transparent px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#f7f4ef] hover:text-[#765b3c] focus-visible:border-[#927650] focus-visible:bg-[#f7f4ef] focus-visible:outline-none dark:text-[#e8d8c3] dark:hover:bg-white/[0.04] dark:hover:text-[#e2c6a2] dark:focus-visible:bg-white/[0.04]"
                      >
                        <FiUser
                          className="shrink-0 text-base text-[#927650] dark:text-[#c6a77d]"
                          aria-hidden="true"
                        />
                        <span>View profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                          // Dispatch logout event to update other components
                          window.dispatchEvent(new Event("user-logout"));
                          navigate("/", {
                            replace: true,
                            state: { logoutSuccess: true },
                          });
                        }}
                        className="group mt-1 flex w-full items-center gap-3 border-t border-[#b99467]/20 border-l-2 border-l-transparent px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71685e] transition-colors hover:border-l-[#9c5145] hover:bg-[#f8f0ed] hover:text-[#8d4035] focus-visible:border-l-[#9c5145] focus-visible:bg-[#f8f0ed] focus-visible:outline-none dark:border-white/10 dark:text-[#c4bbb0] dark:hover:bg-red-950/20 dark:hover:text-[#e6a49a] dark:focus-visible:bg-red-950/20"
                      >
                        <FiLogOut
                          className="shrink-0 text-base"
                          aria-hidden="true"
                        />
                        <span>Log out</span>
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
                        className="block w-full border-l-2 border-transparent px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#f7f4ef] hover:text-[#765b3c] focus-visible:border-[#927650] focus-visible:outline-none dark:text-[#e8d8c3] dark:hover:bg-white/[0.04] dark:hover:text-[#e2c6a2]"
                      >
                        Register
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          window.location.hash = "login";
                        }}
                        className="block w-full border-l-2 border-transparent px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514332] transition-colors hover:border-[#927650] hover:bg-[#f7f4ef] hover:text-[#765b3c] focus-visible:border-[#927650] focus-visible:outline-none dark:text-[#e8d8c3] dark:hover:bg-white/[0.04] dark:hover:text-[#e2c6a2]"
                      >
                        Login
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <DarkMode />
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-[#b99467]/15 pb-5 pt-3 lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {Menu.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-3.5 text-sm font-semibold text-gray-800 transition hover:text-secondary dark:text-gray-100 ${
                    index < Menu.length - 1 ? "border-b border-black/[0.05] dark:border-white/[0.06]" : ""
                  }`}
                >
                  {item.name}
                  <span className="text-primary" aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f7f1e8] px-4 py-3 dark:bg-white/5">
              <span>
                <span className="block text-xs font-semibold text-gray-800 dark:text-white">Appearance</span>
                <span className="mt-0.5 block text-[10px] text-gray-500 dark:text-gray-400">Choose your preferred theme</span>
              </span>
              <DarkMode />
            </div>
          </div>
        )}
      </header>
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

    </div>
  );
};

export default Navbar;
