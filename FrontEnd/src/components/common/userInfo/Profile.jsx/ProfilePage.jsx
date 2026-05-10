import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../../context/SearchContext";

import {
  FiUser,
  FiMail,
  FiCheckCircle,
  FiLock,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

import "./ProfilePage.css";

import BASE_URL from "../../../../config/config";

import toast from "react-hot-toast";

import CustomAlert from "../../../ui/CustomAlert";

import ResetPassword from "../../../../Auth/pages/ForgetPassword/ResetPassword";

const ProfilePage = () => {

  const [alert, setAlert] =
    useState(false)

  const [
    showResetPassword,
    setShowResetPassword
  ] = useState(false)

  const [loading, setLoading] =
    useState(false)

  const navigate = useNavigate();

  const {
    userData,
    isLogged,
    handleLogout,
  } = useSearch();

  // NOT LOGGED

  if (!isLogged) {

    navigate("/auth");

    return null;

  }

  // SEND OTP

  const resetPassword = async () => {

    setLoading(true)

    const email = userData?.email

    try {

      const res = await fetch(
        `${BASE_URL}/auth/send-request`,
        {
          method: "POST",

          headers: {
            "Content-Type":
            "application/json"
          },

          body: JSON.stringify({
            email
          })
        }
      )

      const data = await res.json()

      if (data.success) {

        toast.success(data.message)

      }

      else {

        toast.error(
          data.message
        )

      }

    }

    catch (err) {

      toast.error(err.message)

    }

    finally {

      setLoading(false)

    }

  }

  // CHANGE PASSWORD

  const handleChangePassword = () => {

    setAlert(true)

  }

  // LOGOUT

  const handleUserLogout = () => {

    handleLogout()

  }

  // SEND OTP WHEN PAGE SHOWS

  useEffect(() => {

    if (showResetPassword) {

      resetPassword()

    }

  }, [showResetPassword])

  // SHOW RESET PASSWORD PAGE

  if (showResetPassword) {

    return (

      <ResetPassword
        email={userData?.email}
      />

    )

  }

  return (

    <div className="profile-page">

      {/* TOP CARD */}

      <div className="profile-hero">

        <div className="profile-avatar-wrapper">

          {
            userData?.picture?.trim()
            ? (

              <img
                src={userData.picture}
                alt="Profile"
                className="profile-avatar"
                referrerPolicy="no-referrer"
              />

            )

            : (

              <div className="profile-fallback">

                <FiUser size={42} />

              </div>

            )
          }

        </div>

        <div className="profile-hero-content">

          <h1>
            {userData?.name}
          </h1>

          <p>
            {userData?.email}
          </p>

          <span className="status-badge">

            <FiCheckCircle />

            Verified Account

          </span>

        </div>

      </div>

      {/* INFO SECTION */}

      <div className="profile-section">

        <h2 className="section-title">

          Account Information

        </h2>

        <div className="profile-list">

          {/* NAME */}

          <div className="profile-row">

            <div className="profile-row-left">

              <div className="profile-icon">

                <FiUser />

              </div>

              <div>

                <span>
                  Full Name
                </span>

                <h4>
                  {userData?.name}
                </h4>

              </div>

            </div>

            <FiChevronRight />

          </div>

          {/* EMAIL */}

          <div className="profile-row">

            <div className="profile-row-left">

              <div className="profile-icon">

                <FiMail />

              </div>

              <div>

                <span>
                  Email Address
                </span>

                <h4>
                  {userData?.email}
                </h4>

              </div>

            </div>

            <FiChevronRight />

          </div>

        </div>

      </div>

      {/* ACTIONS */}

      <div className="profile-section">

        <h2 className="section-title">

          Security & Actions

        </h2>

        <div className="profile-list">

          {/* CHANGE PASSWORD */}

          <button
            className="action-btn"
            onClick={handleChangePassword}
            disabled={loading}
          >

            <div className="profile-row-left">

              <div className="profile-icon">

                <FiLock />

              </div>

              <div>

                <h4>

                  {
                    loading
                    ? "Sending OTP..."
                    : "Change Password"
                  }

                </h4>

              </div>

            </div>

            <FiChevronRight />

          </button>

          {/* LOGOUT */}

          <button
            className="action-btn logout"
            onClick={handleUserLogout}
          >

            <div className="profile-row-left">

              <div className="profile-icon logout-icon">

                <FiLogOut />

              </div>

              <div>

                <span>
                  Account
                </span>

                <h4>
                  Logout
                </h4>

              </div>

            </div>

            <FiChevronRight />

          </button>

        </div>

      </div>

      {/* ALERT */}

      {
        alert && (

          <CustomAlert

            type="warning"

            message="An OTP will be sent to your email"

            onClose={() => {

              setAlert(false)

            }}

            onShowPage={() => {

              setShowResetPassword(true)

            }}
          />

        )
      }

    </div>

  )

}

export default ProfilePage