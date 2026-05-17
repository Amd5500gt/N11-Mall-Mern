import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../../context/SearchContext";
import {
  FiUser,
  FiMail,
  FiCheckCircle,
  FiLock,
  FiLogOut,
  FiChevronRight,
  FiShield,
  FiClock,
  FiShoppingBag,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../../../utils/Api";
import CustomAlert from "../../../ui/CustomAlert";
import ResetPassword from "../../../../Auth/pages/ForgetPassword/ResetPassword";
import "./ProfilePage.css";
import { useOrder } from "../../../../context/OrderContext";

const ProfilePage = () => {
  const { sortedOrders }  = useOrder()
  const [alert, setAlert] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [stats, setStats] = useState({
    orders: 0,
    joinedDate: "",
  });

  const navigate = useNavigate();
  const { userData, isLogged, handleLogout } = useSearch();

  // Redirect if not logged in
useEffect(() => {

  if (!isLogged) {

    navigate("/auth");

  } else {

    setStats({

      orders: sortedOrders.length,

 joinedDate :  new Date(userData.createdAt)
  .toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  )

    });

  }

}, [isLogged, navigate, sortedOrders]);

  // Send OTP for password reset
  const resetPassword = async () => {
    const email = userData?.email;

    try {
      setLoading(true);
      const res = await api.post("/auth/send-request", { email });
      const data = res.data;

      toast.success(data.message || "OTP sent successfully", {
        icon: "📧",
        duration: 3000,
        style: {
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          borderRadius: "12px",
        },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to send OTP",
        {
          duration: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle change password
  const handleChangePassword = () => {
    setAlert(true);
  };

  // Handle logout
  const handleUserLogout = () => {
    handleLogout();
    navigate("/");
  };

  // Send OTP when reset password page is shown
  useEffect(() => {
    if (showResetPassword) {
      resetPassword();
    }
  }, [showResetPassword]);

  // Show reset password page
  if (showResetPassword) {
    return <ResetPassword email={userData?.email} />;
  }

  return (
    <div className="profile-page">
      {/* HERO SECTION */}
      <div className="profile-hero">
        <div className="profile-avatar-wrapper">
          {userData?.picture?.trim() && !imageError ? (
            <img
              src={userData.picture}
              alt="Profile"
              className="profile-avatar"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="profile-fallback">
              <FiUser size={42} />
            </div>
          )}
        </div>

        <div className="profile-hero-content">
          <h1>{userData?.name || "User"}</h1>
          <p>{userData?.email}</p>
          <span className="status-badge">
            <FiCheckCircle /> Verified Account
          </span>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="profile-section">
        <h2 className="section-title">Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <FiShoppingBag className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{stats.orders}</span>
              <span className="stat-label">Orders Placed</span>
            </div>
          </div>
          <div className="stat-card">
            <FiClock className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">Member</span>
              <span className="stat-label">Since {stats.joinedDate}</span>
            </div>
          </div>
          <div className="stat-card">
            <FiShield className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">Verified</span>
              <span className="stat-label">Account Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACCOUNT INFORMATION */}
      <div className="profile-section">
        <h2 className="section-title">Account Information</h2>
        <div className="profile-list">
          <div className="profile-row">
            <div className="profile-row-left">
              <div className="profile-icon">
                <FiUser />
              </div>
              <div>
                <span>Full Name</span>
                <h4>{userData?.name || "Not provided"}</h4>
              </div>
            </div>
            <FiChevronRight />
          </div>

          <div className="profile-row">
            <div className="profile-row-left">
              <div className="profile-icon">
                <FiMail />
              </div>
              <div>
                <span>Email Address</span>
                <h4>{userData?.email || "Not provided"}</h4>
              </div>
            </div>
            <FiChevronRight />
          </div>
        </div>
      </div>

      {/* SECURITY & ACTIONS */}
      <div className="profile-section">
        <h2 className="section-title">Security & Actions</h2>
        <div className="profile-list">
          <button
            className="action-btn"
            onClick={handleChangePassword}
            disabled={loading}
          >
            <div className="profile-row-left">
              <div className="profile-icon">
                <FiLock />
              </div>
              <div>
                <h4>{loading ? "Sending OTP..." : "Change Password"}</h4>
    
              </div>
            </div>
            <FiChevronRight />
          </button>

          <button className="action-btn logout" onClick={handleUserLogout}>
            <div className="profile-row-left">
              <div className="profile-icon logout-icon">
                <FiLogOut />
              </div>
              <div>
                <h4>Logout</h4>
    
              </div>
            </div>
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* CUSTOM ALERT */}
      {alert && (
        <CustomAlert
          type="warning"
          message="An OTP will be sent to your email for verification"
          onClose={() => setAlert(false)}
          onShowPage={() => setShowResetPassword(true)}
        />
      )}
    </div>
  );
};

export default ProfilePage;