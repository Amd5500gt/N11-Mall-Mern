// components/ProfileDropdown.jsx
import React from 'react';
import { FiUser, FiMapPin, FiPackage, FiLogOut, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // if using Link, otherwise use navigate

const ProfileDropdown = ({
  dropdownRef,
  userName,
  userEmail,
  userData,
  addressesCount,
  onClose,
  onShowAddress,
  onShowOrders,   // <-- new prop
  onLogout
}) => {
  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        <div className="dropdown-user-info">
          <strong>{userName}</strong>
          <span>{userEmail}</span>
        </div>
      </div>
      <div className="dropdown-divider"></div>
      <ul className="dropdown-menu-list">
        <li onClick={() => { onClose(); /* navigate to profile if needed */ }}>
          <FiUser /> My Profile
        </li>
        <li onClick={() => { onShowAddress(); onClose(); }}>
          <FiMapPin /> My Addresses
        </li>
        <li onClick={() => { onShowOrders(); onClose(); }}>   {/* new item */}
          <FiPackage /> My Orders
        </li>
        <li onClick={onLogout}>
          <FiLogOut /> Logout
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
