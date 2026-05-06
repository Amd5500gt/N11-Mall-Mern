import React, { useState, useEffect } from 'react'
import './Auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { handleError, handleSuccess } from '../utils/Utils'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useSearch } from '../Context/SearchContext'
import toast from 'react-hot-toast'
import { LiaSpinnerSolid } from "react-icons/lia";

const LoginPage = () => {
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotEmailSent, setForgotEmailSent] = useState(false)

  const { setToken, setUserName, setUserEmail } = useSearch()

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ✅ login function with loading animation
  const handleLogin = async (e) => {
    e.preventDefault()

    const { email, password } = userInfo

    if (!email || !password) {
      return toast.error("All fields are required")
    }

    setIsLoading(true)

    try {
      // Simulate network delay for smooth animation
      await new Promise(resolve => setTimeout(resolve, 1500))

      const response = await fetch("https://n11-backend-2.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
      })

      const result = await response.json()
      if (result.success) {
   
        const userProfile = {
          name: result.name,
          email: result.email
        }

        // ✅ Save to localStorage
        
        localStorage.setItem("loggedInUser", JSON.stringify(userProfile))
        await setToken(localStorage.setItem("jwtToken",result.token))
        toast.success(result.message)
        
        // Smooth transition before reload
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error(result.message || "Login failed")
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    
    if (!forgotEmail) {
      return handleError("Please enter your email address")
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const response = await fetch("https://n11-backend-2.vercel.app/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: forgotEmail })
      })

      const result = await response.json()

      if (result.success) {
        setForgotEmailSent(true)
        toast.success("Password reset link sent to your email")
        
        // Reset after 3 seconds
        setTimeout(() => {
          setShowForgotPassword(false)
          setForgotEmailSent(false)
          setForgotEmail("")
        }, 3000)
      } else {
        toast.error(result.message || "Failed to send reset link")
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (token) {
      navigate("/", { replace: true })
    }
  }, [navigate])

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <div className='container'>
      {!showForgotPassword ? (
        <form onSubmit={handleLogin} className="auth-form">
          <h1>Login</h1>

          <div className='form-group'>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email..."
              autoFocus
              value={userInfo.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className='form-group password-field'>
            <label>Password</label>
            <div className='password-input-wrapper'>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete='password'
                placeholder="Enter your password..."
                value={userInfo.password}
                onChange={handleChange}
                disabled={isLoading}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="forgot-password-link">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-btn"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? (
              <>
                Logging in  
               <LiaSpinnerSolid className="spinner" />
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleForgotPassword} className="auth-form forgot-password-form">
          <h1>Reset Password</h1>
          
          {!forgotEmailSent ? (
            <>
              <p className="forgot-password-text">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <div className='form-group'>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  autoFocus
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={isLoading ? 'loading' : ''}
              >
                {isLoading ? (
                  <>
                   <LiaSpinnerSolid  size={10} className="spinner" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p>Password reset link has been sent!</p>
              <p className="email-sent-to">Check your email: {forgotEmail}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(false)
              setForgotEmailSent(false)
              setForgotEmail("")
            }}
            className="back-to-login-btn"
          >
            Back to Login
          </button>
        </form>
      )}
    
      {!showForgotPassword && (
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      )}
    </div>
  )
}

export default LoginPage