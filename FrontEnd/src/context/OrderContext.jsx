import { createContext, useContext, useEffect, useState } from "react";
import { useSearch } from "./SearchContext";
import api from "../utils/Api";


const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
    const { token } = useSearch()
    const [sortedOrders, setsortedOrders] = useState([])
    useEffect(() => {
      async function userOrders() {
           try{

            const res =
                await api.post(
                    "/user/orders"
                );

            if (res.data.success) {

               const sorted =
                    res.data.orders.sort(
                        (a, b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    )
                 setsortedOrders(sorted)
            }
        } catch (err){
            console.log(err.message)
        }
        }
            if(token){
                userOrders()
            }
    }, [token])

    return (
        <OrderContext.Provider value={ {sortedOrders} }  >
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => useContext(OrderContext);