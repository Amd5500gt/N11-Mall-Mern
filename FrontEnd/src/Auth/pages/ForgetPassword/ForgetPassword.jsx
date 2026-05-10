import React,{
  useState
}
from "react";

import toast
from "react-hot-toast";

import api
from "../../../utils/Api";

import Spinner
from "../../../components/ui/Spinner";

import ResetPassword
from "./ResetPassword";

const ForgetPassword = ({

  authMode,
  setAuthMode,

  resetForm

}) => {

  /* SHOW ONLY */

  if (
    authMode !==
    "forgotPassword"
  ) return null;

  /* STATES */

  const [email,
    setEmail] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [

    showResetPassword,

    setShowResetPassword

  ] = useState(false);

  /* SEND OTP */

  const handleForgotPassword =
  async (e) => {

    e.preventDefault();

    if (!email) {

      return toast.error(
        "Email is required"
      );

    }

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

      /* OPEN RESET PAGE */

      setShowResetPassword(
        true
      );

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "OTP send failed"

      );

    }

    finally {

      setLoading(false);

    }

  };

  /* RESET PAGE */

  if (showResetPassword) {

    return (

      <ResetPassword
        email={email}
      />

    );

  }

  return (

    <form
      onSubmit={
        handleForgotPassword
      }

      className="auth-form"
    >

      <h1
        data-text=
        "Forgot Password"
      >

        Forgot Password

      </h1>

      <p className=
      "forgot-password-text">

        Enter your email
        to receive OTP.

      </p>

      {/* EMAIL */}

      <div className=
      "form-group">

        <input

          type="email"

          name="email"

          placeholder=
          "Enter your email..."

          autoFocus

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          disabled={loading}

        />

      </div>

      {/* SUBMIT */}

      <button

        type="submit"

        disabled={loading}

        className={
          loading
          ? "loading"
          : ""
        }
      >

        {
          loading

          ? (
            <Spinner />
          )

          : (
            "Send OTP"
          )
        }

      </button>

      {/* BACK */}

      <button

        type="button"

        className=
        "back-to-login-btn"

        onClick={() => {

          setAuthMode(
            "login"
          );

          resetForm();

        }}
      >

        Back to Login

      </button>

    </form>

  );

};

export default ForgetPassword;