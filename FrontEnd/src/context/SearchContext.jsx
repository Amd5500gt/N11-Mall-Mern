import React, {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

import toast from "react-hot-toast";
import BASE_URL from "../config/config";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [skip, setSkip] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [total, setTotal] = useState(0);

  const limit = 12;

  const [searchTerm, setSearchTerm] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("jwtToken")
  );

  const isLogged = !!token;

  // User Data
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    picture: "",
    address: "",
    cart: [],
  });

  // Fetch Products
  useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      try {
        const url = token
          ? `${BASE_URL}/products`
          : `${BASE_URL}/products/demo`;

        const response = await fetch(url, {
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        });

        if (!response.ok) {
          throw new Error("API Error");
        }

        const json = await response.json();

        setData(json.products || []);
        setFilterData(json.products || []);
        setTotal(json.total || 0);
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

  // Sync Token
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("jwtToken"));
    };

    window.addEventListener("storage", handleStorage);

    return () =>
      window.removeEventListener(
        "storage",
        handleStorage
      );
  }, []);

  // Load User
  useEffect(() => {
    if (token) {
      const user = JSON.parse(
        localStorage.getItem("loggedInUser")
      );

      if (user) {
        setUserData(user);
        console.log(userData)

        if ( 
          localStorage.getItem(
            "welcomeToastShown"
          ) !== "true"
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
  }, [token]);

  // Search Filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilterData(data);
      return;
    }

    const filtered = data.filter((item) =>
      item.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilterData(filtered);
  }, [searchTerm, data]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("welcomeToastShown");

    setToken(null);

    setUserData({
      name: "",
      email: "",
      picture: "",
      address: "",
      cart: [],
    });

    toast.success("Logged out successfully");
  };

  return (
    <SearchContext.Provider
      value={{
        // Search
        searchTerm,
        setSearchTerm,

        // Products
        data,
        filterData,
        total,
        loading,
        skip,
        limit,

        setData,
        setLoading,
        setSkip,
        setFilterData,
        setTotal,

        // Auth
        token,
        setToken,
        isLogged,

        // User
        userData,
        setUserData,

        // Logout
        handleLogout,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () =>
  useContext(SearchContext);