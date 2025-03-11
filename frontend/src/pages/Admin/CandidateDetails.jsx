import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../Components/admin/utilities/AdminSideBar';
import axios from 'axios';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import '../../Styles/Admin/AdminHome.css';

function Cdetails() {
    const { id } = useParams();
    const baseURL = import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:8000';
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [render, setRender] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Fetch candidate data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}/dashboard/candidate/${id}`);
                if (response.status === 200) {
                    setCandidate(response.data);
                }
            } catch (error) {
                console.error(error);
                setError("Failed to load candidate data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [render, id, baseURL]);

    const handleStatus = async (action) => {
        if (!candidate) return;
    
        const formData = new FormData();
        formData.append("id", candidate.id);
        formData.append("action", action);
    
        try {
            // Get the token from local storage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No authentication token found. Please log in.");
            }
    
            // Make the API call with the token in the headers
            const response = await axios.post(`${baseURL}/dashboard/status`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Ensure proper content type for FormData
                'X-CSRFToken': document.cookie
                    .split('; ')
                    .find(row => row.startsWith('csrftoken='))
                    ?.split('=')[1], // Include CSRF token if required
                },
            });
    
            if (response.status === 200) {
                setRender(!render); // Refresh the data
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token is invalid or expired
                localStorage.removeItem('token'); // Clear the expired token
                window.location.href = '/login'; // Redirect to login page
            } else {
                console.error(error);
                setError("Failed to update candidate status. Please try again.");
            }
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Display loading state
    if (loading) {
        return (
            <div className="loading-container">
                <CircularProgress />
                <p>Loading candidate details...</p>
            </div>
        );
    }

    // Display error state
    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    // Display candidate details
    return (
        <div className="content">
            <Sidebar />
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                    maxWidth: { xs: '100%', sm: '400px', md: '500px' },
                    margin: '0 auto',
                    '& .MuiTab-root': {
                        flexGrow: 0,
                        padding: { xs: '4px 6px', sm: '6px 8px' },
                        minWidth: '60px',
                        maxWidth: '110px',
                        fontSize: { xs: '12px', sm: '14px' },
                        textTransform: 'none',
                        margin: '10px',
                    },
                    '& .MuiTabs-indicator': {
                        height: '2px',
                    },
                }}
            >
                <Tab label="Profile" />
                <Tab label="Skills" />
                <Tab label="Education" />
            </Tabs>

            <Box className="tabContent-admin">
                {/* Profile Tab */}
                {tabValue === 0 && (
                    <div className="profileContainer">
                        <div className="profileHeader">
                            {candidate.user && candidate.user.is_active ? (
                                <button
                                    onClick={() => handleStatus("block")}
                                    className="statusButton blockButton"
                                    aria-label="Block candidate"
                                >
                                    Block
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStatus("unblock")}
                                    className="statusButton unblockButton"
                                    aria-label="Unblock candidate"
                                >
                                    Unblock
                                </button>
                            )}
                        </div>
                        <div className="profileInfo">
                            {candidate.profile_pic && (
                                <img
                                    src={`${baseURL}${candidate.profile_pic}`}
                                    alt="Candidate profile"
                                    className="profileImage"
                                />
                            )}
                            <div className="profileText">
                                <h2>{candidate.user?.full_name || 'N/A'}</h2>
                                <p><strong>Email:</strong> {candidate.user?.email || 'N/A'}</p>
                                <p><strong>Id:</strong> {candidate.id || 'N/A'}</p>
                                <p><strong>Phone:</strong> {candidate.phone || 'N/A'}</p>
                                <p><strong>Place:</strong> {candidate.place || 'N/A'}</p>
                            </div>
                            <div className="profileDetails">
                                <p><strong>DOB:</strong> {candidate.dob || 'N/A'}</p>
                                {candidate.resume && (
                                    <p>
                                        <strong>Resume:</strong>
                                        <a
                                            href={`${baseURL}${candidate.resume}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="profileLinks"
                                        >
                                            Download
                                        </a>
                                    </p>
                                )}
                                <p><strong>Gender:</strong> {candidate.Gender || 'N/A'}</p>
                            </div>
                            <div className="profileLinks">
                                {candidate.linkedin && (
                                    <p>
                                        <strong>Linkedin:</strong>
                                        <a
                                            href={candidate.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {candidate.linkedin}
                                        </a>
                                    </p>
                                )}
                                {candidate.github && (
                                    <p>
                                        <strong>Github:</strong>
                                        <a
                                            href={candidate.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {candidate.github}
                                        </a>
                                    </p>
                                )}
                                <p><strong>Status:</strong> {candidate.user?.is_active ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                        <div className="profileFooter">
                            <p><strong>Date Joined:</strong> {candidate.user?.date_joined ? new Date(candidate.user.date_joined).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Last Login:</strong> {candidate.user?.last_login ? new Date(candidate.user.last_login).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                )}

                {/* Skills Tab */}
                {tabValue === 1 && (
                    <div className="skillsContainer">
                        <h3>Skills</h3>
                        <p>
                            {candidate.skills
                                ? candidate.skills.split(',').map((skill, index) => (
                                    <span key={index} className="skill-text">
                                        {skill.trim()}
                                    </span>
                                ))
                                : 'No skills listed'}
                        </p>
                    </div>
                )}

                {/* Education Tab */}
                {tabValue === 2 && (
                    <div className="educationContainer">
                        <h3>Educational Details</h3>
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
                                {candidate.education && candidate.education.length > 0 ? (
                                    candidate.education.map((edu, index) => (
                                        <tr key={index}>
                                            <td>{edu.education || 'N/A'}</td>
                                            <td>{edu.college || 'N/A'}</td>
                                            <td>{edu.specilization || 'N/A'}</td>
                                            <td>{edu.completed || 'N/A'}</td>
                                            <td>{edu.mark || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No educational details available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Box>
        </div>
    );
}

export default Cdetails;