import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { useSearch } from './SearchContext';
import toast from 'react-hot-toast';
 import BASE_URL from "../config/config";
// Create context
const CartContext = createContext();

// Create custom hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a Cart provider");
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isLogged } = useSearch();

  let cartCount = addedItems.reduce((count, item) => {
    return count + (item.quantity || 0);
  }, 0);

  const total = addedItems.reduce((value, item) => {
    return value + (item.price || 0) * (item.quantity || 0);
  }, 0).toFixed(2);

  // Fetch cart from backend - goToCart API
  const fetchCart = useCallback(async () => {
    if (!isLogged || !token) {
      setAddedItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/cart/details`);

      if (!res.ok) throw new Error("Failed to fetch cart");

      const cart = await res.json();
      
      
      setAddedItems(cart || []);
      
    } catch (err) {
      console.error("Error fetching cart:", err);

    } finally {
      setLoading(false);
    }
  }, [token, isLogged]);

  // Load cart on mount and when auth changes
  useEffect(() => {
    if (isLogged && token) {
      fetchCart();
    } else {
      setAddedItems([]);
    }
  }, [fetchCart, isLogged, token]);

  // Add to cart - addToCart API
  const newCart = async (item) => {
    if (!isLogged) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId: item.id
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      // Refresh cart from backend after adding
      await fetchCart();
      toast.success(`Added ${item.title} to cart`);
      
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err.message || "Failed to add to cart");
    }
  };

  // Add with specific quantity - addToCart API (with quantity)
  const addWithQuantity = async (item) => {
    if (!isLogged) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      // First add the product
      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId: item.id
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

    
      if (item.quantity > 1) {
        // Call addToCart multiple times for remaining quantity
        for (let i = 1; i < item.quantity; i++) {
          await fetch(`${BASE_URL}/cart/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
              productId: item.id
            })
          });
        }
      }

      // Refresh cart from backend
      await fetchCart();
      toast.success(`Added ${item.title} to cart`);
      
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err.message || "Failed to add to cart");
    }
  };

  // Remove from cart - removeFromCart API
  const removeCart = async (item) => {
    if (!isLogged) return;

    try {
      const res = await fetch(`${BASE_URL}/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId: item.id 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove from cart");
      }

      // Refresh cart from backend after removing
      await fetchCart();
      
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error(err.message || "Failed to remove from cart");
    }
  };

  return (
    <CartContext.Provider value={{
      addedItems,
      setAddedItems,
      cartCount,
      newCart,
      removeCart,
      addWithQuantity,
      total,
      loading,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;