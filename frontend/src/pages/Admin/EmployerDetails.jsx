import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../../Components/admin/utilities/AdminSideBar';
import '../../styles/Admin/AdminHome.css';
import { Tabs, Tab, Box, Typography } from '@mui/material';

function Edetails() {
    // Provide a fallback value for baseURL
    const baseURL =  'http://127.0.0.1:8000';
    const { id } = useParams();
    const [employer, setEmployer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [render, setRender] = useState(false);
    const [tabValue, setTabValue] = useState(0); 

    console.log('baseURL:', baseURL); 
    console.log('id:', id); 

    useEffect(() => {
        console.log('useEffect is running'); 
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}/dashboard/employer/${id}`);
                console.log('API Response:', response); 

                if (response.status === 200) {
                    setEmployer(response.data);
                } else {
                    setError('Failed to fetch employer details');
                }
            } catch (error) {
                console.error('Error fetching employer details:', error);
                setError('Error fetching employer details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [render, baseURL, id]);

    const handleStatus = async (action) => {
        if (!employer) return;

        const formData = new FormData();
        formData.append('id', employer.id);
        formData.append('action', action);

        try {
            const response = await axios.post(`${baseURL}/dashboard/status/`, formData);
            if (response.status === 200) {
                setRender(!render); 
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Define handleTabChange function
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!employer || !employer.user) {
        return <p>No employer data found.</p>;
    }

    return (
       
            
            <div className="content">
                <Sidebar />
                {/* Tabs for Navigation */}
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                        maxWidth: { xs: '100%', sm: '400px', md: '600px' },
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
                    <Tab label="Address" />
                    <Tab label="About" />
                    <Tab label="Jobs" />
                </Tabs>

                {/* Tab Content */}
                <Box className="tabContent">
                    {/* Profile Tab */}
                    {tabValue === 0 && (
                        <div className="profileContainer">
                            <div className="profileHeader">
                                {employer.user.is_active ? (
                                    <button onClick={() => handleStatus('block')} className="statusButton blockButton">
                                        Block
                                    </button>
                                ) : (
                                    <button onClick={() => handleStatus('unblock')} className="statusButton unblockButton">
                                        Unblock
                                    </button>
                                )}
                            </div>
                            <div className="profileInfo">
                                {employer.profile_pic && (
                                    <img
                                        src={`${baseURL}${employer.profile_pic}`}
                                        alt="Profile"
                                        className="profileImage"
                                    />
                                )}
                                <div className="profileText">
                                    <h2>{employer.user.full_name}</h2>
                                    <p><strong>Email:</strong> {employer.user.email}</p>
                                    <p><strong>Phone:</strong> {employer.phone}</p>
                                    <p><strong>Headquarters:</strong> {employer.headquarters}</p>
                                    <p><strong>Website:</strong>
                                        <a href={employer.website_link} target="_blank" rel="noopener noreferrer">
                                            {employer.website_link}
                                        </a>
                                    </p>
                                    <p><strong>Industry:</strong> {employer.industry}</p>
                                    <p><strong>Date Joined:</strong>
                                        {new Date(employer.user.date_joined).toLocaleDateString()}
                                    </p>
                                    <p><strong>Last Login:</strong>
                                        {new Date(employer.user.last_login).toLocaleString()}
                                    </p>
                                    <p><strong>Status:</strong>
                                        {employer.user.is_active ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Address Tab */}
                    {tabValue === 1 && (
                        <div className="addressContainer">
                            <h3>Address</h3>
                            <p>{employer.address || 'No address available'}</p>
                        </div>
                    )}

                    {/* About Tab */}
                    {tabValue === 2 && (
                        <div className="aboutContainer">
                            <h3>About</h3>
                            <p>{employer.about || 'No details available'}</p>
                        </div>
                    )}

                    {/* Jobs Tab */}
                    {tabValue === 3 && (
                        <div className="jobsContainer">
                            <h3>Jobs Posted</h3>
                            <table className="jobsTable">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Posted Date</th>
                                        <th>Apply Before</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employer.jobs.map((job) => (
                                        <tr key={job.id}>
                                            <td>{job.title}</td>
                                            <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                                            <td>{new Date(job.applyBefore).toLocaleDateString()}</td>
                                            <td>{job.active ? 'Active' : 'Inactive'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Box>
            </div>
        
    );
}

export default Edetails;