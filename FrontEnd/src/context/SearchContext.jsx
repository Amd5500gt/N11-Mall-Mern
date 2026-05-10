import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import BASE_URL from "../config/config";
import { useNavigate } from "react-router-dom";

const SearchContext =
  createContext();

export const SearchProvider =
({ children }) => {
 
  /* PRODUCTS */
  const navigate = useNavigate()
  const [data, setData] =
    useState([]);
 const[apiLoading,setApiLoading]= useState(false)
  const [filterData,
    setFilterData] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [total, setTotal] =
    useState(0);

  const limit = 12;

  /* SEARCH */

  const [searchTerm,
    setSearchTerm] =
    useState("");

  /* AUTH */

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "jwtToken"
      ) || null
    );

  const isLogged = !!token;

  /* USER */

  const [userData,
    setUserData] =
    useState({
      name: "",
      email: "",
      picture: "",
      address: [],
      cart: [],
    });

  /* FETCH PRODUCTS */

  useEffect(() => {

    const fetchProducts =
      async () => {

        setLoading(true);

        try {

          const url = token
            ? `${BASE_URL}/products`
            : `${BASE_URL}/products/demo`;

          const response =
            await fetch(url, {
              headers: token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {},
            });

          if (!response.ok) {
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

        } catch (err) {

          console.log(err);

          setData([]);

          setFilterData([]);

          setTotal(0);

        } finally {

          setLoading(false);
        }
      };

    fetchProducts();

  }, [token]);
useEffect(() => {

  const start = () =>
    setApiLoading(true)

  const end = () =>
    setApiLoading(false)

  window.addEventListener(
    "api-loading-start",
    start
  )

  window.addEventListener(
    "api-loading-end",
    end
  )

  return () => {

    window.removeEventListener(
      "api-loading-start",
      start
    )

    window.removeEventListener(
      "api-loading-end",
      end
    )

  }

}, [])
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
        
          setTimeout(() => {
              toast.success(
            `Welcome back, ${user.name}!`
          );
          }, 1500);
        

          localStorage.setItem(
            "welcomeToastShown",
            "true"
          );
        }
      }

    } catch (err) {

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

  }, [searchTerm, data]);

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
        name: "",
        email: "",
        picture: "",
        address: [],
        cart: [],
      });

      toast.success(
        "Logged out successfully"
      );
     setTimeout(() => {
      navigate("/auth")
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

        apiLoading,
        setApiLoading,
        /* USER */

        userData,
        setUserData,

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