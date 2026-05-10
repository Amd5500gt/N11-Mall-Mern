
import React from "react";
import {
  FiUser,
  FiMapPin,
  FiPackage,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import "./ProfileDropdown.css";

const ProfileDropdown = ({
  dropdownRef,
  userName,
  userEmail,
  userData,
  onClose,
  onShowOrders,
  onLogout,
}) => {

  const navigate = useNavigate();

  return (

    <div
      className="nx-profile-dropdown"
      ref={dropdownRef}
    >

      {/* TOP */}
      <div className="nx-profile-top">

        <div className="nx-profile-avatar">

          {userData?.picture?.trim() ? (
            <img
              src={userData.picture}
              alt="Profile"
              referrerPolicy="no-referrer"
            />
          ) : (
            <FiUser />
          )}

        </div>

        <div className="nx-profile-user">

          <h3>
            {userName || "User"}
          </h3>

          <p>
            {userEmail}
          </p>

        </div>

      </div>

      {/* MENU */}
      <div className="nx-profile-menu">

        <button
          className="nx-profile-item"
          onClick={() => {
            onClose();
            navigate("/user/profile");
          }}
        >
          <div className="nx-profile-left">
            <span className="nx-icon">
              <FiUser />
            </span>

            <span>
              My Profile
            </span>
          </div>

          <FiChevronRight />
        </button>

        <button
          className="nx-profile-item"
          onClick={() => {
            onClose();
            navigate("/user/addresses");
          }}
        >
          <div className="nx-profile-left">
            <span className="nx-icon">
              <FiMapPin />
            </span>

            <span>
              My Addresses
            </span>
          </div>

          <FiChevronRight />
        </button>

        <button
          className="nx-profile-item"
          onClick={() => {
            onShowOrders();
            onClose();
          }}
        >
          <div className="nx-profile-left">
            <span className="nx-icon">
              <FiPackage />
            </span>

            <span>
              My Orders
            </span>
          </div>

          <FiChevronRight />
        </button>

        <button
          className="
          nx-profile-item
          logout-btn-item
          "
          onClick={onLogout}
        >
          <div className="nx-profile-left">
            <span className="
            nx-icon
            logout-icon
            ">
              <FiLogOut />
            </span>

            <span>
              Logout
            </span>
          </div>

          <FiChevronRight />
        </button>

      </div>

    </div>
  );
};

export default ProfileDropdown;

