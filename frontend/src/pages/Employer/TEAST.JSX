import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import hero from "../assets/hero.jpg";
import logo from "../assets/logo.jpg";
import "../Styles/LandingPage.css";

const LandingPage = () => {
  return (
    <div>
      <div className="container">
        <div className="Post-job">
          <img src={logo} alt="Find Job" />
          <Link to="/candidate/find-job">
          <button>FIND JOB</button>
          </Link>
        </div>
       
        <div className="Post-job">
          <img src={hero} alt="Post Job" />
          {/* Use Link to navigate to the PostJob page */}
          <Link to="/employer/PostJob">
            <button>POST JOB</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, 
  BookOpen, Code, Link, FileText, Award, Briefcase, 
  Database, Shield, Monitor, Edit
} from "lucide-react";
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
    fetchData();
  }, [token]);

  useEffect(() => {
    if (profileData?.skills) {
      const value = profileData.skills.split(',').map(skill => skill.trim());
      setSkills(value);
    } else {
      setSkills([]);
    }
  }, [profileData]);

  if (loading) {
    return (
      <div className="ch-loading-container">
        <div className="ch-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="ch-error-message">{error}</div>;
  }

  // Group skills by category for better organization
  const skillCategories = {
    "Programming": ["JavaScript", "Python", "Java", "C++", "PHP", "Ruby"],
    "Web": ["HTML", "CSS", "React", "Angular", "Vue", "Node.js"],
    "Database": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Firebase"],
    "Tools": ["Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP"]
  };

  // Helper function to categorize skills
  const categorizeSkills = (skillList) => {
    const categorized = {};
    
    skillList.forEach(skill => {
      let foundCategory = false;
      
      for (const [category, items] of Object.entries(skillCategories)) {
        if (items.some(item => skill.toLowerCase().includes(item.toLowerCase()))) {
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push(skill);
          foundCategory = true;
          break;
        }
      }
      
      if (!foundCategory) {
        if (!categorized["Other"]) categorized["Other"] = [];
        categorized["Other"].push(skill);
      }
    });
    
    return categorized;
  };

  const categorizedSkills = categorizeSkills(skills);

  // Icons for skill categories
  const categoryIcons = {
    "Programming": <Code size={20} />,
    "Web": <Monitor size={20} />,
    "Database": <Database size={20} />,
    "Tools": <Briefcase size={20} />,
    "Other": <Award size={20} />
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Tab items
  const tabItems = [
    { label: "Overview", icon: <User size={20} /> },
    { label: "Personal", icon: <MapPin size={20} /> },
    { label: "Skills", icon: <Code size={20} /> },
    { label: "Education", icon: <GraduationCap size={20} /> },
    { label: "Other Info", icon: <FileText size={20} /> }
  ];

  
    return (
      <div className="profile-container">
        <div className="profile-header-section">
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <img src="path_to_avatar_image" alt="Profile Avatar" className="profile-avatar" />
            </div>
            <div className="profile-header-info">
              <h1>Profile Name</h1>
              <div className="profile-quick-info">
                <span>Info 1</span>
                <span>Info 2</span>
                <span>Info 3</span>
              </div>
              <button className="edit-profile-btn">Edit Profile</button>
            </div>
          </div>
        </div>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="profile navigation tabs"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: '48px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 'medium',
              }
            }}
          >
            {tabItems.map((tab, index) => (
              <Tab 
                key={index} 
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                }
                id={`profile-tab-${index}`}
                aria-controls={`profile-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>
        <div className="tab-content">
          {/* Your tab content here */}
        </div>
        <div className="profile-grid">
          <div className="profile-section">
            <div className="profile-section-header">
              <h2><span className="header-icon">🏠</span>Section 1</h2>
            </div>
            <div className="personal-info-content">
              <div className="personal-details">
                <div className="personal-details-item">
                  <span className="icon">📧</span><span>Email: user@example.com</span>
                </div>
                <div className="personal-details-item">
                  <span className="icon">📞</span><span>Phone: (123) 456-7890</span>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-section full-width">
            <div className="profile-section-header">
              <h2><span className="header-icon">🧑‍🎓</span>Education</h2>
            </div>
            <div className="education-summary">
              <div className="education-item">
                <h3>Bachelor of Science in Computer Science</h3>
                <p><span className="icon">🏛️</span>University Name</p>
                <p><span className="icon">📅</span>Graduation Year</p>
              </div>
            </div>
            <div className="education-table-container">
              <table className="education-table">
                <thead>
                  <tr>
                    <th><span className="icon">🏛️</span>Institution</th>
                    <th><span className="icon">🎓</span>Degree</th>
                    <th><span className="icon">📅</span>Year</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>University Name</td>
                    <td>Bachelor of Science in Computer Science</td>
                    <td>Graduation Year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="education-cards">
              <div className="education-card">
                <div className="education-card-header">
                  <h3>Bachelor of Science in Computer Science</h3>
                </div>
                <div className="education-card-content">
                  <p><span className="icon">🏛️</span>University Name</p>
                  <p><span className="icon">📅</span>Graduation Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Profile;
  