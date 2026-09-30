import React, { createContext, useContext, useEffect, useState } from "react";

// Create the Cart Context
const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
  // Store cart products
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });
  // Save cart whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems((previousItems) => {
      // Check if product already exists
      const existingProduct = previousItems.find(
        (item) => item._id === product._id,
      );

      // If product already exists, increase quantity
      if (existingProduct) {
        return previousItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      // If product doesn't exist, add it
      return [
        ...previousItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((previousItems) =>
      previousItems.filter((item) => item._id !== productId),
    );
  };
  // clear the entire cart
  // Clear the entire cart

  const clearCart = () => {
    setCartItems([]);
  };

  // Increase product quantity
  const increaseQuantity = (productId) => {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  // Decrease product quantity
  const decreaseQuantity = (productId) => {
    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          item._id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart
export const useCart = () => {
  return useContext(CartContext);
};
