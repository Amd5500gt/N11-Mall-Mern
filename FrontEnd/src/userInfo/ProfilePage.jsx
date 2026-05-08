// pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/Searchcontext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BASE_URL from "../config/config";

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '30px',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  avatarWrapper: {
    position: 'relative',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid #e5e7eb',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    display: 'flex',
    color: '#9ca3af',
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    color: '#4f46e5',
    fontSize: '18px',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '16px',
    color: '#1f2937',
    fontWeight: '500',
    margin: 0,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  },
  addressCount: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
    display: 'block',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};


const ProfilePage = () => {
  const { token, userData, setUserData, isLogged, userName, userEmail } = useSearch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  useEffect(() => {
    if (!isLogged) {
      navigate('/login');
      return;
    }

    if (userData) {
      setProfileForm({
        name: userData.name || userName || '',
        email: userData.email || userEmail || '',
        phone: userData.phone || '',
        avatar: userData.avatar || ''
      });
    }
  }, [isLogged, userData, userName, userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Profile</h1>
          <p style={styles.subtitle}>Manage your personal information</p>
        </div>
    
      </div>

      <div style={styles.content}>
        {/* Avatar Section */}
        <div style={styles.avatarSection}>
          <div style={styles.avatarWrapper}>
            {profileForm.avatar ? (
              <img 
                src={profileForm.avatar} 
                alt="Profile" 
                style={styles.avatarImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                <FiUser size={48} />
              </div>
            )}
           
          </div>
        
        </div>

        {/* Profile Form or View */}
        
          <div style={styles.infoCard}>
            <div style={styles.infoItem}>
              <div style={styles.iconWrapper}>
                <FiUser size={18} style={styles.icon} />
              </div>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>Full Name</div>
                <p style={styles.infoValue}>{userData?.name || userName || 'Not set'}</p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.iconWrapper}>
                <FiMail size={18} style={styles.icon} />
              </div>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>Email Address</div>
                <p style={styles.infoValue}>{userData?.email || userEmail || 'Not set'}</p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.iconWrapper}>
                <FiPhone size={18} style={styles.icon} />
              </div>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>Phone Number</div>
                <p style={styles.infoValue}>{userData?.phone || 'Not set'}</p>
              </div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.iconWrapper}>
                <FiCheck size={18} style={styles.icon} />
              </div>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>Account Status</div>
                <p style={styles.infoValue}>
                  <span style={styles.statusBadge}>Active</span>
                </p>
              </div>
            </div>
          </div>
     
      </div>
    </div>
  );
};

export default ProfilePage;