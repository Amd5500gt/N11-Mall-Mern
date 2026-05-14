import React,{
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect
}
from "react";

import api
from "../utils/Api";

import {
  useSearch
}
from "./SearchContext";

import toast
from "react-hot-toast";

/* CONTEXT */

const CartContext =
createContext();

/* HOOK */

export const useCart =
() => {

  const context =
  useContext(CartContext);

  if (!context) {

    throw new Error(
      "useCart must be used within CartProvider"
    );

  }

  return context;

};

/* PROVIDER */

export const CartProvider =
({ children }) => {

  const [loading,
    setLoading] =
    useState(false);

  const {

    token,
    isLogged,

    userData,
    setUserData

  } = useSearch();

  /* CART */

  const [
    addedItems,
    setAddedItems
  ] = useState(
    userData?.cart || []
  );

  /* SYNC */

  useEffect(() => {

    setAddedItems(
      userData?.cart || []
    );

  }, [userData]);

  /* CART COUNT */

  const cartCount =
  Array.isArray(addedItems)

  ? addedItems.reduce(
      (count,item) => {

        return (
          count +
          (item.quantity || 0)
        );

      }, 0
    )

  : 0;

  /* TOTAL */

  const total = Number(

    (
      Array.isArray(addedItems)

      ? addedItems.reduce(
          (value,item) => {

            const price = Number(item.price || 0);
            const discount = Number(item.discountPercentage || 0);
            const discountedPrice = price * (1 - discount / 100);

            return (

              value +

              discountedPrice *

              (item.quantity || 0)

            );

          }, 0
        )

      : 0

    ).toFixed(2)

  );

  /* FETCH CART */

  const fetchCart =
  useCallback(async () => {

    if (
      !isLogged ||
      !token
    ) {

      setAddedItems([]);

      setUserData((prev) => ({
        ...prev,
        cart:[]
      }));

      return;

    }

    try {

      setLoading(true);

      const res =
      await api.get(
        "/user/cart"
      );

      const data =
      res.data;

      setAddedItems(
        data.cart || []
      );

      /* SYNC */

      setUserData((prev) => ({
        ...prev,
        cart:data.cart || []
      }));

    }

    catch (err) {

      console.error(
        "Error fetching cart:",
        err
      );

      setAddedItems([]);

    }

    finally {

      setLoading(false);

    }

  }, [
    token,
    isLogged,
    setUserData
  ]);

  /* LOAD CART */

  useEffect(() => {

    if (
      isLogged &&
      token
    ) {

      fetchCart();

    }

    else {

      setAddedItems([]);

      setUserData((prev) => ({
        ...prev,
        cart:[]
      }));

    }

  }, [
    fetchCart,
    isLogged,
    token,
    setUserData
  ]);

  /* ADD TO CART */

  const newCart =
  async (item) => {

    if (!isLogged) {

      toast.error(
        "Please login to add items to cart"
      );

      return;

    }

    try {

      await api.post(
        "/user/cart/add",
        {
          productId:item.id
        }
      );

      await fetchCart();

      toast.success(
        `Added ${item.title}`
      );

    }

    catch (err) {

      console.error(
        "Error adding to cart:",
        err
      );

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Failed to add to cart"

      );

    }

  };

  /* ADD WITH QUANTITY */

  const addWithQuantity =
  async (item) => {

    if (!isLogged) {

      toast.error(
        "Please login to add items to cart"
      );

      return;

    }

    try {

      await api.post(
        "/user/cart/add",
        {
          productId:item.id,
          quantity:
          item.quantity || 1
        }
      );

      await fetchCart();

      toast.success(
        `Added ${item.title}`
      );

    }

    catch (err) {

      console.error(
        "Error adding to cart:",
        err
      );

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Failed to add to cart"

      );

    }

  };

  /* REMOVE QUANTITY */

  const removeCart =
  async (item) => {

    if (!isLogged) return;

    try {

      await api.post(
        "/user/cart/remove",
        {
          productId:item.id
        }
      );

      await fetchCart();

      toast.success(
        `Removed ${item.title}`
      );

    }

    catch (err) {

      console.error(
        "Error removing item:",
        err
      );

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Failed to remove item"

      );

    }

  };

  /* DELETE Cart */
const clearCart = async() => {
try {

      await api.post(
        "/user/cart/deleteall");
   setAddedItems([]);
   localStorage.removeItem("cartItems");

    }

    catch (err) {

      console.error(
        "Error deleting item:",
        err
      );
    }};

      /* DELETE ITEM */
  const deleteCart =
  async (item) => {

    if (!isLogged) return;

    try {

      await api.post(
        "/user/cart/delete",
        {
          productId:item.id
        }
      );

      await fetchCart();

      toast.success(
        `${item.title} removed`
      );

    }

    catch (err) {

      console.error(
        "Error deleting item:",
        err
      );

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Failed to delete item"

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

        removeCart,
        deleteCart,
        clearCart

      }}
    >

      {children}

    </CartContext.Provider>

  );

};

export default CartContext;