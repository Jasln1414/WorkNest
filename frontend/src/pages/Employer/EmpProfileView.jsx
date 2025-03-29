import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import logo from '../../assets/logo.jpg';
import SideBar from './SideBar';
import EditEmployerProfileModal from './EditEmployerProfileModal';
import '../../Styles/EmpProfile.css';

function EmployerProfileView() {
  const baseURL = "http://127.0.0.1:8000/";
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Utility function to properly construct image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return logo; // Fallback to default logo if no image
    if (imagePath.startsWith('http')) return imagePath; // Already absolute URL
    // Handle relative URLs (remove leading slash if present)
    return `${baseURL}${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
  };

  // Function to get CSRF token from cookies
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const csrfToken = getCookie('csrftoken');

  // Fetch profile data
  useEffect(() => {
    if (!token) {
      console.log("No access token found, redirecting to login");
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}api/empjob/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRFToken': csrfToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          if (response.data && response.data.data) {
            setProfileData(response.data.data);
            dispatch(
              set_user_basic_details({
                profile_pic: response.data.data.profile_pic,
              })
            );
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
  }, [baseURL, token, dispatch, navigate, csrfToken]);

  // Handle Edit Button Click
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Handle Save After Editing
  const handleSave = async (updatedData) => {
    try {
      const response = await axios.put(`${baseURL}api/account/employer/profile/update/`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRFToken': csrfToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setProfileData(updatedData);
        dispatch(set_user_basic_details({ profile_pic: updatedData.profile_pic }));
        setIsEditModalOpen(false);
      } else {
        setError(`Failed to update profile: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating profile data:', error);
      setError(`Error updating profile: ${error.message}`);
    }
  };

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
    <div className="ep-main-container">
      <div className="ep-sidebar-fixed">
        <h2 className="main-head">EMPLOYER</h2>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="ep-content-wrapper">
        {/* Profile Header with Picture */}
        <div className="ep-header-section">
          <div className="ep-avatar-wrapper">
            <img
              src={getImageUrl(profileData.profile_pic)}
              alt="Employer Profile"
              className="ep-avatar-image"
            />
          </div>
          <h2 className="ep-company-title">{profileData.user_full_name || 'Company Name Not Available'}</h2>
          <button onClick={handleEditClick} className="edit-profile-button">Edit Profile</button>
        </div>

        {/* Two-column layout for Contact and Company Information */}
        <div className="ep-info-row">
          {/* Contact Information */}
          <div className="ep-detail-block">
            <h3 className="ep-block-heading">Contact Information</h3>
            <div className="ep-detail-row">
              <span className="ep-icon">📧</span>
              <span className="ep-data-text">{profileData.user_email || 'No Email Provided'}</span>
            </div>
            <div className="ep-detail-row">
              <span className="ep-icon">📞</span>
              <span className="ep-data-text">{profileData.phone || 'No Phone Provided'}</span>
            </div>
            <div className="ep-detail-row">
              <span className="ep-icon">🌐</span>
              <span className="ep-data-text">
                {profileData.website_link ? (
                  <a href={profileData.website_link} target="_blank" rel="noopener noreferrer" className="ep-external-link">
                    {profileData.website_link}
                  </a>
                ) : (
                  'No Website Provided'
                )}
              </span>
            </div>
          </div>

          {/* Company Information */}
          <div className="ep-detail-block">
            <h3 className="ep-block-heading">Company Information</h3>
            <div className="ep-detail-row">
              <span className="ep-icon">📍</span>
              <span className="ep-data-text">{profileData.headquarters || 'No Headquarters Provided'}</span>
            </div>
            <div className="ep-detail-row">
              <span className="ep-icon">🏢</span>
              <span className="ep-data-text">{profileData.industry || 'No Industry Provided'}</span>
            </div>
            <div className="ep-detail-row">
              <span className="ep-icon">🏠</span>
              <span className="ep-data-text">{profileData.address || 'No Address Provided'}</span>
            </div>
          </div>
        </div>

        {/* About the Company - Full Width Below */}
        <div className="ep-detail-block ep-full-width">
          <h3 className="ep-block-heading">About the Company</h3>
          <div className="ep-detail-row">
            <span className="ep-description-text">{profileData.about || 'No description provided'}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditEmployerProfileModal
          profileData={profileData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default EmployerProfileView;