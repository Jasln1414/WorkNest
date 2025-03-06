import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import logo from '../../assets/logo.jpg';

import SideBar from './SideBar'; // Import the SideBar component
import '../../Styles/Login.css'

function EmployerProfileView() {
  const baseURL = "http://127.0.0.1:8000/";
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  useEffect(() => {
    if (!token) {
      console.log("No access token found, redirecting to login");
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Fetching profile data from:", `${baseURL}api/empjob/profile/`);
        console.log("Using token:", token ? "Token exists" : "No token");

        const response = await axios.get(`${baseURL}api/empjob/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log("Full API response:", response);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        if (response.status === 200) {
          if (response.data && response.data.data) {
            setProfileData(response.data.data);
            dispatch(
              set_user_basic_details({
                profile_pic: response.data.data.profile_pic,
              })
            );
            navigate("/employer/profile");
          } else {
            setError('No profile data found in response');
          }
        } else {
          setError(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.data.message}`);
        } else if (error.request) {
          setError('No response received from server. Check if backend is running.');
        } else {
          setError(`Request error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseURL, token, dispatch, navigate]);

  if (loading) {
    return <div className="loading-container">Loading employer profile data...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading employer profile: {error}</h3>
        <p>Please check the console for more details.</p>
        <button onClick={() => navigate('/profile-creation')} className="error-button">
          Create Profile
        </button>
      </div>
    );
  }

  return (
    
    <div className="profile-container">
      {/* Render the SideBar component */}
      <SideBar />

      <div className="profile-view-wrapper">
        {/* Profile Picture */}
        <div className="profile-header">
          <div className="profile-pic-container">
            <img
              src={profileData.profile_pic ? `${baseURL}${profileData.profile_pic}` : logo}
              alt="Employer Profile"
              className="profile-pic"
            />
          </div>
          <h2 className="company-name">{profileData.user_full_name || 'Company Name Not Available'}</h2>
        </div>

        {/* Employer Information */}
        <div className="profile-info-container">
          <div className="info-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="info-item">
              <span className="info-icon">📧</span>
              <span className="info-text">{profileData.user_email || 'No Email Provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <span className="info-text">{profileData.phone || 'No Phone Provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🌐</span>
              <span className="info-text">
                {profileData.website_link ? (
                  <a href={profileData.website_link} target="_blank" rel="noopener noreferrer" className="info-link">
                    {profileData.website_link}
                  </a>
                ) : (
                  'No Website Provided'
                )}
              </span>
            </div>
          </div>

          <div className="info-section">
            <h3 className="section-title">Company Information</h3>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <span className="info-text">{profileData.headquarters || 'No Headquarters Provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🏢</span>
              <span className="info-text">{profileData.industry || 'No Industry Provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🏠</span>
              <span className="info-text">{profileData.address || 'No Address Provided'}</span>
            </div>
          </div>

          {/* About the Company */}
          <div className="info-section">
            <h3 className="section-title">About the Company</h3>
            <div className="info-item">
              <span className="info-text">{profileData.about || 'No description provided'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerProfileView;