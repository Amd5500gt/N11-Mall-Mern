import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowLeft } from 'react-icons/fi';
import './AuthPages.css';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [number, setNumber] = useState()
  const [password, setPassword] = useState("")
  const [message,setMessage] = useState("")
  const navigate = useNavigate()



const handleRegister = (e) => {
  e.preventDefault();

  axios.post("http://localhost:3000/register", {
    name,
    email,
    number,
    password
  })
  .then(res => {
    setMessage(res.data.message);
    if(res.data.message === "Success") {
        navigate("/login")
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

            <h2>Join Us</h2>
            <p className="auth-subtitle">Create your account</p>

            <form onSubmit={handleRegister} className="auth-form">
              <div className="input-group">
                <FiUser className="input-icon-left" />
                <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
                <span className="input-border"></span>
              </div>

              <div className="input-group">
                <FiMail className="input-icon-left" />
                <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
                <span className="input-border"></span>
              </div>

              <div className="input-group">
                <FiPhone className="input-icon-left" />
                <input type="tel" placeholder="Phone Number" onChange={(e) => setNumber(e.target.value)} />
                <span className="input-border"></span>
              </div>

              <div className="input-group">
                <FiLock className="input-icon-left" />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <span className="input-border"></span>
              </div>

              <div className="input-group">
                <FiLock className="input-icon-left" />
                <input type="password" placeholder="Confirm Password" />
                <span className="input-border"></span>
              </div>

              <button type="submit" className="submit-btn">
                <span>Create Account</span>
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
  </p>
)}

            <p className="switch-text">
              Already have an account?{' '}
              <button className="text-btn" onClick={() => navigate("/login")}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }


export default RegisterPage