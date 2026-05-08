import React from 'react'
import { LiaSpinnerSolid } from "react-icons/lia"

const ForgetPassword = ({
  authMode,
  formData,
  handleChange,
  handleForgotPassword,
  isLoading,
  forgotEmailSent,
  setAuthMode,
  resetForm
}) => {

  if(authMode !== "forgotPassword") return null;

  return (

    <form
      onSubmit={handleForgotPassword}
      className="auth-form"
    >

      <h1 data-text="Reset Password">
        Reset Password
      </h1>

      {!forgotEmailSent ? (

        <>

          <p className="forgot-password-text">
            Enter your email address and we'll send
            you a link to reset your password.
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

          <div className="success-icon">
            ✓
          </div>

          <p>
            Password reset link has been sent!
          </p>

          <p className="email-sent-to">
            Check your email: {formData.email}
          </p>

        </div>

      )}

      <button
        type="button"
        className="back-to-login-btn"
        onClick={() => {
          setAuthMode('login')
          resetForm()
        }}
      >
        Back to Login
      </button>

    </form>

  )
}

export default ForgetPassword