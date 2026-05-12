import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaForward, FaCheckCircle } from 'react-icons/fa';
import '../pages.css';
import api from '../../utils/Api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const contactFormHandler = async () => {
    try {
      setIsSubmitted(true);
      const { data } = await api.post("/user/contact-form",formData);
      setTimeout(() => {
        toast.success(data.message)

      }, 500);

      setTimeout(() => setIsSubmitted(false), 3000);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err.message)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();


   await contactFormHandler()
  };


  return (
    <div className="pages-container">
      <div className="contact-page">
        <div className="page-header">
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-subtitle">We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-layout">
          {/* Contact Info Cards */}
          <div className="contact-info-section">
            <div className="info-card contact-info-card">
              <div className="info-icon-wrapper">
                <FaEnvelope className="info-icon" />
              </div>
              <h3>Email Us</h3>
              <p>souran.g345@gmail.com</p>
              <p> harjeet_vx</p>
            </div>

            <div className="info-card contact-info-card">
              <div className="info-icon-wrapper">
                <FaPhone className="info-icon" />
              </div>
              <h3>Call Us</h3>
              <p>+91 (951) 725-0799</p>
              <p>Mon-Fri, 9AM - 6PM</p>
            </div>

            <div className="info-card contact-info-card">
              <div className="info-icon-wrapper">
                <FaMapMarkerAlt className="info-icon" />
              </div>
              <h3>Visit Us</h3>
              <p>123 Shopping Street</p>
              <p>South-Western Bathinda</p>
            </div>

            <div className="info-card contact-info-card">
              <div className="info-icon-wrapper">
                <FaClock className="info-icon" />
              </div>
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9AM - 8PM</p>
              <p>Saturday: 10AM - 6PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-container">
              <h2 className="form-title">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Contact Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <iframe
            title="location"
            src="https://www.google.com/maps?q=30.210995,74.945473&z=15&output=embed"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;