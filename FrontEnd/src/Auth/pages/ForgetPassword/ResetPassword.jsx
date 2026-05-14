import React,{
  useState
}
from "react";

import {
  useNavigate
}
from "react-router-dom";

import toast
from "react-hot-toast";

import api
from "../../../utils/Api";

import Spinner
from "../../../components/ui/Spinner";

import "./resetpassword.css";

const ResetPassword =
({ email }) => {

  const navigate =
  useNavigate();

  /* OTP */

  const [otp,
    setOtp] =
    useState([
      "",
      "",
      "",
      ""
    ]);

  const [
    otpVerified,
    setOtpVerified
  ] = useState(false);

  /* PASSWORD */

  const [
    newPassword,
    setNewPassword
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  /* LOADING */

  const [loading,
    setLoading] =
    useState(false);

  /* OTP CHANGE */

  const handleOtpChange =
  (value,index) => {

    if (
      !/^\d*$/.test(value)
    ) return;

    const updatedOtp =
    [...otp];

    updatedOtp[index] =
    value;

    setOtp(updatedOtp);

    /* NEXT INPUT */

    if (
      value &&
      index < 3
    ) {

      document
      .getElementById(
        `nxc-otp-${index + 1}`
      )
      ?.focus();

    }

  };

  /* VERIFY OTP */

  const handleVerifyOTP =
  async () => {

    const finalOtp =
    otp.join("");

    if (
      finalOtp.length < 4
    ) {

      return toast.error(
        "Enter valid OTP"
      );

    }

    try {

      setLoading(true);

      const res =
      await api.post(
        "/auth/verify-otp",
        {
          email,
          otp:finalOtp
        }
      );

      const data =
      res.data;

      toast.success(

        data.message ||

        "OTP verified"

      );

      setOtpVerified(true);

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Invalid OTP"

      );

    }

    finally {

      setLoading(false);

    }

  };

  /* RESET PASSWORD */

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    if (
      !newPassword ||
      !confirmPassword
    ) {

      return toast.error(
        "All fields are required"
      );

    }

    if (
      newPassword !==
      confirmPassword
    ) {

      return toast.error(
        "Passwords do not match"
      );

    }

    if (
      newPassword.length < 8
    ) {

      return toast.error(
        "Password must be at least 8 characters"
      );

    }

    try {

      setLoading(true);

      const res =
      await api.post(
        "/auth/reset-password",
        {
          email,
          newPassword
        }
      );

      const data =
      res.data;

      toast.success(

        data.message ||

        "Password updated"

      );

      setTimeout(() => {

        navigate(-1);

      }, 500);

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Reset failed"

      );

    }

    finally {

      setLoading(false);

    }

  };

  /* LOADING */

  if (loading) {

    return <Spinner />;

  }

  return (

    <div className=
    "nxc-reset-wrapper">

      <div className=
      "nxc-reset-card">

        {/* LOGO */}

        <div className=
        "nxc-reset-logo">

          NexXcart

        </div>

        {/* TITLE */}

        <h1 className=
        "nxc-reset-title">

          Reset Password

        </h1>

        {/* OTP */}

        {
          !otpVerified && (

            <>

              <p className=
              "nxc-reset-subtitle">

                Enter your 4 digit OTP

              </p>

              <div className=
              "nxc-otp-wrapper">

                {
                  otp.map(
                    (digit,index) => (

                      <input

                        key={index}

                        id=
                        {`nxc-otp-${index}`}

                        type="text"

                        maxLength="1"

                        value={digit}

                        className=
                        "nxc-otp-input"

                        onChange={(e) =>

                          handleOtpChange(
                            e.target.value,
                            index
                          )

                        }

                      />

                    )
                  )
                }

              </div>

              <button

                type="button"

                className=
                "nxc-reset-btn"

                onClick={
                  handleVerifyOTP
                }

                disabled={loading}

              >

                Verify OTP

              </button>

            </>

          )
        }

        {/* PASSWORD FORM */}

        {
          otpVerified && (

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* NEW PASSWORD */}

              <div className=
              "nxc-input-group">

                <label>

                  New Password

                </label>

                <input

                  type="password"

                  placeholder=
                  "Enter new password"

                  autoComplete=
                  "new-password"

                  value={
                    newPassword
                  }

                  className=
                  "nxc-reset-input"

                  onChange={(e) =>

                    setNewPassword(
                      e.target.value
                    )

                  }

                />

              </div>

              {/* CONFIRM */}

              <div className=
              "nxc-input-group">

                <label>

                  Confirm Password

                </label>

                <input

                  type="password"

                  placeholder=
                  "Confirm password"

                  autoComplete=
                  "new-password"

                  value={
                    confirmPassword
                  }

                  className=
                  "nxc-reset-input"

                  onChange={(e) =>

                    setConfirmPassword(
                      e.target.value
                    )

                  }

                />

              </div>

              {/* SUBMIT */}

              <button

                type="submit"

                className=
                "nxc-reset-btn"

                disabled={loading}

              >

                Update Password

              </button>

            </form>

          )
        }

      </div>

    </div>

  );

};

export default ResetPassword;