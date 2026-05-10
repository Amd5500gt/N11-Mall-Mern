import React from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa'
import { LiaSpinnerSolid } from "react-icons/lia"
import ForgetPassword from './ForgetPassword/ForgetPassword';

const Login = ({
  authMode,
  handleLogin,
  formData,
  handleChange,
  isLoading,
  showPassword,
  setShowPassword,
  switchMode
}) => {

  if(authMode !== "login") return null;
  return (
    <form onSubmit={handleLogin} className="auth-form">

      <h1 data-text="Login">Login</h1>

      <div className='form-group'>
        <input
          type="email"
          name="email"
          placeholder="Enter your email..."
          autoFocus
          autoComplete='email'
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
            autoComplete="current-password"
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
    className="text-btn"
    onClick={() => switchMode("forgotPassword")}
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
  )
}

export default Login