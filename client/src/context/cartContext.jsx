import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage and sync stock limits
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCartItems(parsed);

        // Fetch current stock from server to ensure limits are always fresh and accurate
        parsed.forEach(async (item) => {
          const prodId = item._id || item.id || item.product;
          if (prodId) {
            try {
              const res = await fetch(`http://localhost:8000/api/v1/product/get-product/${prodId}`);
              const data = await res.json();
              if (data?.success && data.product) {
                const stock = typeof data.product.quantity === "number" ? data.product.quantity : 99;
                setCartItems((prev) =>
                  prev.map((it) => {
                    const itId = it._id || it.id || it.product;
                    if (itId === prodId) {
                      const cappedQty = Math.min(stock, it.quantity);
                      return { ...it, maxStock: stock, quantity: cappedQty > 0 ? cappedQty : 1 };
                    }
                    return it;
                  })
                );
              }
            } catch (e) {
              // Ignore network errors in background sync
            }
          }
        });
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
    const availableStock = typeof product.quantity === "number" ? product.quantity : 99;

    if (availableStock <= 0) return;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.id === prodId || item._id === prodId) && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity;
        const newTotalQty = Math.min(availableStock, currentQty + quantity);
        updated[existingIndex].quantity = newTotalQty;
        updated[existingIndex].maxStock = availableStock;
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
        quantity: Math.min(availableStock, Math.max(1, quantity)),
        maxStock: availableStock
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId, size, color) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        const itId = item.id || item._id || item.product;
        return !(itId === itemId && item.size === size && item.color === color);
      })
    );
  };

  const updateQuantity = (itemId, size, color, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        const itId = item.id || item._id || item.product;
        if (itId === itemId && item.size === size && item.color === color) {
          const maxStock = typeof item.maxStock === "number" ? item.maxStock : 99;
          const cappedQty = Math.min(maxStock, Math.max(1, newQty));
          return { ...item, quantity: cappedQty, maxStock };
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
