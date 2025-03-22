import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/USER/Home.css";
import EditProfileModal from "./utilities/EditModal";

function Profile() {
  const baseURL = "http://127.0.0.1:8000/";
  const token = localStorage.getItem("access");
  const [profileData, setProfileData] = useState({});
  const [eduData, setEduData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for modal visibility

  // Function to fetch profile data
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseURL + "api/empjob/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setProfileData(response.data.data || {});
        setEduData(response.data.data?.education || []);
        setError(null);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh profile data after updates
  const refreshProfile = () => {
    fetchProfileData();
  };

  useEffect(() => {
    fetchProfileData();
  }, [token]);

  useEffect(() => {
    if (profileData?.skills) {
      const value = profileData.skills.split(",").map((skill) => skill.trim());
      setSkills(value);
    } else {
      setSkills([]);
    }
  }, [profileData]);

  // Function to handle the edit button click
  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h3>Loading profile information...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button className="error-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="ep-main-container">
     

      {/* Profile Details Section */}
      <div className="ep-content-wrapper">
        {/* Profile header with avatar and name */}
        <div className="ep-header-section">
          <div className="ep-avatar-wrapper">
            <img
              src={
                profileData.profile_pic
                  ? `${baseURL}${profileData.profile_pic}`
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="ep-avatar-image"
            />
          </div>
          <div>
            <h1 className="ep-company-title">{profileData.user_name || "N/A"}</h1>
            <p className="ep-data-text">
              {profileData.place || "Location not specified"}
            </p>
          </div>
          {/* Add Edit Profile Button */}
          <div className="ep-edit-button-container">
            <button className="ep-edit-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="ep-info-row">
          <div className="ep-detail-block">
            <div className="ep-block-header">
              <h3 className="ep-block-heading">Personal Information</h3>
            </div>

            <div className="ep-detail-row">
              <div className="ep-icon">📧</div>
              <div className="ep-data-text">
                <strong>Email:</strong> {profileData.email || "N/A"}
              </div>
            </div>

            <div className="ep-detail-row">
              <div className="ep-icon">📱</div>
              <div className="ep-data-text">
                <strong>Phone:</strong> {profileData.phone || "N/A"}
              </div>
            </div>

            <div className="ep-detail-row">
              <div className="ep-icon">🎂</div>
              <div className="ep-data-text">
                <strong>Date of Birth:</strong> {profileData.dob || "N/A"}
              </div>
            </div>

            <div className="ep-detail-row">
              <div className="ep-icon">👤</div>
              <div className="ep-data-text">
                <strong>Gender:</strong> {profileData.Gender || "N/A"}
              </div>
            </div>

            {profileData.resume && (
              <div className="ep-detail-row">
                <div className="ep-icon">📄</div>
                <div className="ep-data-text">
                  <strong>Resume:</strong>
                  <a
                    href={`${baseURL}${profileData.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ep-external-link"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="ep-detail-block ep-full-width">
          <div className="ep-block-header">
            <h3 className="ep-block-heading">Social Links</h3>
          </div>
          <div className="ep-detail-row">
            <div className="ep-icon">🔗</div>
            <div className="ep-data-text">
              <strong>LinkedIn:</strong>{" "}
              {profileData.linkedin ? (
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ep-external-link"
                >
                  {profileData.linkedin}
                </a>
              ) : (
                "N/A"
              )}
            </div>
          </div>
          <div className="ep-detail-row">
            <div className="ep-icon">💻</div>
            <div className="ep-data-text">
              <strong>GitHub:</strong>{" "}
              {profileData.github ? (
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ep-external-link"
                >
                  {profileData.github}
                </a>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="ep-detail-block ep-full-width">
          <div className="ep-block-header">
            <h3 className="ep-block-heading">Skills</h3>
          </div>
          <div className="ep-skills-container">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span key={index} className="ep-skill-tag">
                  {skill}
                </span>
              ))
            ) : (
              <p className="ep-no-data">No skills added yet</p>
            )}
          </div>
        </div>

       



       {/* Education Section */}
<div className="ep-detail-block ep-full-width">
  <div className="ep-block-header">
    <h3 className="ep-block-heading">Education</h3>
  </div>
  {eduData.length > 0 ? (
    <table className="ep-education-table">
      <thead>
        <tr>
          <th>Education</th>
          <th>Specialization</th>
          <th>College</th>
          <th>Year Completed</th>
          <th>Mark</th>
        </tr>
      </thead>
      <tbody>
        {eduData.map((edu, index) => (
          <tr key={index} className="ep-education-item">
            <td>{edu.education}</td>
            <td>{edu.specilization}</td>
            <td>{edu.college}</td>
            <td>{new Date(edu.completed).getFullYear()}</td>
            <td>{edu.mark}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="ep-no-data">No education details added yet</p>
  )}
</div>
</div>
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={profileData}
          refreshProfile={refreshProfile}
        />
      )}
    </div>
  );
}

export default Profile;