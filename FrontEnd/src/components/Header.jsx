import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsCart, BsCartFill } from 'react-icons/bs';
import { FiHome, FiInfo, FiPhone, FiMenu, FiX } from 'react-icons/fi';
import './components.css';
import AuthPages from '../User/Auth';

const Header = ({ cartCount, FindItems, user}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const location = useLocation();
  const [searchValue,setSearchValue] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

    const LoginChecker = ()=>{
     return <h2 style={{textAlign:"center", color:'blue'}}>Login First!</h2>
      setTimeout(() => {
      navigate("/auth")
    }, 2000);
  }


  return (
    <>
      <header className={`n11-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <Link className="logo" onClick={() =>{
          setIsMobileMenuOpen(false)


          } }>
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="currentColor" fillOpacity="0.9"/>
                <circle cx="16" cy="16" r="4" fill="white"/>
                <path d="M10 12L13 14L16 11L19 14L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
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
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    className="search-input"
    type="text"
    placeholder="Search products..."
  />
  <button onClick={() => FindItems(searchValue)} className="search-btn">
    🔍
  </button>
</div>
        {

         user ?    <Link to="/cart" className="cart-button">
            <div className="cart-icon-wrapper">
              <BsCartFill size={20} />
              {cartCount > 0 && (
                <span className={`cart-badge ${animate ? 'animate' : ''}`}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="cart-text">Cart</span>
          </Link> : <Link className='cart-button' to={"/auth"} onClick={LoginChecker}> Login / Register </Link>
        }
    

        </div>


        
      </header>

      {/* Overlay for mobile menu */}
    
    </>
  );
};

export default Header;