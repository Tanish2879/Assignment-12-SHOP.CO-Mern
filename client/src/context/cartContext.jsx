import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = "Medium", color = "Default") => {
    const prodId = product._id || product.id || product.product;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.id === prodId || item._id === prodId) && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem = {
        _id: prodId,
        id: prodId,
        product: prodId,
        name: product.name,
        image: `http://localhost:8000/api/v1/product/get-product-photo/${prodId}`,
        price: product.price,
        size,
        color,
        quantity,
        maxStock: product.quantity || 99
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId, size, color) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === itemId && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (itemId, size, color, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.size === size && item.color === color) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
