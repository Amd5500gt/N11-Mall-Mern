import React,{
  useState
}
from "react";

import {

  FaEye,
  FaEyeSlash,
  FaLock

}
from "react-icons/fa";

import toast
from "react-hot-toast";

import api
from "../../../../utils/Api";

import "./changepass.css";

const ChangePassword =
() => {

  /* PASSWORD VISIBILITY */

  const [

    showOldPassword,
    setShowOldPassword

  ] = useState(false);

  const [

    showNewPassword,
    setShowNewPassword

  ] = useState(false);

  const [

    showConfirmPassword,
    setShowConfirmPassword

  ] = useState(false);

  /* LOADING */

  const [loading,
    setLoading] =
    useState(false);

  /* FORM */

  const [
    formData,
    setFormData
  ] = useState({

    oldPassword:"",
    newPassword:"",
    confirmPassword:""

  });

  /* INPUT CHANGE */

  const handleChange =
  (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  /* SUBMIT */

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    /* VALIDATION */

    if (

      !formData.oldPassword ||

      !formData.newPassword ||

      !formData.confirmPassword

    ) {

      return toast.error(
        "All fields are required"
      );

    }

    if (
      formData.newPassword
      .length < 6
    ) {

      return toast.error(
        "Password must be at least 6 characters"
      );

    }

    if (

      formData.newPassword !==

      formData.confirmPassword

    ) {

      return toast.error(
        "Passwords do not match"
      );

    }

    try {

      setLoading(true);

      const res =
      await api.put(
        "/user/change-password",
        {

          oldPassword:
          formData.oldPassword,

          newPassword:
          formData.newPassword

        }
      );

      const data =
      res.data;

      toast.success(

        data.message ||

        "Password updated"

      );

      /* RESET */

      setFormData({

        oldPassword:"",
        newPassword:"",
        confirmPassword:""

      });

    }

    catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Failed to change password"

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className=
    "change-password-container">

      <div className=
      "password-card">

        {/* TOP */}

        <div className=
        "password-top">

          <div className=
          "icon-box">

            <FaLock />

          </div>

          <h2>

            Change Password

          </h2>

          <p>

            Secure your account
            with a strong password

          </p>

        </div>

        {/* FORM */}

        <form

          className=
          "password-form"

          onSubmit={
            handleSubmit
          }

        >

          {/* OLD PASSWORD */}

          <div className=
          "input-group">

            <label>

              Current Password

            </label>

            <div className=
            "password-input-box">

              <input

                type={
                  showOldPassword
                  ? "text"
                  : "password"
                }

                name=
                "oldPassword"

                autoComplete=
                "current-password"

                placeholder=
                "Enter current password"

                value={
                  formData.oldPassword
                }

                onChange={
                  handleChange
                }

              />

              <button

                type="button"

                onClick={() =>

                  setShowOldPassword(
                    !showOldPassword
                  )

                }

              >

                {
                  showOldPassword

                  ? <FaEyeSlash />

                  : <FaEye />
                }

              </button>

            </div>

          </div>

          {/* NEW PASSWORD */}

          <div className=
          "input-group">

            <label>

              New Password

            </label>

            <div className=
            "password-input-box">

              <input

                type={
                  showNewPassword
                  ? "text"
                  : "password"
                }

                autoComplete=
                "new-password"

                name=
                "newPassword"

                placeholder=
                "Enter new password"

                value={
                  formData.newPassword
                }

                onChange={
                  handleChange
                }

              />

              <button

                type="button"

                onClick={() =>

                  setShowNewPassword(
                    !showNewPassword
                  )

                }

              >

                {
                  showNewPassword

                  ? <FaEyeSlash />

                  : <FaEye />
                }

              </button>

            </div>

          </div>

          {/* CONFIRM */}

          <div className=
          "input-group">

            <label>

              Confirm Password

            </label>

            <div className=
            "password-input-box">

              <input

                type={
                  showConfirmPassword
                  ? "text"
                  : "password"
                }

                name=
                "confirmPassword"

                autoComplete=
                "new-password"

                placeholder=
                "Confirm new password"

                value={
                  formData.confirmPassword
                }

                onChange={
                  handleChange
                }

              />

              <button

                type="button"

                onClick={() =>

                  setShowConfirmPassword(
                    !showConfirmPassword
                  )

                }

              >

                {
                  showConfirmPassword

                  ? <FaEyeSlash />

                  : <FaEye />
                }

              </button>

            </div>

          </div>

          {/* SUBMIT */}

          <button

            type="submit"

            className=
            "update-password-btn"

            disabled={loading}

          >

            {
              loading

              ? "Updating..."

              : "Update Password"
            }

          </button>

        </form>

      </div>

    </div>

  );

};

export default ChangePassword;