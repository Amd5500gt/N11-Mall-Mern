import {
  createContext,
  useContext,
  useEffect,
  useState
}
from "react";

import toast
from "react-hot-toast";

import api
from "../utils/Api";

import {
  useSearch
}
from "./SearchContext";

/* CONTEXT */

const AddressContext =
createContext();

/* PROVIDER */

export const AddressProvider =
({ children }) => {

  const [
    userAddress,
    setUserAddress
  ] = useState({});

  const {
    token
  } = useSearch();

  /* FETCH ADDRESS */

  useEffect(() => {

    const fetchAddress =
    async () => {

      try {

        const res =
        await api.get(
          "/user/address"
        );

        const data =
        res.data;

        setUserAddress(

          data.address || {}

        );

      }

      catch (err) {

        console.log(err);

        toast.error(

          err.response?.data?.message ||

          err.message ||

          "Failed to fetch address"

        );

      }

    };

    if (token) {

      fetchAddress();

    }

    else {

      setUserAddress({});

    }

  }, [token]);

  return (

    <AddressContext.Provider
      value={{

        userAddress,
        setUserAddress

      }}
    >

      {children}

    </AddressContext.Provider>

  );

};

/* HOOK */

export const useAddress =
() => useContext(AddressContext);