import React, { useContext } from 'react';
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
import UseCart from './Context/CartContext';

import LoginPage from './Auth/LoginPage';
import RegisterPage from './Auth/RegisterPage';
import ForgetPass from './Auth/ForgetPass';
import AuthLayout from './Auth/AuthLayout';

import { Toaster } from 'react-hot-toast';
import ProfilePage from './components/ProfilePage';

const App = () => {

  const { cartCount, total } = useContext(UseCart);

  return (
    <div>
      <Routes>

        {/* ✅ Public Layout */}
        <Route element={<Layout cartCount={cartCount} />}>

          {/* 🔓 Public Routes */}
          <Route path='/' element={<Products />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgetpassword' element={<ForgetPass />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />

          {/* 🔒 Protected Routes */}
          <Route element={<AuthLayout />}>
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/product/:id' element={<OpenPrev />} />
            <Route path='/cart' element={<AddCart />} />

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