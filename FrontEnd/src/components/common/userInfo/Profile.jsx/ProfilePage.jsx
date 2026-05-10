import React,{
  useEffect,
  useState
}
from "react";

import {
  useNavigate
}
from "react-router-dom";

import {
  useSearch
}
from "../../../../context/SearchContext";

import {

  FiUser,
  FiMail,
  FiCheckCircle,

  FiLock,
  FiLogOut,

  FiChevronRight

}
from "react-icons/fi";

import toast
from "react-hot-toast";

import api
from "../../../../utils/Api";

import CustomAlert
from "../../../ui/CustomAlert";

import ResetPassword
from "../../../../Auth/pages/ForgetPassword/ResetPassword";

import "./ProfilePage.css";

const ProfilePage =
() => {

  /* ALERT */

  const [alert,
    setAlert] =
    useState(false);

  /* RESET PAGE */

  const [

    showResetPassword,

    setShowResetPassword

  ] = useState(false);

  /* LOADING */

  const [loading,
    setLoading] =
    useState(false);

  /* IMAGE */

  const [

    imageError,
    setImageError

  ] = useState(false);

  const navigate =
  useNavigate();

  const {

    userData,
    isLogged,

    handleLogout

  } = useSearch();

  /* NOT LOGGED */

  useEffect(() => {

    if (!isLogged) {

      navigate("/auth");

    }

  }, [isLogged,navigate]);

  /* SEND OTP */

  const resetPassword =
  async () => {

    const email =
    userData?.email;

    try {

      setLoading(true);

      const res =
      await api.post(
        "/auth/send-request",
        {
          email
        }
      );

      const data =
      res.data;

      toast.success(

        data.message ||

        "OTP sent successfully"

      );

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Failed to send OTP"

      );

    }

    finally {

      setLoading(false);

    }

  };

  /* CHANGE PASSWORD */

  const handleChangePassword =
  () => {

    setAlert(true);

  };

  /* LOGOUT */

  const handleUserLogout =
  () => {

    handleLogout();

  };

  /* SEND OTP */

  useEffect(() => {

    if (
      showResetPassword
    ) {

      resetPassword();

    }

  }, [showResetPassword]);

  /* RESET PAGE */

  if (showResetPassword) {

    return (

      <ResetPassword
        email={
          userData?.email
        }
      />

    );

  }

  return (

    <div className=
    "profile-page">

      {/* HERO */}

      <div className=
      "profile-hero">

        {/* AVATAR */}

        <div className=
        "profile-avatar-wrapper">

          {
            userData?.picture
            ?.trim()

            && !imageError

            ? (

              <img

                src={
                  userData.picture
                }

                alt="Profile"

                className=
                "profile-avatar"

                referrerPolicy=
                "no-referrer"

                onError={() => {

                  setImageError(
                    true
                  );

                }}

              />

            )

            : (

              <div className=
              "profile-fallback">

                <FiUser
                  size={42}
                />

              </div>

            )
          }

        </div>

        {/* CONTENT */}

        <div className=
        "profile-hero-content">

          <h1>

            {userData?.name}

          </h1>

          <p>

            {userData?.email}

          </p>

          <span className=
          "status-badge">

            <FiCheckCircle />

            Verified Account

          </span>

        </div>

      </div>

      {/* INFO */}

      <div className=
      "profile-section">

        <h2 className=
        "section-title">

          Account Information

        </h2>

        <div className=
        "profile-list">

          {/* NAME */}

          <div className=
          "profile-row">

            <div className=
            "profile-row-left">

              <div className=
              "profile-icon">

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

          <div className=
          "profile-row">

            <div className=
            "profile-row-left">

              <div className=
              "profile-icon">

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

      <div className=
      "profile-section">

        <h2 className=
        "section-title">

          Security & Actions

        </h2>

        <div className=
        "profile-list">

          {/* CHANGE PASSWORD */}

          <button

            className=
            "action-btn"

            onClick={
              handleChangePassword
            }

            disabled={loading}

          >

            <div className=
            "profile-row-left">

              <div className=
              "profile-icon">

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

            className=
            "action-btn logout"

            onClick={
              handleUserLogout
            }

          >

            <div className=
            "profile-row-left">

              <div className=
              "profile-icon logout-icon">

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

            message=
            "An OTP will be sent to your email"

            onClose={() => {

              setAlert(false);

            }}

            onShowPage={() => {

              setShowResetPassword(
                true
              );

            }}

          />

        )
      }

    </div>

  );

};

export default ProfilePage;