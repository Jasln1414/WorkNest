import React, { useState } from 'react';
import logoimg from '../../assets/logoimg.jpg';
import { Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X } from 'lucide-react'; // Import Lucide icons
import '../../Styles/OTP.css';

function EmployerHeader() {
  const baseURL = 'http://127.0.0.1:8000';
  const userBasicDetails = useSelector((state) => state.user_basic_details);
  
  // Only add the baseURL if profile_pic doesn't already have it
  const profile_image = userBasicDetails.profile_pic ? 
    (userBasicDetails.profile_pic.startsWith('http') ? 
      userBasicDetails.profile_pic : 
      `${baseURL}${userBasicDetails.profile_pic}`) : 
    logoimg; // Fallback to logo if no profile pic

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
        <Link to="/employer/profile" className="w-full">
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
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links md:flex">
          <Link to="/employer/EmpHome" className="transition">
            <span>Home</span>
          </Link>
          <Link to="/employer/postjob" className="transition">
            <span>Post Job</span>
          </Link>
          <Link to="/employer/messages" className="transition">
            <span>Messages</span>
          </Link>
          <Link to="/employer/candidates" className="transition">
            <span>Candidates</span>
          </Link>
        </div>

        {/* User Profile Dropdown (Hidden on Mobile) */}
        <div className="header-actions hidden md:block">
          <div className="user-profile">
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <img 
                    src={profile_image} 
                    alt="Profile" 
                    className="profile-image" 
                    style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = logoimg; // Fallback image if profile pic fails to load
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
          <div className="flex-col">
            <Link 
              to="/employer/EmpHome" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/employer/postjob" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Post Job
            </Link>
            <Link 
              to="/employer/messages" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Messages
            </Link>
            <Link 
              to="/employer/candidates" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Candidates
            </Link>
            <Link 
              to="/employer/profile" 
              className="border-t"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button 
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

export default EmployerHeader;