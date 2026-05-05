// pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../Context/SearchContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiCamera, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { token, userData, setUserData, isLogged, userName, userEmail } = useSearch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
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

    // Load user data
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (!profileForm.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (profileForm.phone && !/^\+?[\d\s-]{10,}$/.test(profileForm.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          avatar: profileForm.avatar
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update context with new user data
        setUserData({
          ...userData,
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          avatar: profileForm.avatar
        });
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      
      // If API fails, still update local state for better UX
      if (error.message === 'Failed to fetch') {
        setUserData({
          ...userData,
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          avatar: profileForm.avatar
        });
        
        // Save to localStorage as fallback
        const updatedUserData = {
          ...userData,
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          avatar: profileForm.avatar
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        toast.success('Profile updated locally!');
        setIsEditing(false);
      } else {
        toast.error(error.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setProfileForm({
      name: userData?.name || userName || '',
      email: userData?.email || userEmail || '',
      phone: userData?.phone || '',
      avatar: userData?.avatar || ''
    });
    setIsEditing(false);
  };

  if (!isLogged) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p className="profile-subtitle">Manage your personal information</p>
          </div>
          {!isEditing && (
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              <FiEdit2 size={18} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="profile-content">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {profileForm.avatar ? (
                <img 
                  src={profileForm.avatar} 
                  alt="Profile" 
                  className="profile-avatar-large"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.querySelector('.avatar-placeholder').style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="avatar-placeholder" 
                style={{ display: profileForm.avatar ? 'none' : 'flex' }}
              >
                <FiUser size={64} />
              </div>
              {isEditing && (
                <label className="change-avatar-btn" title="Change avatar">
                  <FiCamera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            {isEditing && (
              <p className="avatar-hint">Click camera icon to change avatar</p>
            )}
          </div>

          {/* Profile Form or View */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">
                  <FiUser size={16} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FiMail size={16} />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled
                />
                <small className="field-hint">Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <FiPhone size={16} />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  pattern="[\+]?[\d\s-]{10,}"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <FiX size={18} />
                  <span>Cancel</span>
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-card">
                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <FiUser className="info-icon" />
                  </div>
                  <div className="info-content">
                    <label>Full Name</label>
                    <p>{userData?.name || userName || 'Not set'}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <FiMail className="info-icon" />
                  </div>
                  <div className="info-content">
                    <label>Email Address</label>
                    <p>{userData?.email || userEmail || 'Not set'}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <FiPhone className="info-icon" />
                  </div>
                  <div className="info-content">
                    <label>Phone Number</label>
                    <p>{userData?.phone || 'Not set'}</p>
                  </div>
                </div>

                {userData?.addresses && userData.addresses.length > 0 && (
                  <div className="info-item">
                    <div className="info-icon-wrapper">
                      <FiMapPin className="info-icon" />
                    </div>
                    <div className="info-content">
                      <label>Default Address</label>
                      <p>
                        {userData.addresses.find(addr => addr.isDefault)?.street || 
                         userData.addresses[0]?.street || 'No address set'}
                      </p>
                      {userData.addresses.length > 1 && (
                        <span className="address-count">
                          +{userData.addresses.length - 1} more address(es)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Info */}
                <div className="info-item">
                  <div className="info-icon-wrapper">
                    <FiUser className="info-icon" />
                  </div>
                  <div className="info-content">
                    <label>Account Status</label>
                    <p>
                      <span className="status-badge active">Active</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;