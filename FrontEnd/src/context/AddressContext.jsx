import {createContext,useContext,useEffect,useState} from "react";
import toast from "react-hot-toast";
import BASE_URL from "../config/config";
import { useSearch } from "./SearchContext";


const AddressContext = createContext()
export const AddressProvider = ({children}) => {

    const [userAddress, setUserAddress] = useState({});
    const { token ,apiRequest } = useSearch()

    useEffect(() => {
        const fetchAddress = async () => {
                try {
               apiRequest()
                    const res =await fetch(`${BASE_URL}/user/address`, {
                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );

                    const data =
                        await res.json();

                    if (!res.ok) {

                        toast.error(
                            data.message ||
                            "Failed to fetch address"
                        );

                        return;
                    }

                    setUserAddress(
                        data.address || {}
                    );

                } catch (err) {

                    console.log(err);

                    toast.error(
                        "Something went wrong"
                    );
                }
            };

        if (token) {
            fetchAddress();
        }

    }, [token]);


  return (

    <AddressContext.Provider
      value={{
         userAddress,setUserAddress
      }}
    >

      {children}

    </AddressContext.Provider>

  );

};


export const useAddress = () =>
  useContext(AddressContext);