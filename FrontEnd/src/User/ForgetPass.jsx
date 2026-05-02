import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowLeft } from 'react-icons/fi';
import './AuthPages.css';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const ForgetPass = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState()
  const [message,setMessage] = useState("")
  const navigate = useNavigate()
 
  
const handleForgot = (e) => {
  e.preventDefault();

  axios.post("http://localhost:3000/login", {
    email
  })
  .then(res => {
    setMessage(res.data.message); // ✅ success message
    if(res.data.message === "Success"){
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
          <button className="back-arrow" onClick={() => navigate("/login")}>
            <FiArrowLeft />
          </button>

          <div className="auth-icon-box">
            <div className="icon-glow"></div>
            <FiLock className="auth-icon" />
          </div>

          <h2>Reset Password</h2>
          <p className="auth-subtitle">Enter email to get reset link</p>

          <form onSubmit={handleForgot} className="auth-form">
            <div className="input-group">
              <FiMail className="input-icon-left" />
              <input type="email" placeholder="Email Address" onChange={(e)=> setEmail(e.target.value)}/>
              <span className="input-border"></span>
            </div>

            <button type="submit" className="submit-btn" >
              <span>Send Link</span>
              <div className="btn-shine"></div>
            </button>
          </form>

          <p className="switch-text">
            <button className="text-btn" onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
export default ForgetPass