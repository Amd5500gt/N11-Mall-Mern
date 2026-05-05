import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiInstagram, FiGithub, FiTwitter, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { BsSuitcase2 } from 'react-icons/bs';
import './components.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ]
  };

  const socialLinks = [
    { name: 'Instagram', icon: <FiInstagram size={20} />, url: 'https://www.instagram.com/harjeet_vx', color: '#E4405F' },
    { name: 'GitHub', icon: <FiGithub size={20} />, url: 'https://github.com/Amd5500gt', color: '#333' },
    { name: 'Twitter', icon: <FiTwitter size={20} />, url: 'https://www.twitter.com/harjeet_vx', color: '#1DA1F2' },
  ];

  return (
    <footer className="n11-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="currentColor" fillOpacity="0.9"/>
                  <circle cx="16" cy="16" r="4" fill="white"/>
                  <path d="M10 12L13 14L16 11L19 14L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <span className="footer-logo-text">N11<span className="logo-highlight">Mall</span></span>
            </Link>
            <p className="footer-description">
              Best deals, best prices, every day 💸 <br />
              Your one-stop destination for premium shopping experience with quality products and amazing discounts.
            </p>
            
            {/* Contact Info */}
            <div className="footer-contact-info">
              <div className="contact-item">
                <FiMail size={16} />
                <span>souran.g345@gmail.com</span>
              </div>
              <div className="contact-item">
                <FiPhone size={16} />
                <span>+91 (951) 724-0799</span>
              </div>
              <div className="contact-item">
                <FiMapPin size={16} />
                <span>123 Shopping Street, South-Western</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-links-column">
              <h3 className="footer-links-title">{category}</h3>
              <ul className="footer-links-list">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className={`footer-link ${location.pathname === link.path ? 'active' : ''}`}>
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
                />
                <button type="submit" className="newsletter-button">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {isSubmitted && (
                <div className="success-message">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Subscribed successfully!
                </div>
              )}
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
          <div className="footer-copyright">
            <p>© {currentYear} N11 Mall. All rights reserved.</p>
          </div>
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
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 15.8333V4.16667M10 4.16667L4.16667 10M10 4.16667L15.8333 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </footer>
  );
};

export default Footer;