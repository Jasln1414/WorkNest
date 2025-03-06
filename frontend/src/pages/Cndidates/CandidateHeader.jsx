import React, { useEffect, useState } from 'react';
import logoimg from '../../assets/logoimg.jpg';
import { Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { useSelector, useDispatch } from 'react-redux';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import { FaUserTie } from 'react-icons/fa';
import axios from 'axios';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import '../../Styles/Login.css';

function CandidateHeader() {
  const baseURL = 'http://127.0.0.1:8000/';
  const authentication_user = useSelector((state) => state.authentication_user);
  const userBasicDetails = useSelector((state) => state.user_basic_details);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile_image = `${baseURL}${userBasicDetails.profile_pic}`;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

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

  const items = [
    {
      label: (
        <Link to="/candidate/profile">
          <p>Profile</p>
        </Link>
      ),
      key: '0',
    },
    {
      label: <p onClick={handleLogout}>Logout</p>,
      key: '1',
    },
  ];

  return (
    <div className="header-container">
      {/* Logo and Name on the Left */}
      <div className="logo-container">
        <div className="logo-image">
          <img src={logoimg} alt="Logo" />
        </div>
        <p className="logo-text">WorkNest</p>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/candidate/find-job">
          <span>Home</span>
        </Link>
        <span>Messages</span>
        <span>Notifications</span>
        <span>Saved Jobs</span>
      </div>

      {/* Profile Picture on the Right */}
      <div className="header-actions">
        <div className="user-profile">
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {authentication_user.isAuthenticated ? (
                  <img
                    className="profile-image authenticated"
                    src={profile_image}
                    alt="User avatar"
                  />
                ) : (
                  <img
                    className="profile-image default"
                    src={""}
                    alt="Default avatar"
                  />
                )}
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default CandidateHeader;