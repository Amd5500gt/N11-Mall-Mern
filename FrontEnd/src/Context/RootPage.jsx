
import React from "react"; 
import { useState } from "react";


const UseCart = React.createContext();
export default UseCart;

const Cart = ({children}) =>{
  const [addedItems, setAddedItems] = useState([])
  let cartCount = addedItems.reduce((count, item) => {
    return count + item.quantity
  }, 0)
    const total = addedItems.reduce((value, item) => {
      return (value + item.price * item.quantity)
    }, 0).toFixed(2)

    
    function newCart(item) {
    setAddedItems((prev) => {
      const existItems = prev.find(p => p.id == item.id)
      if (existItems) {
        return prev.map(p =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }
      else {
        return [...prev, { ...item, quantity: 1 }]
      }
    })
  }
    function removeCart(item) {
    setAddedItems((prev) => {
      const existItems = prev.find(p => p.id === item.id)
      if (existItems.quantity === 1) {
        return prev.filter((p) => p.id !== item.id)
      }
      else {
        return prev.map(p => (
          p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p
        ))
      }
    })
  }
  
function addWithQuantity(item) {
  setAddedItems((prev) => {
    const exist = prev.find(p => p.id === item.id)

    if (exist) {
      return prev.map(p =>
        p.id === item.id
          ? { ...p, quantity: p.quantity + item.quantity } // ✅ use selected quantity
          : p
      )
    } else {
      return [...prev, item] // already has quantity
    }
  })
}

    return (

     <UseCart.Provider value={{addedItems,setAddedItems,cartCount,newCart,removeCart,addWithQuantity,total}}>
     {children}
     </UseCart.Provider>

    )
}
export {Cart}