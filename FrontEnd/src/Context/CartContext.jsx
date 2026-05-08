import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect
} from "react";

import { useSearch } from "./SearchContext";
import toast from "react-hot-toast";
import BASE_URL from "../config/config";

// Create Context
const CartContext = createContext();

// Custom Hook
export const useCart = () => {

  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;

};

// Provider
export const CartProvider = ({ children }) => {

  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, isLogged } = useSearch();

  // Cart Count
  const cartCount = Array.isArray(addedItems)
    ? addedItems.reduce((count, item) => {
        return count + (item.quantity || 0);
      }, 0)
    : 0;

  // Total Price
  const total = Number(
    (
      Array.isArray(addedItems)
        ? addedItems.reduce((value, item) => {
            return (
              value +
              (item.price || 0) *
              (item.quantity || 0)
            );
          }, 0)
        : 0
    ).toFixed(2)
  );

  // Fetch Cart
  const fetchCart = useCallback(async () => {

    if (!isLogged || !token) {
      setAddedItems([]);
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/cart/details`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await res.json();

      setAddedItems(data.cart || []);

    } catch (err) {

      console.error(
        "Error fetching cart:",
        err
      );

      setAddedItems([]);

    } finally {

      setLoading(false);

    }

  }, [token, isLogged]);

  // Load Cart
  useEffect(() => {

    if (isLogged && token) {
      fetchCart();
    } else {
      setAddedItems([]);
    }

  }, [fetchCart, isLogged, token]);

  // Add To Cart
  const newCart = async (item) => {

    if (!isLogged) {
      toast.error(
        "Please login to add items to cart"
      );
      return;
    }

    try {

      const res = await fetch(
        `${BASE_URL}/cart/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify({
            productId: item.id
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to add to cart"
        );
      }

      await fetchCart();

      toast.success(
        `Added ${item.title} to cart`
      );

    } catch (err) {

      console.error(
        "Error adding to cart:",
        err
      );

      toast.error(
        err.message ||
        "Failed to add to cart"
      );

    }

  };

  // Add With Quantity
  const addWithQuantity = async (item) => {

    if (!isLogged) {
      toast.error(
        "Please login to add items to cart"
      );
      return;
    }

    try {

      const res = await fetch(
        `${BASE_URL}/cart/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify({
            productId: item.id,
            quantity: item.quantity || 1
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to add to cart"
        );
      }

      await fetchCart();

      toast.success(
        `Added ${item.title} to cart`
      );

    } catch (err) {

      console.error(
        "Error adding to cart:",
        err
      );

      toast.error(
        err.message ||
        "Failed to add to cart"
      );

    }

  };

  // Remove Cart
  const removeCart = async (item) => {

    if (!isLogged) return;

    try {

      const res = await fetch(
        `${BASE_URL}/cart/remove`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify({
            productId: item.id
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to remove from cart"
        );
      }

      await fetchCart();

    } catch (err) {

      console.error(
        "Error removing from cart:",
        err
      );

      toast.error(
        err.message ||
        "Failed to remove from cart"
      );

    }

  };

  return (

    <CartContext.Provider
      value={{
        addedItems,
        setAddedItems,
        cartCount,
        total,
        loading,
        fetchCart,
        newCart,
        addWithQuantity,
        removeCart
      }}
    >

      {children}

    </CartContext.Provider>

  );

};

export default CartContext;