import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import './css/main.css'
import OpenPrev from './pages/openPrev';
import Products from './pages/Products';
import AddCart from './pages/AddCart';
import Payments from './PayPage'
import ErrorPage from './ErrorPage';
import Layout from './Layout';
import { useEffect } from 'react'
import UseCart from './RootPage';
import LoginPage from './User/LoginPage';
import RegisterPage from './User/RegisterPage';
import ForgetPass from './User/ForgetPass';


const App = () => {

  const { addedItems, setAddedItems, cartCount, newCart, removeCart, addWithQuantity, total, findItems } = useContext(UseCart)
  const [user,setUser] = useState()
  useEffect(() => {
    const data = localStorage.getItem("cart")
    if (data) {
      setAddedItems(JSON.parse(data))
    }
  }, [])

  useEffect(() => {
    if (addedItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(addedItems))
    }
  }, [addedItems])





  return (
    <div>
      <Routes>
        <Route element={<Layout cartCount={cartCount} findItems={findItems} user = {user} />}>
          <Route
            path='/'
            element={<Products newCart={newCart} FindItems={findItems} />}
          />

          <Route
            path='/product/:id'
            element={<OpenPrev cartCount={cartCount} newCart={newCart} addWithQuantity={addWithQuantity} />}
          />

          <Route
            path='/cart'
            element={
              <AddCart
                addedItems={addedItems}
                newCart={newCart}
                setAddedItems ={setAddedItems}
                removeCart={removeCart}
                total={total}
              />
            }
          />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgetpassword' element={<ForgetPass />} />
          <Route path='/*' element={<ErrorPage />} />
          <Route path='/products/*' element={<ErrorPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Route>
        <Route
          path='/cart/payment'
          element={<Payments total={total} />}
        />
      </Routes>

    </div>
  )
}

export default App