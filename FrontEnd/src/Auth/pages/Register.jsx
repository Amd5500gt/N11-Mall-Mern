import React from 'react'
import { LiaSpinnerSolid } from 'react-icons/lia'
import { FaEyeSlash, FaEye, FaCheck } from 'react-icons/fa'

const Register = ({
  authMode,
  formData,
  handleChange,
  handleRegister,
  isLoading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor
}) => {

  if(authMode !== "register") return null;

  return (

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
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
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

              <span className="match-error">
                Passwords do not match
              </span>

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

  )
}

export default Register