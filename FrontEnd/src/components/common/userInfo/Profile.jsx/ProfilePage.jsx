
import React from "react";
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

const ProfilePage = () => {

  const navigate = useNavigate();

  const {
    userData,
    isLogged,
    handleLogout,
  } = useSearch();

  if (!isLogged) {
    navigate("/auth");
    return null;
  }

  const handleChangePassword = () => {
    navigate("password");
  };

  const handleUserLogout = () => {
    handleLogout();
  };

  return (
    <div className="profile-page">

      {/* TOP CARD */}
      <div className="profile-hero">

        <div className="profile-avatar-wrapper">

          {userData?.picture?.trim() ? (
            <img
              src={userData.picture}
              alt="Profile"
              className="profile-avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="profile-fallback">
              <FiUser size={42} />
            </div>
          )}

        </div>

        <div className="profile-hero-content">
          <h1>{userData?.name}</h1>
          <p>{userData?.email}</p>

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

          <div className="profile-row">
            <div className="profile-row-left">
              <div className="profile-icon">
                <FiUser />
              </div>

              <div>
                <span>Full Name</span>
                <h4>{userData?.name}</h4>
              </div>
            </div>

            <FiChevronRight />
          </div>

          <div className="profile-row">
            <div className="profile-row-left">
              <div className="profile-icon">
                <FiMail />
              </div>

              <div>
                <span>Email Address</span>
                <h4>{userData?.email}</h4>
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

          <button
            className="action-btn"
            onClick={handleChangePassword}
          >
            <div className="profile-row-left">
              <div className="profile-icon">
                <FiLock />
              </div>

              <div>
               
                <h4>Change Password</h4>
              </div>
            </div>

            <FiChevronRight />
          </button>

          <button
            className="action-btn logout"
            onClick={handleUserLogout}
          >
            <div className="profile-row-left">
              <div className="profile-icon logout-icon">
                <FiLogOut />
              </div>

              <div>
                <span>Account</span>
                <h4>Logout</h4>
              </div>
            </div>

            <FiChevronRight />
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
