import React from "react";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/products/Products";
import Testimonials from "./components/Testimonials/Testimonials";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Footer from "./components/Footer/Footer";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetails from "./pages/ProductDetails";
import ProductsPage from "./pages/ProductsPage";
import AOS from "aos";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const statusMessage = location.state?.logoutSuccess
    ? "You have been logged out."
    : location.state?.loginSuccess
      ? location.state.userName
        ? `Welcome back, ${location.state.userName}.`
        : "You're signed in."
      : "";

  React.useEffect(() => {
    if (!statusMessage) return undefined;

    const timer = window.setTimeout(
      () => navigate("/", { replace: true, state: null }),
      5000,
    );
    return () => window.clearTimeout(timer);
  }, [navigate, statusMessage]);

  return (
    <>
      {statusMessage && (
        <div
          className="fixed right-4 top-20 z-50 max-w-sm border border-[#c6a77d]/50 bg-[#fbf9f5] px-5 py-4 text-sm text-[#29241e] shadow-xl dark:bg-[#211e1a] dark:text-[#f3eee6] sm:right-6 sm:top-24"
          role="status"
          aria-live="polite"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#927650] dark:text-[#c6a77d]">
            G&B Store
          </p>
          <p className="mt-1">{statusMessage}</p>
        </div>
      )}
      <Hero />
      <Products />
      <TopProducts />
      <Banner />
      <div className="bg-[#fcfaf7] pb-16 transition-colors duration-300 dark:bg-gray-950">
        <Subscribe />
        <Testimonials />
      </div>
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const currentPage = location.hash.replace("#", "") || "home";
  const isRegisterPage = currentPage === "register";
  const isLoginPage = currentPage === "login";
  const isProfilePage = currentPage === "profile";

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });

    AOS.refresh();
  }, []);

  return (
    <Routes>
          {/* Authentication page used by protected routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Cart page */}
          <Route path="/cart" element={<CartPage />} />

          {/* checkout page */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />

          {/* Product Details page */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* All products page */}
          <Route
            path="/products"
            element={
              <>
                <Navbar />
                <ProductsPage />
                <Footer />
              </>
            }
          />

          {/* Everything else */}
          <Route
            path="*"
            element={
              <div>
                {!isRegisterPage && !isLoginPage && !isProfilePage && (
                  <Navbar />
                )}

                {isRegisterPage ? (
                  <RegisterPage />
                ) : isLoginPage ? (
                  <LoginPage />
                ) : isProfilePage ? (
                  <ProfilePage />
                ) : (
                  <HomePage />
                )}
              </div>
            }
          />
    </Routes>
  );
};

const App = () => (
  <CartProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </CartProvider>
);

export default App;
