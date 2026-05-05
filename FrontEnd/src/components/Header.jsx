import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsCart, BsCartFill } from 'react-icons/bs';

import './components.css';
import { useSearch } from '../Context/SearchContext';
import { FiHome, FiInfo, FiPhone, FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { FaUserCircle, FaMoon, FaSun, FaChevronDown } from 'react-icons/fa';
import { useRef } from 'react';

const Header = ({ cartCount }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const profileBtnRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const location = useLocation();
  const [value, setValue] = useState("")
  const { setSearchTerm, token, setToken, userData, setUserData, isLogged, userName, userEmail, handleLogout } = useSearch()
  const navigate = useNavigate()
  console.log("isLogged:", isLogged);
  console.log("HEADER CONTEXT:", useSearch());
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profileBtnRef.current && !profileBtnRef.current.contains(event.target)) {
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
  const handleSearch = async () => {
    if (!value.trim()) return;
     const val = value.trim().toLowerCase();
    setSearchTerm(val)
  }
  const handleLogin = () => {
    navigate("/login")

  }

  // Profile dropdown items
  const profileMenuItems = [
    { name: 'My Profile', path: '/profile', icon: <FiUser size={16} /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings size={16} /> }
  ];

  return (
    <>
      <header className={`n11-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <Link className="logo" onClick={() => {
            setIsMobileMenuOpen(false)
          }}>
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
          <div className="search-box">
            <input
              value={value}
              onChange={(e) => {
                const val = e.target.value.trim().toLowerCase();
                setValue(val)
                setSearchTerm(val)
              }
              }
              className="search-input"
              type="text"
              placeholder="Search products..."
            />
            <button onClick={handleSearch} className="search-btn">
              🔍
            </button>
          </div>
          {
            isLogged ? (<>
              <Link to="/cart" className="cart-button">
                <div className="cart-icon-wrapper">
                  <BsCartFill className='cart-icon' />
                  {cartCount > 0 && (
                    <span className={`cart-badge ${animate ? 'animate' : ''}`}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="cart-text">Cart</span>
              </Link>

              <div className="user-section">
                <>
                  <button
                    ref={profileBtnRef}
                    className="profile-btn"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    {userData?.avatar ? (
                      <img src={userData.avatar} alt="Profile" className="profile-avatar" />
                    ) : (
                      <FaUserCircle size={28} />
                    )}
                    <span className="profile-name">
                      {userName?.split(' ')[0] || 'User'}
                    </span>
                    <FaChevronDown size={12} className={`dropdown-arrow ${isProfileDropdownOpen ? 'rotate' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div ref={dropdownRef} className="profile-dropdown">
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
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="dropdown-item"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item logout" onClick={() => {
                        handleLogout()
                        setIsProfileDropdownOpen(false);
                        setTimeout(() => {
                          navigate('/login');
                        }, 500);
                      }}>
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              </div>

            </>) : (<button className="login-btn" onClick={handleLogin}>
              Login
            </button>)
          }

        </div>

      </header>

    </>
  );
};


export default Header;