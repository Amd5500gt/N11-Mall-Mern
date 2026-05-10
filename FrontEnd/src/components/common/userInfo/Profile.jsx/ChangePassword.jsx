import React, {
    useState
} from "react";

import {
    FaEye,
    FaEyeSlash,
    FaLock
} from "react-icons/fa";

import toast from "react-hot-toast";

import {
    useSearch
} from "../../../../context/SearchContext";

import BASE_URL from "../../../../config/config";

import "./changepass.css";

const ChangePassword = () => {

    const { token } =
        useSearch();

    const [showOldPassword,
        setShowOldPassword] =
        useState(false);

    const [showNewPassword,
        setShowNewPassword] =
        useState(false);

    const [showConfirmPassword,
        setShowConfirmPassword] =
        useState(false);

    const [loading,
        setLoading] =
        useState(false);

    const [formData,
        setFormData] =
        useState({

            oldPassword: "",

            newPassword: "",

            confirmPassword: ""

        });

    /* HANDLE CHANGE */

    const handleChange = (e) => {

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

            if (
                !formData.oldPassword ||
                !formData.newPassword ||
                !formData.confirmPassword
            ) {

                toast.error(
                    "All fields are required"
                );

                return;
            }

            if (
                formData.newPassword.length < 6
            ) {

                toast.error(
                    "Password must be at least 6 characters"
                );

                return;
            }

            if (
                formData.newPassword !==
                formData.confirmPassword
            ) {

                toast.error(
                    "Passwords do not match"
                );

                return;
            }

            try {

                setLoading(true);

                const res =
                    await fetch(
                        `${BASE_URL}/user/change-password`,
                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                oldPassword:
                                    formData.oldPassword,

                                newPassword:
                                    formData.newPassword

                            })
                        }
                    );

                const data =
                    await res.json();

                if (!res.ok) {

                    toast.error(
                        data.message ||
                        "Failed to change password"
                    );

                    return;
                }

                toast.success(
                    data.message ||
                    "Password updated successfully"
                );

                setFormData({

                    oldPassword: "",

                    newPassword: "",

                    confirmPassword: ""

                });

            } catch (err) {

                console.log(err);

                toast.error(
                    "Something went wrong"
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <div className="change-password-container">

            <div className=" password-card">

                <div className=" password-top">

                    <div className="icon-box">
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

                <form
                    className="password-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* OLD PASSWORD */}

                    <div className="input-group">

                        <label>
                            Current Password
                        </label>

                        <div className="password-input-box">

                            <input
                                type={
                                    showOldPassword
                                        ? "text"
                                        : "password"
                                }

                                name="oldPassword"
                                autoComplete="password"
                                placeholder="Enter current password"

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

                    <div className="input-group">

                        <label>
                            New Password
                        </label>

                        <div className="password-input-box">

                            <input
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                autoComplete="password"
                                name="newPassword"

                                placeholder="Enter new password"

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

                    {/* CONFIRM PASSWORD */}

                    <div className="input-group">

                        <label>
                            Confirm Password
                        </label>

                        <div className="password-input-box">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }

                                name="confirmPassword"
                                autoComplete="password"

                                placeholder="Confirm new password"

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

                    <button
                        type="submit"

                        className="update-password-btn"

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