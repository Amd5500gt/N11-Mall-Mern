import React, { useState } from 'react'
import BASE_URL from '../../../config/config'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import "./resetpassword.css"
import Spinner from '../../../components/ui/Spinner'

const ResetPassword = ({ email }) => {

  const navigate = useNavigate()

  const [otp, setOtp] = useState(["", "", "", ""])
  const [otpVerified, setOtpVerified] = useState(false)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)

  // OTP CHANGE
  const handleOtpChange = (value, index) => {

    if (!/^\d*$/.test(value)) return

    const updatedOtp = [...otp]

    updatedOtp[index] = value

    setOtp(updatedOtp)

    if (value && index < 3) {

      document
        .getElementById(`nxc-otp-${index + 1}`)
        .focus()

    }

  }

  // VERIFY OTP
  const handleVerifyOTP = async () => {

    try {

      setLoading(true)

      const finalOtp = otp.join("")

      const res = await fetch(
        `${BASE_URL}/auth/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            otp: finalOtp
          })
        }
      )

      const data = await res.json()

      setLoading(false)

      if (!res.ok) {

        return toast.error(
          data.message || "Invalid OTP"
        )

      }

      toast.success("OTP verified")

      setOtpVerified(true)

    }

    catch (err) {

      setLoading(false)

      toast.error(err.message)

    }

  }

  // RESET PASSWORD
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      if (newPassword !== confirmPassword) {

        return toast.error(
          "Passwords do not match"
        )

      }

      setLoading(true)

      const res = await fetch(
        `${BASE_URL}/auth/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            newPassword
          })
        }
      )

      const data = await res.json()

      setLoading(false)

      if (!res.ok) {

        return toast.error(
          data.message || "Reset failed"
        )

      }

      toast.success(data.message)

      setTimeout(() => {

        navigate("/auth")

      }, 1500)

    }

    catch (err) {

      setLoading(false)

      toast.error(err.message)

    }

  }

  if (loading) {

  return <Spinner />

}
  return (

    <div className="nxc-reset-wrapper">

      <div className="nxc-reset-card">

        <div className="nxc-reset-logo">
          NexXcart
        </div>

        <h1 className="nxc-reset-title">
          Reset Password
        </h1>

        {!otpVerified && (

          <>

            <p className="nxc-reset-subtitle">
              Enter your 4 digit OTP
            </p>

            <div className="nxc-otp-wrapper">

              {otp.map((digit, index) => (

                <input
                  key={index}
                  id={`nxc-otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  className="nxc-otp-input"
                  onChange={(e) =>
                    handleOtpChange(
                      e.target.value,
                      index
                    )
                  }
                />

              ))}

            </div>

            <button
              type="button"
              className="nxc-reset-btn"
              onClick={handleVerifyOTP}
              disabled={loading}
            >

               Verify OTP
            </button>

          </>

        )}

        {otpVerified && (

          <form onSubmit={handleSubmit}>

            <div className="nxc-input-group">

              <label>
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                autoComplete="new-password"
                value={newPassword}
                className="nxc-reset-input"
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

            </div>

            <div className="nxc-input-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                autoComplete="new-password"
                value={confirmPassword}
                className="nxc-reset-input"
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="nxc-reset-btn"
              disabled={loading}
            >

            Update Password
            </button>

          </form>

        )}

      </div>

    </div>

  )
}

export default ResetPassword