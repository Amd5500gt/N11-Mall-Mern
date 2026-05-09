import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import BASE_URL from "../config/config"
import Login from './pages/Login'
import Register from './pages/Register'
import ForgetPassword from './pages/ForgetPassword'
import './Auth.css'
import GoogleAuth from './components/GoogleAuth'
import PageForward from './components/PageForward'
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
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          picture: result.user.picture || "",
          address: result.user.address || "",
          cart:result.user.cart || ""
        }

        localStorage.setItem("loggedInUser", JSON.stringify(userProfile))
        localStorage.setItem("jwtToken", result.token)

        toast.success(result.message || "Login successful!")

        setTimeout(() => {
          navigate("/")
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
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          picture: result.user.picture || "",
          address: result.user.address || "",
          cart:result.user.cart || ""
        }
        localStorage.setItem("loggedInUser", JSON.stringify(userProfile))
        localStorage.setItem("jwtToken", result.token)

        toast.success("Registration successful!")

        setTimeout(() => {
           navigate("/")
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
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
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

  
    useEffect(() => {
      const initializeGoogle = () => {
      if (!window.google) return;
  
  window.google.accounts.id.initialize({
    client_id: "544841424268-ouptou7q8ca2j72gajck8ckrcr4btl7h.apps.googleusercontent.com",
    callback: handleGoogleAuth,
    ux_mode: "popup",
  });
  
  const googleBtn = document.getElementById("googleBtn");
  
  if (googleBtn) {
    googleBtn.innerHTML = "";
  
    window.google.accounts.id.renderButton(googleBtn, {
      theme: "outline",
      size: "large",
      width: 320,
      type: "standard",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
    });
  }}
  // Handle Google Auth
  const handleGoogleAuth = async (credentialResponse) => {
    setIsLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential })
      })

      const result = await response.json()

      if (result.success) {
       const userProfile = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          picture: result.user.picture || "",
          address: result.user.address || "",
          cart:result.user.cart || ""
        }

        localStorage.setItem("loggedInUser", JSON.stringify(userProfile))
        localStorage.setItem("jwtToken", result.token)

        toast.success("Authentication successful!")

        setTimeout(() => {
          navigate("/")
        }, 1000)
      } else {
        toast.error(result.message || "Authentication failed")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

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


  return (
    <div>
      <div className='container'>
<Login
  authMode={authMode}
  formData={formData}
  handleChange={handleChange}
  handleLogin={handleLogin}
  isLoading={isLoading}
  showPassword={showPassword}
  setShowPassword={setShowPassword}
  switchMode={switchMode}
/>

<Register
  authMode={authMode}
  formData={formData}
  handleChange={handleChange}
  handleRegister={handleRegister}
  isLoading={isLoading}
  showPassword={showPassword}
  setShowPassword={setShowPassword}
  showConfirmPassword={showConfirmPassword}
  setShowConfirmPassword={setShowConfirmPassword}
  passwordStrength={passwordStrength}
  getPasswordStrengthText={getPasswordStrengthText}
  getPasswordStrengthColor={getPasswordStrengthColor}
/>
        {/* Forgot Password Form */}
<ForgetPassword
  authMode={authMode}
  formData={formData}
  handleChange={handleChange}
  handleForgotPassword={handleForgotPassword}
  isLoading={isLoading}
  forgotEmailSent={forgotEmailSent}
  setAuthMode={setAuthMode}
  resetForm={resetForm}
/>
      
      
        {/* Toggle between Login and Register */}
<PageForward
  authMode={authMode}
  switchMode={switchMode}
/>
        {/* Google Auth Button */}
    <GoogleAuth
  authMode={authMode}
  isLoading={isLoading}
/>
      </div>
    </div>
  )
}

export default AuthPage