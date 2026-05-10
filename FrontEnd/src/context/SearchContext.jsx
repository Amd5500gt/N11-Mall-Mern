import React,{
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
}
from "react";

import toast from "react-hot-toast";

import BASE_URL from "../config/config";

import {
  useNavigate
}
from "react-router-dom";

const SearchContext =
createContext();

export const SearchProvider =
({ children }) => {

  const navigate =
  useNavigate();

  /* GLOBAL API */

  const [apiLoading,
    setApiLoading] =
    useState(false);

  const requestRunning =
    useRef(false);

  /* PRODUCTS */

  const [data,setData] =
    useState([]);

  const [
    filterData,
    setFilterData
  ] = useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [total,
    setTotal] =
    useState(0);

  const limit = 12;

  /* SEARCH */

  const [
    searchTerm,
    setSearchTerm
  ] = useState("");

  /* AUTH */

  const [token,
    setToken] =
    useState(
      localStorage.getItem(
        "jwtToken"
      ) || null
    );

  const isLogged =
    !!token;

  /* USER */

  const [
    userData,
    setUserData
  ] = useState({
    name:"",
    email:"",
    picture:"",
    address:[],
    cart:[]
  });

  /* API REQUEST */

  const apiRequest =
  async (callback) => {

    // BLOCK MULTIPLE REQUESTS

    if (
      requestRunning.current
    ) return;

    try {

      requestRunning.current =
        true;

      setApiLoading(true);

      await callback();

    }

    catch (err) {

      console.log(err);

    }

    finally {

      setApiLoading(false);

      requestRunning.current =
        false;

    }

  };

  /* FETCH PRODUCTS */

  useEffect(() => {

    const fetchProducts =
    async () => {

      apiRequest(

        async () => {

          setLoading(true);

          try {

            const url =
              token
              ? `${BASE_URL}/products`
              : `${BASE_URL}/products/demo`;

            const response =
              await fetch(url,{

                headers: token
                ? {
                    Authorization:
                    `Bearer ${token}`
                  }
                : {},

              });

            if (
              !response.ok
            ) {

              throw new Error(
                "Failed to fetch products"
              );

            }

            const json =
              await response.json();

            setData(
              json.products || []
            );

            setFilterData(
              json.products || []
            );

            setTotal(
              json.total || 0
            );

          }

          catch (err) {

            console.log(err);

            setData([]);

            setFilterData([]);

            setTotal(0);

          }

          finally {

            setLoading(false);

          }

        }

      );

    };

    fetchProducts();

  }, [token]);

  /* SYNC TOKEN */

  useEffect(() => {

    const handleStorage =
    () => {

      setToken(
        localStorage.getItem(
          "jwtToken"
        )
      );

    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorage
      );

    };

  }, []);

  /* LOAD USER */

  useEffect(() => {

    if (!token) return;

    try {

      const user =
      JSON.parse(
        localStorage.getItem(
          "loggedInUser"
        )
      );

      if (user) {

        setUserData(user);

        const welcomeShown =
        localStorage.getItem(
          "welcomeToastShown"
        );

        if (
          welcomeShown !== "true"
        ) {

          toast.success(
            `Welcome back, ${user.name}!`
          );

          localStorage.setItem(
            "welcomeToastShown",
            "true"
          );

        }

      }

    }

    catch (err) {

      console.log(err);

    }

  }, [token]);

  /* SEARCH FILTER */

  useEffect(() => {

    if (
      !searchTerm.trim()
    ) {

      setFilterData(data);

      return;

    }

    const filtered =
    data.filter((item) =>

      item.title
      ?.toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )

    );

    setFilterData(filtered);

  }, [searchTerm,data]);

  /* LOGOUT */

  const handleLogout =
  () => {

    localStorage.removeItem(
      "jwtToken"
    );

    localStorage.removeItem(
      "loggedInUser"
    );

    localStorage.removeItem(
      "welcomeToastShown"
    );

    setToken(null);

    setUserData({
      name:"",
      email:"",
      picture:"",
      address:[],
      cart:[]
    });

    toast.success(
      "Logged out successfully"
    );

    setTimeout(() => {

      navigate("/auth");

    }, 1500);

  };

  return (

    <SearchContext.Provider
      value={{

        /* SEARCH */

        searchTerm,
        setSearchTerm,

        /* PRODUCTS */

        data,
        filterData,
        total,
        loading,
        limit,

        setData,
        setFilterData,
        setTotal,
        setLoading,

        /* AUTH */

        token,
        setToken,
        isLogged,

        /* USER */

        userData,
        setUserData,

        /* API */

        apiLoading,
        apiRequest,

        /* LOGOUT */

        handleLogout,
      }}
    >

      {children}

      {
        apiLoading && (

          <div className="nxc-global-loading">

            <div className="nxc-loading-box">

              <div className="nxc-spinner"></div>

              <p>
                Please wait...
              </p>

            </div>

          </div>

        )
      }

    </SearchContext.Provider>

  );

};

export const useSearch =
() => useContext(SearchContext);