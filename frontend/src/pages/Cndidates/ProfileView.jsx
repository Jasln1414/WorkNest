import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../Styles/SideBar.css';

function Profile() {
  const baseURL = "http://127.0.0.1:8000/";
  const token = localStorage.getItem('access');
  const [profileData, setProfileData] = useState({});
  const [eduData, setEduData] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + 'api/empjob/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          setProfileData(response.data.data);
          setEduData(response.data.data.education);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (profileData?.skills) {
      const value = profileData.skills.split(',');
      setSkills(value);
    } else {
      setSkills([]);
    }
  }, [profileData]);

  return (
    <div className="candidate-profile-container">
      <div className="candidate-profile-grid">
        {/* Personal Info Section */}
        <div className="candidate-profile-section">
          <div className="candidate-profile-section-header">
            <h2>Personal Info</h2>
          </div>
          <div className="candidate-personal-info-content">
            <img 
              src={`${baseURL}${profileData.profile_pic}`} 
              alt="Avatar" 
              className="candidate-profile-avatar" 
            />
            <div className="candidate-personal-details">
              <div className="candidate-personal-details-item">
                <span>{profileData.user_name}</span>
              </div>
              <div className="candidate-personal-details-item">
                <span>{profileData.place}</span>
              </div>
              <div className="candidate-personal-details-item">
                <span>{profileData.email}</span>
              </div>
              <div className="candidate-personal-details-item">
                <span>{profileData.phone}</span>
              </div>
              <div className="candidate-personal-details-item">
                <span>{profileData.Gender}</span>
              </div>
              <div className="candidate-personal-details-item">
                <span>{profileData.dob}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="candidate-profile-section">
          <div className="candidate-profile-section-header">
            <h2>Skills</h2>
          </div>
          <div className="candidate-skills-container">
            {skills.map((skill, index) => (
              <div key={index} className="candidate-skill-tag">{skill}</div>
            ))}
          </div>
        </div>

        {/* Education and Other Info Container */}
        <div className="candidate-education-other-container">
          {/* Education Section */}
          <div className="candidate-profile-section">
            <div className="candidate-profile-section-header">
              <h2>Educational Info</h2>
            </div>
            <table className="candidate-education-table">
              <thead>
                <tr>
                  <th>Education</th>
                  <th>Specialization</th>
                  <th>College</th>
                  <th>Completed</th>
                  <th>Mark</th>
                </tr>
              </thead>
              <tbody>
                {eduData.map((edu, index) => (
                  <tr key={index}>
                    <td>{edu.education}</td>
                    <td>{edu.specilization}</td>
                    <td>{edu.college}</td>
                    <td>{edu.completed}</td>
                    <td>{edu.mark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Other Info Section */}
          <div className="candidate-profile-section">
            <div className="candidate-profile-section-header">
              <h2>Other Info</h2>
            </div>
            <div className="candidate-other-info-content">
              <div className="candidate-other-info-labels">
                <p>Linkedin</p>
                <p>GitHub</p>
                <p>Resume</p>
              </div>
              <div className="candidate-other-info-values">
                <p>{profileData.linkedin}</p>
                <p>{profileData.github}</p>
                <p>
                  <a
                    href={`${baseURL}${profileData.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;