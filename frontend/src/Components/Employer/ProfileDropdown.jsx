import React from "react";
import { useNavigate } from "react-router-dom";
import '../../Styles/Login.css';

const ProfileDropdown = ({ userType, userProfile, onLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/${userType}/profile`); // Navigate to profile page
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-info">
        <img
          src={userProfile.profile_pic || "https://via.placeholder.com/40"}
          alt="Profile"
          className="profile-pic"
        />
        <span className="username">{userProfile.user_name}</span>
      </div>
      <div className="dropdown-menu">
        <button onClick={handleProfileClick}>Profile</button>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileDropdown;