import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiInstagram, FiGithub, FiTwitter, FiMail, FiMapPin, FiPhone, FiArrowUp } from 'react-icons/fi';
import { BsSuitcase2 } from 'react-icons/bs';
import './footer.css';
import logo from '../../assets/images/logo.png';
import { useSearch } from '../../context/SearchContext';
import toast from 'react-hot-toast';
import api from '../../utils/Api';
import InstallPWA from '../../InstallPWA';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { token } = useSearch();

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleSubscribe = async (e) => {

  e.preventDefault();

  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {

    toast.error("Enter valid email");

    return;

  }

  try {

    const { data } =
      await api.post(
        "/user/subscribe",
        { email }
      );

    toast.success(data.message);

    setIsSubmitted(true);

    setEmail('');

    } catch(err){
      toast.error(err.message)
    }
  }

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Orders', path: '/user/orders' },
    ]
  };

  const socialLinks = [
    { name: 'Instagram', icon: <FiInstagram size={20} />, url: 'https://www.instagram.com/harjeet_vx', color: '#E4405F' },
    { name: 'GitHub', icon: <FiGithub size={20} />, url: 'https://github.com/Amd5500gt', color: '#333' },
    { name: 'Twitter', icon: <FiTwitter size={20} />, url: 'https://www.twitter.com/harjeet_vx', color: '#1DA1F2' },
  ];

  if (!token) return null;

  return (
    <footer className="n11-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <img
                  src={logo}
                  alt="app-logo"
                  className="nxc-header-logo"
                />
              </div>
              <span className="footer-logo-text">Nex<span className="logo-highlight">Xcart</span></span>
            </Link>
            <p className="footer-description">
              Best deals, best prices, every day 💸
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-links-column">
              <h3 className="footer-links-title">{category}</h3>
              <ul className="footer-links-list">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className={`footer-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="footer-newsletter">
            <h3 className="footer-links-title">Newsletter</h3>
            <p className="newsletter-text">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                  aria-label="Email for newsletter"
                />
                <button onClick={()=>newsletterSubscribe(email)} type="submit" className="newsletter-button" aria-label="Subscribe">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Payment Methods */}
            <div className="payment-methods">
              <span className="payment-label">Secure Payments:</span>
              <div className="payment-icons">
                <span>💳</span>
                <span>💵</span>
                <span>🪙</span>
                <span>📱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-social-links">
         
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={social.name}
                style={{ '--social-color': social.color }}
              >
                {social.icon}
                <span className="social-name">{social.name}</span>
              </a>
            ))}
               <InstallPWA />
          </div>
          <div className="footer-copyright">
            <p>© {currentYear} NexXcart. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <FiArrowUp size={20} />
        </button>
      )}

      
    </footer>
  );
};

export default Footer;
