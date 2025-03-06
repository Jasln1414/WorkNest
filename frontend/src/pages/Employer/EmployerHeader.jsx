import React, { useEffect, useState } from 'react';
import logoimg from '../../assets/logoimg.jpg';
import { Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { useSelector, useDispatch } from 'react-redux';




import "../../Styles/SideBar.css"; // Import the CSS file

function EmployerHeader() {
  const authentication_user = useSelector((state) => state.authentication_user);
  const userBasicDetails = useSelector((state) => state.user_basic_details);
  const baseURL = 'http://127.0.0.1:8000/';
  const profile_image = `${baseURL}${userBasicDetails.profile_pic}`;

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
    navigate("/");
  };

  const items = [
    {
      label: <p>Profile</p>,
      key: "0",
    },
    {
      label: <p onClick={handleLogout}>Logout</p>,
      key: "1",
    },
  ];

  return (
    <div className="header-container">
     
        <div className="logo-container">
          <div className="logo-image">
            <img src={logoimg} alt="Logo" />
          </div>
          <p className="logo-text">WorkNest</p>
        </div>
     

      <div className="header-right">
        <div className="divider" />
        <div className="profile-dropdown">
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <img src={profile_image} alt="Profile" className="profile-image" />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default EmployerHeader;