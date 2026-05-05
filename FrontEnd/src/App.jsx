import React, { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Route, Routes } from 'react-router-dom';

import About from './pages/About';
import Contact from './pages/Contact';
import './css/main.css';
import OpenPrev from './pages/openPrev';
import Products from './pages/Products';
import AddCart from './pages/AddCart';
import Payments from './PayPage';
import ErrorPage from './ErrorPage';
import Layout from './Context/Layout';
import UseCart from './Context/RootPage';

import LoginPage from './Auth/LoginPage';
import RegisterPage from './Auth/RegisterPage';
import ForgetPass from './Auth/ForgetPass';
import AuthLayout from './Auth/AuthLayout';

import toast, { Toaster } from 'react-hot-toast';
import { useSearch } from './Context/SearchContext';

const App = () => {

  const {
    addedItems,
    setAddedItems,
    cartCount,
    newCart,
    removeCart,
    addWithQuantity,
    total,
  } = useContext(UseCart);

  // 🔥 Load cart
  useEffect(() => {
    const data = localStorage.getItem("cart");
    if (data) {
      setAddedItems(JSON.parse(data));
    }
  }, []);

  // 🔥 Save cart (fix: always save)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(addedItems));
  }, [addedItems]);

  return (
    <div>
      <Routes>

        {/* ✅ Public Layout */}
        <Route element={<Layout cartCount={cartCount} />}>

          {/* 🔓 Public Routes */}
          <Route path='/' element={<Products newCart={newCart} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgetpassword' element={<ForgetPass />} />
             <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />

          {/* 🔒 Protected Routes */}
          <Route element={<AuthLayout />}>

            <Route
              path='/product/:id'
              element={
                <OpenPrev
                  cartCount={cartCount}
                  newCart={newCart}
                  addWithQuantity={addWithQuantity}
                />
              }
            />

            <Route
              path='/cart'
              element={
                <AddCart
                  addedItems={addedItems}
                  newCart={newCart}
                  setAddedItems={setAddedItems}
                  removeCart={removeCart}
                  total={total}
                />
              }
            />

          </Route>

          {/* ❌ Catch all */}
          <Route path='*' element={<ErrorPage />} />

        </Route>
            <Route path='/cart/payment' element={<Payments total={total} />} />

      </Routes>
      
 <Toaster
  position="top-right"
  reverseOrder={true}
/>

    </div>
  );
};

export default App;