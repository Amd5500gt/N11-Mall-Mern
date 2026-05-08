import React from 'react';
import { FiUser, FiMapPin, FiPackage, FiLogOut, FiSettings } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom'; // if using Link, otherwise use navigate

const ProfileDropdown = ({
  dropdownRef,
  userName,
  userEmail,
  userData,
  addressesCount,
  onClose,
  onShowOrders,   // <-- new prop
  onLogout
}) => {

  const navigation = useNavigate()
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
        <li onClick={() => { onClose(); navigation("/user/profile")}}>
          <FiUser /> My Profile
        </li>
        <li onClick={() => { onClose(); navigation("/user/addresses") }}>
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
