import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Tab, Box } from '@mui/material';
import '../../Styles/Findjob.css';

function Profile() {
  const baseURL = "http://127.0.0.1:8000/";
  const token = localStorage.getItem('access');
  const [profileData, setProfileData] = useState({});
  const [eduData, setEduData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(baseURL + 'api/empjob/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          console.log("API Response:", response.data); // Log the response
          setProfileData(response.data.data || {});
          setEduData(response.data.data?.education || []);
          console.log("Education data set:", response.data.data?.education); // Debug
          setError(null);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (profileData?.skills) {
      const value = profileData.skills.split(',').map(skill => skill.trim());
      console.log("Skills parsed:", value); // Debug
      setSkills(value);
    } else {
      setSkills([]);
      console.log("No skills found in profile data"); // Debug
    }
  }, [profileData]);

  // Debug log for tab state changes
  useEffect(() => {
    console.log("Current active tab:", activeTab);
    console.log("Education data:", eduData);
    console.log("Skills data:", skills);
  }, [activeTab, eduData, skills]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleTabChange = (event, newValue) => {
    console.log("Tab changed to:", newValue); // Log the new tab value
    setActiveTab(newValue);
  };

  
  return (
    <div className="profile-container">
      {/* Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '16px',
                minWidth: '100px',
                padding: '10px 6px',
                margin: '10px 16px'
              },
              '& .Mui-selected': {
                color: '#007bff !important',
                fontWeight: 'bold'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#007bff'
              }
            }}
          >
            <Tab label="Profile" />
            <Tab label="Skills" />
            <Tab label="Education" />
          </Tabs>
        </Box>
        
        {/* Profile Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <div className="profileContainer">
              <div className="profileHeader">
                <img 
                  src={profileData.profile_pic ? `${baseURL}${profileData.profile_pic}` : "/default-avatar.png"} 
                  alt="Profile" 
                  className="profileImage" 
                />
                <div className="profileText">
                  <h2>{profileData.user_name || 'N/A'}</h2>
                  <p><strong>Email:</strong> {profileData.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {profileData.phone || 'N/A'}</p>
                  <p><strong>Location:</strong> {profileData.place || 'N/A'}</p>
                </div>
              </div>
              <div className="profileDetails">
                <p><strong>DOB:</strong> {profileData.dob || 'N/A'}</p>
                {profileData.resume && (
                  <p><strong>Resume:</strong>
                    <a href={`${baseURL}${profileData.resume}`} target="_blank" rel="noopener noreferrer" className="profileLinks">
                      Download
                    </a>
                  </p>
                )}
              </div>
            </div>
          </Box>
        )}
        
        {/* Skills Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <div className="skillsContainer">
              <h3>Skills</h3>
              <div className="skillsList">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span key={index} className="skillTag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills listed.</p>
                )}
              </div>
            </div>
          </Box>
        )}
        
        {/* Education Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <div className="educationContainer">
              <h3>Educational Details</h3>
              {eduData && eduData.length > 0 ? (
                <table className="educationTable">
                  <thead>
                    <tr>
                      <th>Education</th>
                      <th>College</th>
                      <th>Specialization</th>
                      <th>Completed</th>
                      <th>Mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eduData.map((edu, index) => (
                      <tr key={index}>
                        <td>{edu.education || 'N/A'}</td>
                        <td>{edu.college || 'N/A'}</td>
                        <td>{edu.specilization || 'N/A'}</td>
                        <td>{edu.completed || 'N/A'}</td>
                        <td>{edu.mark || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No educational details available.</p>
              )}
            </div>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default Profile;