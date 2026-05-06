import React, { useState } from 'react'
import './Auth.css'
import { Link } from 'react-router-dom'
import { handleError, handleSuccess } from '../utils/Utils'
import { useNavigate } from 'react-router-dom'
import { LiaSpinnerSolid } from "react-icons/lia";
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa'
 import BASE_URL from "../config/config";
const RegisterPage = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }))

    // Check password strength when password changes
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

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return ''
      case 1: return 'Weak'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Strong'
      default: return ''
    }
  }

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return '#ff4444'
      case 2: return '#ffbb33'
      case 3: return '#00C851'
      case 4: return '#007E33'
      default: return 'transparent'
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { name, email, password, confirmPassword } = userInfo
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return handleError("All fields are required")
    }
    
    if (password !== confirmPassword) {
      return handleError("Passwords do not match")
    }

    if (password.length < 8) {
      return handleError("Password must be at least 8 characters long")
    }

    setIsLoading(true)

    try {
      // Simulate network delay for smooth animation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // API call
const url = `${BASE_URL}/auth/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      })
      
      const result = await response.json()
      const { success, message, error } = result
      
      if (success) {
        handleSuccess(message+"please Login")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
      } else if (error) {
        const details = error?.details[0]?.message
        handleError(details || message)
      } else if (!success) {
        handleError(message)
      }
    } catch (err) {
      handleError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div>
      <div className='container'>
        <form onSubmit={handleRegister} className="auth-form">
          <h1>Register</h1>
          
          <div className='form-group'>
          
            <input
              type="text"
              name='name'
              placeholder='Enter your name...'
              autoFocus
              onChange={handleChange}
              value={userInfo.name}
              disabled={isLoading}
            />
          </div>

          <div className='form-group'>
           
            <input
              type="email"
              name='email'
              placeholder='Enter your email...'
              onChange={handleChange}
              value={userInfo.email}
              disabled={isLoading}
            />
          </div>

          <div className='form-group password-field'>
          
            <div className='password-input-wrapper'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
               autoComplete='password'
                placeholder='Enter your password...'
                onChange={handleChange}
                value={userInfo.password}
                disabled={isLoading}
              />
              <button 
                type="button" 
                className='eye-btn'
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {userInfo.password && (
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
                <span 
                  className="strength-text"
                  style={{ color: getPasswordStrengthColor() }}
                >
                  {getPasswordStrengthText()}
                </span>
              </div>
            )}
          </div>

          <div className='form-group password-field'>
           
            <div className='password-input-wrapper'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name='confirmPassword'
                placeholder='Confirm your password...'
                onChange={handleChange}
                autoComplete='password'
                value={userInfo.confirmPassword}
                disabled={isLoading}
              />
              <button 
                type="button" 
                className='eye-btn'
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password match indicator */}
            {userInfo.confirmPassword && (
              <div className="password-match">
                {userInfo.password === userInfo.confirmPassword ? (
                  <span className="match-success">
                    <FaCheck /> Passwords match
                  </span>
                ) : (
                  <span className="match-error">
                    Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          <button 
            type='submit' 
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
        
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </div>
    </div>
  )
}

export default RegisterPage