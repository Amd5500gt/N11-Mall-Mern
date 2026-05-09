// components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsCartFill } from 'react-icons/bs';
import { useSearch } from '../../context/SearchContext';
import { FiHome, FiInfo, FiPhone, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiMapPin, FiPackage } from 'react-icons/fi';
import { FaUserCircle, FaMoon, FaSun, FaChevronDown } from 'react-icons/fa';
import ProfileDropdown from './navbar/ProfileDropdown';
import '../components.css';
import Cart from './navbar/Cart';

const Header = ({ cartCount }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const dropdownRef = useRef(null);
  const profileBtnRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const location = useLocation();
  const [value, setValue] = useState("");
  const [addresses, setAddresses] = useState([]);

  const { 
    setSearchTerm, token, isLogged,
    userData, handleLogout 
  } = useSearch();
  const {name,email,picture} = userData
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profileBtnRef.current && !profileBtnRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);



  const navLinks = [
    { name: 'Home', path: '/', icon: <FiHome size={18} /> },
    { name: 'About', path: '/about', icon: <FiInfo size={18} /> },
    { name: 'Contact', path: '/contact', icon: <FiPhone size={18} /> },
  ];

  const handleSearch = () => {
    if (!value.trim()) return;
    setSearchTerm(value.trim().toLowerCase());
  };

  const handleLogin = () => {
    navigate("/auth");
  };
// Inside Header component, after handleLogout and other functions

const handleShowOrders = () => {
  navigate('/user/orders');
};

// Then inside the ProfileDropdown component:

  return (
    <>
      <header className={`n11-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <Link className="logo" to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="currentColor" fillOpacity="0.9" />
                <circle cx="16" cy="16" r="4" fill="white" />
                <path d="M10 12L13 14L16 11L19 14L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="logo-text">N11<span className="logo-highlight">Mall</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Box */}
          <div className="search-box">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="search-input"
              type="text"
              placeholder="Search products..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">🔍</button>
          </div>

          {isLogged ? (
            <>
         <Cart cartCount={cartCount} animate = {animate}/>

              <div className="user-section">
                <button
                  ref={profileBtnRef}
                  className="profile-btn"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  {userData?.picture ? (
                    <img src={picture} alt="Profile" className="profile-avatar" />
                  ) : (
                    <FaUserCircle size={28} />
                  )}
                  <span className="profile-name">
                    {name?.split(' ')[0] || 'User'}
                  </span>
                  <FaChevronDown size={12} className={`dropdown-arrow ${isProfileDropdownOpen ? 'rotate' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <ProfileDropdown
  dropdownRef={dropdownRef}
  userName={name}
  userEmail={email}
  userData={userData}
  addressesCount={addresses.length}
  onClose={() => setIsProfileDropdownOpen(false)}
  onShowOrders={handleShowOrders}   // <-- pass the new prop
  onLogout={handleLogout}
/>
                )}
              </div>
            </>
          ) : (
            <button className="login-btn" onClick={handleLogin}>Login</button>
          )}
        </div>
      </header>

  

  
    </>
  );
};

export default Header;
