import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import About from './pages/common/About';
import Contact from './pages/common/Contact';
import './css/main.css';
import OpenPrev from './pages/Product/OpenPrev';
import Products from './pages/Product/Products';
import AddCart from './pages/Product/AddCart';
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
            <Route path="address/add" element={<AddressForm />} />

            </Route>

          </Route>

          {/* ❌ Catch all */}
          <Route path='*' element={<ErrorPage />} />

        </Route>

      </Routes>

 {/* ❤️ Red + Black Cyber Toaster */}
<Toaster
  position="bottom-center"
  reverseOrder={false}
  gutter={10}
  containerStyle={{
    bottom: 20,
    zIndex: 999999,
  }}
  toastOptions={{
    duration: 2800,

    style: {
      zIndex: "999999",

      // 🖤 Cyber Dark Background

      color: "#000000",

      borderRadius: "16px",
      padding: "14px 18px",

      fontSize: "14px",
      fontWeight: "600",
      letterSpacing: "0.3px",

      minWidth: "260px",
      maxWidth: "400px",

      animation: "toastSlide 0.25s ease",
    },

    // ✅ SUCCESS
    success: {
      duration: 2500,

      iconTheme: {
        primary: "#ff1744",
        secondary: "#140205",
      },
    },

    // ❌ ERROR
    error: {
      duration: 3200,

      iconTheme: {
        primary: "#ff5252",
        secondary: "#180204",
      },
    },

    // ⏳ LOADING
    loading: {
      iconTheme: {
        primary: "#ff8a80",
        secondary: "#180304",
      },
    },
  }}
/>
    </div>
  );
};

export default App;