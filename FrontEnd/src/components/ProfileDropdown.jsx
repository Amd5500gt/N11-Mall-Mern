// components/ProfileDropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiMapPin, FiPackage } from 'react-icons/fi';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';

const ProfileDropdown = ({ 
  dropdownRef, 
  userName, 
  userEmail, 
  userData, 
  addressesCount,
  onClose,
  onShowAddress,
  onLogout
}) => {
  return (
    <div ref={dropdownRef} className="profile-dropdown">
      {/* User Info Header */}
      <div className="dropdown-header">
        {userData?.avatar ? (
          <img src={userData.avatar} alt="Profile" className="dropdown-avatar" />
        ) : (
          <FaUserCircle size={40} />
        )}
        <div className="dropdown-user-info">
          <h4>{userName || 'User'}</h4>
          <p>{userEmail || ''}</p>
        </div>
      </div>
      <div className="dropdown-divider"></div>

      {/* My Profile */}
      <Link
        to="/profile"
        className="dropdown-item"
        onClick={onClose}
      >
        <FiUser size={16} />
        <span>My Profile</span>
      </Link>


      {/* Address Management */}
      {/* <button className="dropdown-item" onClick={onShowAddress}>
        <FiMapPin size={16} />
        <span>Manage Address</span>
        {addressesCount > 0 && <span className="badge">{addressesCount}</span>}
      </button> */}

      

      <div className="dropdown-divider"></div>

      {/* Logout */}
      <button 
        className="dropdown-item logout" 
        onClick={onLogout}
      >
        <FiLogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;