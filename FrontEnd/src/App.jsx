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
import ErrorPage from './components/ui/ErrorPage';
import Layout from './context/Layout';
import useCart from './context/CartContext';
import AuthLayout from './context/AuthLayout';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './components/common/userInfo/Profile.jsx/ProfilePage';
import AuthPage from './Auth/Auth';
import Payment from './pages/payments/Payment';
import OrderHistory from './pages/Order/OrderHistory';
import AddressPage from './components/common/userInfo/address/AddressPage';
import { useContext } from 'react';
import AddressForm from './components/common/userInfo/addressForm/AddressForm';
import ChangePassword from './components/common/userInfo/Profile.jsx/ChangePassword';
const App = () => {
  const { cartCount, total, addedItems } = useContext(useCart);

  useEffect(() => {
    if (addedItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(addedItems));
    }
  }, [addedItems]);
  return (
    <div>
      <Routes>

        {/* Layout */}
        <Route element={<Layout cartCount={cartCount} />}>

          {/*  Public Routes */}
          <Route path='/' element={<Products />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />

          {/* Protected Routes */}
          <Route element={<AuthLayout />}>
            <Route path='/product/:id' element={<OpenPrev />} />
     
            {/*Cart Routes */}   
            <Route path='/cart' >
            <Route path='checkout' element={<AddCart />} />
            <Route path="checkout/payment" element={<Payment />} />
            </Route>

            {/*User Routes */}   
            <Route path='/user'>   
            <Route path='profile' element={<ProfilePage />} />
            <Route path="profile/password" element={<ChangePassword />} />

            <Route path="orders" element={<OrderHistory />} />
            <Route path="addresses" element={<AddressPage />} />
            <Route path="addresses/add" element={<AddressForm />} />

            </Route>

          </Route>

          {/* ❌ Catch all */}
          <Route path='*' element={<ErrorPage />} />

        </Route>

      </Routes>

      {/* Toaster */}
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