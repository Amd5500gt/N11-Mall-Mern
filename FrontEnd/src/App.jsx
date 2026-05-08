import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Route, Routes } from 'react-router-dom';
import About from './pages/common/About';
import Contact from './pages/common/Contact';
import './css/main.css';
import OpenPrev from './pages/Product/OpenPrev';
import Products from './pages/Product/Products';
import AddCart from './pages/Product/AddCart';
import Payments from './PayPage';
import ErrorPage from './ErrorPage';
import Layout from './context/Layout';
import useCart  from './context/CartContext';
import AuthLayout from './context/AuthLayout';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './userInfo/ProfilePage';
import AuthPage from './Auth/Auth';
import Payment from './userInfo/Payment';
import OrderHistory from './pages/Order/OrderHistory';
import AddressForm from './userInfo/AddressForm';
import { useContext } from 'react';
const App = () => {
  const { cartCount, total, addedItems } = useContext(useCart);
// Add this useEffect in your AddCart component
useEffect(() => {
  // Save cart items to localStorage for order history
  if (addedItems.length > 0) {
    localStorage.setItem('cartItems', JSON.stringify(addedItems));
  }
}, [addedItems]);
  return (
    <div>
      <Routes>

        {/* ✅ Public Layout */}
        <Route element={<Layout cartCount={cartCount} />}>

          {/* 🔓 Public Routes */}
          <Route path='/' element={<Products />} />
          <Route path='/auth' element={<AuthPage/>} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />

          {/* 🔒 Protected Routes */}
          <Route element={<AuthLayout />}>
          <Route path='/user/profile' element={<ProfilePage />} />
          <Route path='/product/:id' element={<OpenPrev />} />
            <Route path='/cart' element={<AddCart />} />
<Route path="/cart/payment" element={<Payment />} />
<Route path="/user/orders" element={<OrderHistory />} />
<Route path="/user/addresses" element={<AddressForm />} />
          </Route>

          {/* ❌ Catch all */}
          <Route path='*' element={<ErrorPage />} />

        </Route>

        {/* 💳 Payment */}
        <Route path='/cart/payment' element={<Payments total={total} />} />

      </Routes>

      {/* 🔥 Styled Toaster */}
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            background: '#1e293b',   // dark modern bg
            color: '#fff',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

    </div>
  );
};

export default App;