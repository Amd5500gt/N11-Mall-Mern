import React, { useState } from 'react'
import BASE_URL from '../../../config/config'
import toast from 'react-hot-toast'

import Spinner from '../../../components/ui/Spinner'
import ResetPassword from './ResetPassword'

const ForgetPassword = ({
  authMode,
  setAuthMode,
  resetForm
}) => {

  // SHOW ONLY WHEN MODE IS forgotPassword
  if (authMode !== "forgotPassword") return null

  // STATES
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  // SHOW RESET PASSWORD COMPONENT
  const [showResetPassword, setShowResetPassword] =
    useState(false)

  // SEND OTP
  const handleForgotPassword = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      const res = await fetch(
        `${BASE_URL}/auth/send-request`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email
          })
        }
      )

      const data = await res.json()

      setLoading(false)

      // ERROR
      if (!res.ok) {

        return toast.error(
          data.message || "OTP send failed"
        )

      }

      // SUCCESS
      toast.success(data.message)

      // OPEN RESET PASSWORD COMPONENT
      setShowResetPassword(true)

    }

    catch (err) {

      setLoading(false)

      toast.error(
        err.message || "Something went wrong"
      )

    }

  }

  // RENDER RESET PASSWORD COMPONENT
  if (showResetPassword) {

    return (
      <ResetPassword
        email={email}
      />
    )

  }

  return (

    <form
      onSubmit={handleForgotPassword}
      className="auth-form"
    >

      <h1 data-text="Forgot Password">
        Forgot Password
      </h1>

      <p className="forgot-password-text">
        Enter your email address to receive OTP.
      </p>

      <div className='form-group'>

        <input
          type="email"
          name="email"
          placeholder="Enter your email..."
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className={loading ? 'loading' : ''}
      >

        {loading ? (
          <>
            <Spinner />
          </>
        ) : (
          'Send OTP'
        )}

      </button>

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