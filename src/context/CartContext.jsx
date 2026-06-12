/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  // -----------------------------
  // CART STATE
  // -----------------------------
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.map(({ quantity, ...rest }) => rest);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  // -----------------------------
  // FAVORITES STATE
  // -----------------------------
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);


  // -----------------------------
  // ✅ ORDERS STATE
  // -----------------------------
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("orders");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);


  // -----------------------------
  // CART FUNCTIONS
  // -----------------------------
  const addToCart = (book) => {
    setCart((prev) => {
      if (prev.some((item) => item.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.length;
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);


  // -----------------------------
  // FAVORITES FUNCTIONS
  // -----------------------------
  const addToFavorites = (book) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((item) => item.id === book.id);
      if (isAlreadyFavorite) return prev.filter((item) => item.id !== book.id);
      return [...prev, book];
    });
  };

  const removeFromFavorites = (bookId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== bookId));
  };

  const isFavorite = (bookId) => {
    return favorites.some((item) => item.id === bookId);
  };


  // -----------------------------
  // ✅ ORDERS FUNCTIONS
  // -----------------------------

  // Appelée depuis Checkout.jsx au moment du paiement
  const addOrder = (cartItems, total) => {
    const newOrder = {
      id: `OMB-${Date.now()}`,           // ID unique basé sur le timestamp
      created_at: new Date().toISOString(),
      status: "pending",                  // pending → delivered (à faire évoluer)
      total: total,
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        price: item.price,
        cover_image: item.cover || item.cover_image || null,
        quantity: 1,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]); // plus récente en premier
    return newOrder;
  };

  const clearOrders = () => setOrders([]);


  // -----------------------------
  // PROVIDER
  // -----------------------------
  return (
    <CartContext.Provider
      value={{
        // Cart
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        clearCart,
        // Favorites
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        // ✅ Orders
        orders,
        addOrder,
        clearOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}