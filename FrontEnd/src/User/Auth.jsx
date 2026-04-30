// src/components/AuthPages.jsx
import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowLeft } from 'react-icons/fi';
import './AuthPages.css';

const AuthPages = () => {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) 
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const validateForgot = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    return newErrors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Login:', { email: formData.email, password: formData.password });
      setLoading(false);
      // Add your login logic
    }, 1500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const validationErrors = validateRegister();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      console.log('Register:', formData);
      setLoading(false);
      // Add your register logic
    }, 1500);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const validationErrors = validateForgot();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      console.log('Reset password for:', formData.email);
      setLoading(false);
      setCurrentPage('login');
      alert('Reset link sent to your email!');
    }, 1500);
  };

  // 🔵 LOGIN PAGE
  if (currentPage === 'login') {
    return (
      <div className="auth-wrapper">
        <div className="auth-container">
          <div className="auth-header">
            <div className="icon-circle">
              <FiUser size={32} color="white" />
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-container">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Email Address</label>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-container">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Password</label>
              <span 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button 
                type="button" 
                className="forgot-link"
                onClick={() => setCurrentPage('forgot')}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-links">
            <span>Don't have an account?</span>
            <button 
              type="button"
              className="link-btn"
              onClick={() => setCurrentPage('register')}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🟣 REGISTER PAGE
  if (currentPage === 'register') {
    return (
      <div className="auth-wrapper">
        <div className="auth-container">
          <div className="auth-header">
            <div className="icon-circle">
              <FiUser size={32} color="white" />
            </div>
            <h2>Create Account</h2>
            <p>Join us today</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="input-container">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Full Name</label>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-container">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Email Address</label>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-container">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Phone Number</label>
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="input-container">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Password</label>
              <span 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="input-container">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Confirm Password</label>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-links">
            <span>Already have an account?</span>
            <button 
              type="button"
              className="link-btn"
              onClick={() => setCurrentPage('login')}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔑 FORGOT PASSWORD PAGE
  if (currentPage === 'forgot') {
    return (
      <div className="auth-wrapper">
        <div className="auth-container">
          <div className="auth-header">
            <button 
              className="back-btn"
              onClick={() => setCurrentPage('login')}
            >
              <FiArrowLeft size={20} />
            </button>
            <div className="icon-circle">
              <FiLock size={32} color="white" />
            </div>
            <h2>Forgot Password?</h2>
            <p>Enter your email to reset password</p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="input-container">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Email Address</label>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="auth-links">
            <button 
              type="button"
              className="link-btn"
              onClick={() => setCurrentPage('login')}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default AuthPages;