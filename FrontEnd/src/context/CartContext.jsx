import React,{
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect
}
from "react";

import {
  useSearch
}
from "./SearchContext";

import toast from "react-hot-toast";

import BASE_URL from "../config/config";

/* CONTEXT */

const CartContext =
createContext();

/* HOOK */

export const useCart = () => {

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
    setUserData,

    apiRequest

  } = useSearch();

  /* CART */

  const [
    addedItems,
    setAddedItems
  ] = useState(
    userData?.cart || []
  );

  /* SYNC CART */

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

            return (

              value +

              (item.price || 0) *

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

    apiRequest(

      async () => {

        try {

          setLoading(true);

          const res =
          await fetch(
            `${BASE_URL}/user/cart`,
            {

              headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
              }

            }
          );

          if (!res.ok) {

            throw new Error(
              "Failed to fetch cart"
            );

          }

          const data =
          await res.json();

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

      }

    );

  }, [
    token,
    isLogged,
    setUserData,
    apiRequest
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

    apiRequest(

      async () => {

        try {

          const res =
          await fetch(
            `${BASE_URL}/user/cart/add`,
            {

              method:"POST",

              headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
              },

              body:JSON.stringify({
                productId:item.id
              })

            }
          );

          const data =
          await res.json();

          if (!res.ok) {

            throw new Error(

              data.message ||

              "Failed to add to cart"

            );

          }

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
            err.message ||
            "Failed to add to cart"
          );

        }

      }

    );

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

    apiRequest(

      async () => {

        try {

          const res =
          await fetch(
            `${BASE_URL}/user/cart/add`,
            {

              method:"POST",

              headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
              },

              body:JSON.stringify({
                productId:item.id,
                quantity:
                item.quantity || 1
              })

            }
          );

          const data =
          await res.json();

          if (!res.ok) {

            throw new Error(

              data.message ||

              "Failed to add to cart"

            );

          }

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
            err.message ||
            "Failed to add to cart"
          );

        }

      }

    );

  };

  /* REMOVE QUANTITY */

  const removeCart =
  async (item) => {

    if (!isLogged) return;

    apiRequest(

      async () => {

        try {

          const res =
          await fetch(
            `${BASE_URL}/user/cart/remove`,
            {

              method:"POST",

              headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
              },

              body:JSON.stringify({
                productId:item.id
              })

            }
          );

          const data =
          await res.json();

          if (!res.ok) {

            throw new Error(

              data.message ||

              "Failed to remove item"

            );

          }

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
            err.message ||
            "Failed to remove item"
          );

        }

      }

    );

  };

  /* DELETE ITEM */

  const deleteCart =
  async (item) => {

    if (!isLogged) return;

    apiRequest(

      async () => {

        try {

          const res =
          await fetch(
            `${BASE_URL}/user/cart/delete`,
            {

              method:"POST",

              headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
              },

              body:JSON.stringify({
                productId:item.id
              })

            }
          );

          const data =
          await res.json();

          if (!res.ok) {

            throw new Error(

              data.message ||

              "Failed to delete item"

            );

          }

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
            err.message ||
            "Failed to delete item"
          );

        }

      }

    );

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

      }}
    >

      {children}

    </CartContext.Provider>

  );

};

export default CartContext;