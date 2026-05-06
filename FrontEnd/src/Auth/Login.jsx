import React, { useState, useEffect } from 'react'
import './Auth.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LiaSpinnerSolid } from "react-icons/lia"
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa'
import BASE_URL from "../config/config"

const AuthPage = () => {
  const navigate = useNavigate()
  
  // Auth mode state
  const [authMode, setAuthMode] = useState('login') // 'login', 'register', 'forgotPassword'
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  
  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [forgotEmailSent, setForgotEmailSent] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/\d/)) strength++
    if (password.match(/[^a-zA-Z\d]/)) strength++
    setPasswordStrength(strength)
  }

  // Switch auth mode
  const switchMode = (mode) => {
    setAuthMode(mode)
    resetForm()
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    })
    setPasswordStrength(0)
    setForgotEmailSent(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = formData

    if (!email || !password) {
      return toast.error("All fields are required")
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const result = await response.json()
      
      if (result.success) {
        const userProfile = {
          name: result.name,
          email: result.email,
          picture: result.picture || ""
        }
        
        localStorage.setItem("loggedInUser", JSON.stringify(userProfile))
        localStorage.setItem("jwtToken", result.token)
        
        toast.success(result.message || "Login successful!")
        
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error(result.message || "Login failed")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault()
    const { name, email, password, confirmPassword } = formData

    if (!name || !email || !password || !confirmPassword) {
      return toast.error("All fields are required")
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match")
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters")
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })

      const result = await response.json()

      if (result.success) {
        const userProfile = {
          name: result.data.name,
          email: result.data.email,
          picture: result.data.picture || ""
        }
        
        localStorage.setItem("loggedInUser", JSON.stringify(userProfile))
        localStorage.setItem("jwtToken", result.token)
        
        toast.success("Registration successful!")
        
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        const details = result.error?.details?.[0]?.message
        toast.error(details || result.message || "Registration failed")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    const { email } = formData

    if (!email) {
      return toast.error("Please enter your email address")
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (result.success) {
        setForgotEmailSent(true)
        toast.success("Password reset link sent!")
        
        setTimeout(() => {
          setAuthMode('login')
          resetForm()
        }, 3000)
      } else {
        toast.error(result.message || "Failed to send reset link")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Auth
  const handleGoogleAuth = async (credentialResponse) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential })
      })

      const data = await response.json()

      if (data.success) {
        const userProfile = {
          name: data.data.name,
          email: data.data.email,
          picture: data.data.picture || ""
        }
        
        localStorage.setItem("loggedInUser", JSON.stringify(userProfile))
        localStorage.setItem("jwtToken", data.token)
        
        toast.success("Authentication successful!")
        
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error(data.message || "Authentication failed")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
  const initializeGoogle = () => {
    if (!window.google) return;

    // Prevent multiple initialization
    if (window.googleInitialized) return;
    window.googleInitialized = true;

    window.google.accounts.id.initialize({
      client_id:
        "544841424268-ouptou7q8ca2j72gajck8ckrcr4btl7h.apps.googleusercontent.com",
      callback: handleGoogleAuth,
    });

    const googleBtn = document.getElementById("googleBtn");

    if (googleBtn) {
      googleBtn.innerHTML = "";

      window.google.accounts.id.renderButton(googleBtn, {
        theme: "outline",
        size: "large",
        width: 320,
      });
    }
  };

  const existingScript = document.getElementById("google-script");

  if (!existingScript) {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-script";

    script.onload = initializeGoogle;

    document.body.appendChild(script);
  } else {
    initializeGoogle();
  }
}, []);
  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (token) {
      navigate("/", { replace: true })
    }
  }, [navigate])

  // Password strength helpers
  const getPasswordStrengthText = () => {
    const texts = ['', 'Weak', 'Fair', 'Good', 'Strong']
    return texts[passwordStrength] || ''
  }

  const getPasswordStrengthColor = () => {
    const colors = ['transparent', '#ff4444', '#ffbb33', '#00C851', '#007E33']
    return colors[passwordStrength] || 'transparent'
  }

  // Get title based on auth mode
  const getTitle = () => {
    switch (authMode) {
      case 'login': return 'Login'
      case 'register': return 'Register'
      case 'forgotPassword': return 'Reset Password'
      default: return ''
    }
  }

  return (
    <div>
      <div className='container'>
        {/* Login Form */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <h1 data-text="Login">Login</h1>

            <div className='form-group'>
           
              <input
                type="email"
                name="email"
                placeholder="Enter your email..."
                autoFocus
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className='form-group password-field'>
           
              <div className='password-input-wrapper'>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete=''
                  placeholder="Enter your password..."
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="forgot-password-link">
              <button
                type="button"
                onClick={() => switchMode('forgotPassword')}
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
        )}

        {/* Register Form */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <h1 data-text="Register">Register</h1>

            <div className='form-group'>
           
              <input
                type="text"
                name="name"
                placeholder="Enter your name..."
                autoFocus
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className='form-group'>
           
              <input
                type="email"
                name="email"
                placeholder="Enter your email..."
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className='form-group password-field'>
           
              <div className='password-input-wrapper'>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password..."
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete='password'
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    />
                  </div>
                  <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </div>

            <div className='form-group password-field'>
            
              <div className='password-input-wrapper'>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password..."
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete='password'
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {formData.confirmPassword && (
                <div className="password-match">
                  {formData.password === formData.confirmPassword ? (
                    <span className="match-success">
                      <FaCheck /> Passwords match
                    </span>
                  ) : (
                    <span className="match-error">Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? (
                <>
                  Creating Account
                  <LiaSpinnerSolid className="spinner" />
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {authMode === 'forgotPassword' && (
          <form onSubmit={handleForgotPassword} className="auth-form">
            <h1 data-text="Reset Password">Reset Password</h1>
            
            {!forgotEmailSent ? (
              <>
                <p className="forgot-password-text">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <div className='form-group'>
                
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email..."
                    autoFocus
                    value={formData.email}
                    onChange={handleChange}
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
                      <LiaSpinnerSolid className="spinner" />
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
                <p className="email-sent-to">Check your email: {formData.email}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setAuthMode('login')
                resetForm()
              }}
              className="back-to-login-btn"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Toggle between Login and Register */}
        {authMode !== 'forgotPassword' && (
          <span>
            {authMode === 'login' ? (
              <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchMode('register'); }}>Register</a></>
            ) : (
              <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchMode('login'); }}>Login</a></>
            )}
          </span>
        )}

        {/* Google Auth Button */}
        {(authMode === 'login' || authMode === 'register') && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <div id="googleBtn"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage