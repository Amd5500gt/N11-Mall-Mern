import React from 'react';
import { FaRocket, FaGlobe, FaHeart, FaFire, FaBolt, FaBox, FaHeadset, FaShoppingBag, FaTrophy, FaUsers, FaShieldAlt, FaCreditCard } from 'react-icons/fa';
import '../pages.css';

const About = () => {
  const features = [
    { icon: <FaRocket />, title: 'Fast & Responsive', desc: 'Lightning fast loading times and smooth navigation' },
    { icon: <FaShoppingBag />, title: 'Easy Checkout', desc: 'Simple and secure checkout process' },
    { icon: <FaShieldAlt />, title: 'Secure Payments', desc: '100% secure payment gateway' },
    { icon: <FaBolt />, title: 'Real-time Updates', desc: 'Get instant updates on your orders' },
    { icon: <FaUsers />, title: 'User Friendly', desc: 'Intuitive interface for everyone' },
    { icon: <FaCreditCard />, title: 'Multiple Payments', desc: 'Support for all payment methods' }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '10K+', label: 'Products Sold' },
    { number: '4.8', label: 'Rating' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="pages-container">
      <div className="about-page">
        {/* Hero Section */}
        <div className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-title">About <span className="highlight">N11 Mall</span></h1>
            <p className="about-subtitle">Your ultimate online shopping destination where convenience meets quality.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="mission-vision-section">
          <div className="mission-card">
            <div className="card-icon">
              <FaRocket />
            </div>
            <h3>Our Mission</h3>
            <p>To make online shopping easy, fast, and affordable for everyone, while delivering high-quality products at the best prices.</p>
          </div>
          <div className="vision-card">
            <div className="card-icon">
              <FaGlobe />
            </div>
            <h3>Our Vision</h3>
            <p>To become one of the most trusted and loved online shopping platforms, where users can discover everything they need in one place.</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="why-choose-section">
          <h2 className="section-title">Why <span className="highlight">Choose Us</span></h2>
          <p className="section-subtitle">We focus on providing a clean UI, fast performance, secure payments, and a user-friendly experience for every customer.</p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="offer-section">
          <h2 className="section-title">What <span className="highlight">We Offer</span></h2>
          <div className="offer-grid">
            <div className="offer-card">
              <FaFire className="offer-icon" />
              <h4>Wide Variety</h4>
              <p>Fashion, electronics, groceries, and more at competitive prices</p>
            </div>
            <div className="offer-card">
              <FaBox className="offer-icon" />
              <h4>Fast Delivery</h4>
              <p>Quick and safe delivery to your doorstep</p>
            </div>
            <div className="offer-card">
              <FaHeadset className="offer-icon" />
              <h4>24/7 Support</h4>
              <p>Always ready to help with your queries</p>
            </div>
            <div className="offer-card">
              <FaTrophy className="offer-icon" />
              <h4>Best Deals</h4>
              <p>Exciting offers and discounts every day</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="values-section">
          <h2 className="section-title">Our <span className="highlight">Core Values</span></h2>
          <div className="values-grid">
            <div className="value-item">
              <FaHeart className="value-icon" />
              <h4>Customer First</h4>
            </div>
            <div className="value-item">
              <FaShieldAlt className="value-icon" />
              <h4>Trust & Transparency</h4>
            </div>
            <div className="value-item">
              <FaBolt className="value-icon" />
              <h4>Innovation</h4>
            </div>
            <div className="value-item">
              <FaUsers className="value-icon" />
              <h4>Community</h4>
            </div>
          </div>
        </div>

        {/* Closing Line */}
        <div className="closing-section">
          <p className="closing-text">💫 N11 Mall – Shop Smart, Live Better!</p>
        </div>
      </div>
    </div>
  );
};

export default About;