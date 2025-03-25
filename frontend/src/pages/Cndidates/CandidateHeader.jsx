import React, { useState } from 'react';
import logoimg from '../../assets/logoimg.jpg';
import { Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react';
import NotificationsComponent from '../../Components/Notifications/Notifications';
import '../../Styles/OTP.css';

function CandidateHeader() {
  const baseURL = 'http://127.0.0.1:8000';
  const userBasicDetails = useSelector((state) => state.user_basic_details || {});
  
  const profile_image = userBasicDetails.profile_pic ? 
    (userBasicDetails.profile_pic.startsWith('http') ? 
      userBasicDetails.profile_pic : 
      `${baseURL}${userBasicDetails.profile_pic}`) : 
    logoimg;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(
      set_Authentication({
        name: null,
        email: null,
        isAuthenticated: false,
        isAdmin: false,
        usertype: null,
      })
    );
    dispatch(
      set_user_basic_details({
        name: null,
        email: null,
        phone: null,
        profile_pic: null,
        user_type_id: null,
      })
    );
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const items = [
    {
      label: (
        <Link to="/candidate/profile" className="w-full">
          <p className="dropdown-item">Profile</p>
        </Link>
      ),
      key: '0',
    },
    {
      label: <p className="dropdown-item" onClick={handleLogout}>Logout</p>,
      key: '1',
    }
  ];

  return (
    <div className="employer">
      <div className="header-container">
        {/* Logo Container */}
        <div className="logo-container">
          <div className="logo-image">
            <img 
              src={logoimg} 
              alt="Logo" 
              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
            />
          </div>
          <p className="logo-text">WorkNest</p>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="mobile-menu-button focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links md:flex">
          <Link to="/candidate/find-job" className="transition">
            <span>Home</span>
          </Link>
          <Link to="/candidate/messages" className="transition">
            <span>Messages</span>
          </Link>
          <Link to="/candidate/SavedJobs" className="transition">
            <span>Saved Jobs</span>
          </Link>
          <Link to="/candidate/applyedjobs" className="transition">
            <span>Applied Jobs</span>
          </Link>
        </div>

        {/* User Profile Dropdown (Hidden on Mobile) */}
        <div className="header-actions hidden md:flex items-center gap-4">
          {/* Notifications Component */}
          <div className="notifications-wrapper">
            <NotificationsComponent />
          </div>
          
          <div className="user-profile">
            <Dropdown menu={{ items }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <img 
                    src={profile_image} 
                    alt="Profile" 
                    className="profile-image" 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = logoimg;
                    }}
                  />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu md:hidden">
          <div className="flex flex-col gap-4 p-4">
            <Link 
              to="/candidate/find-job" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/candidate/messages" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Messages
            </Link>
            <Link 
              to="/candidate/notifications" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Notifications
            </Link>
            <Link 
              to="/candidate/SavedJobs" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Saved Jobs
            </Link>
            <Link 
              to="/candidate/applyedjobs" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Applied Jobs
            </Link>
            <Link 
              to="/candidate/profile" 
              className="mobile-menu-item border-t pt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button 
              className="mobile-menu-item text-left"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateHeader;