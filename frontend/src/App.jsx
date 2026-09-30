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
import AOS from "aos";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
const HomePage = () => {
  return (
    <>
      <Hero />
      <Products />
      <TopProducts />
      <Banner />
      <Subscribe />
      <Testimonials />
      <Footer />
    </>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = React.useState(
    window.location.hash.replace("#", "") || "home",
  );

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.replace("#", "") || "home");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Cart page */}
          <Route path="/cart" element={<CartPage />} />

          {/* checkout page */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />

          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />

          {/* Product Details page */}
          <Route path="/product/:id" element={<ProductDetails />} />

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
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
