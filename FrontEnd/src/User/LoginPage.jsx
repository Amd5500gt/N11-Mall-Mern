import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowLeft } from 'react-icons/fi';
import './AuthPages.css';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [message,setMessage] = useState("")
  const navigate = useNavigate()

const handleLogin = (e) => {
  e.preventDefault();

  axios.post("http://localhost:3000/login", {
    email,
    password
  })
  .then(res => {
    if(res.data.message === "Login-Success"){
        setMessage(res.data.message)
        navigate("/")
    }
  })
  .catch(err => {

    // ✅ validation errors
    if (err.response?.data?.errors) {
      setMessage(err.response.data.errors[0].msg);
    } 
    // ✅ normal error
    else {
      setMessage(err.response?.data?.message || "Something went wrong");
    }

  });
};


return (
    <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-blob"></div>
          <div className="auth-blob-2"></div>

          <div className="auth-content">
            <div className="auth-icon-box">
              <div className="icon-glow"></div>
              <FiUser className="auth-icon" />
            </div>

            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue</p>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="input-group">
                <FiMail className="input-icon-left" />
                <input type="email" placeholder="Email Address" onChange={(e)=> setEmail(e.target.value)} />
                <span className="input-border"></span>
              </div>

              <div className="input-group">
                <FiLock className="input-icon-left" />
                <input type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} />
                <span className="input-border"></span>
              </div>

              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <button type="button" className="text-btn" onClick={() => navigate("/forgetpassword")}>
                  Forgot?
                </button>
              </div>

              <button type="submit" className="submit-btn">
                <span>Sign In</span>
                <div className="btn-shine"></div>
              </button>
            </form>
              {message && (
                  <p style={{ 
                      color: message.includes("Success") ? "green" : "red",
                      fontWeight: "bold",
                      marginTop: "10px"
                    }}>
    {message}
  </p>)}
            <p className="switch-text">
              Don't have an account?{' '}
              <button className="text-btn" onClick={() => navigate("/register")}>
                Create One
              </button>
            </p>
          </div>
        </div>
      </div>
    );

}

export default LoginPage