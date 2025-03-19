import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import StatusJob from './StatusJob';
import { useMediaQuery } from 'react-responsive';
import '../../../Styles/USER/Home.css';

function ApplyedJob() {
    const baseURL = 'http://127.0.0.1:8000';
    const token = localStorage.getItem('access');
    const navigate = useNavigate();
    const authentication_user = useSelector((state) => state.authentication_user);
    const [jobData, setJobData] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchApplyedJobs = async () => {
            try {
                const response = await axios.get(baseURL + '/api/empjob/getApplyedjobs/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200 && response.data.length > 0) {
                    setJobData(response.data);
                    setSelectedJob(response.data[0]);
                } else {
                    alert("Something went wrong");
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchApplyedJobs();
    }, []);

    const formatDate = (dateTimeString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateTimeString).toLocaleDateString(undefined, options);
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
        if (isMobile) {
            toggleDrawer();
        }
    };

    return (
        <div className="applyed-jobs-wrapper">
            <h1 className="applyed-jobs-heading">Applied Jobs</h1>
            
            {jobData.length > 0 ? (
                <div className="applyed-jobs-layout">
                    {/* Job List Section */}
                    <div className="job-list-section">
                        <div className="job-list-header">
                            <h2>Your Applications</h2>
                            <p>{jobData.length} applications</p>
                        </div>
                        
                        <div className="job-list-container">
                            {jobData.map((job) => (
                                <div 
                                    key={job.id} 
                                    onClick={() => handleJobClick(job)} 
                                    className={`job-list-item ${selectedJob && selectedJob.id === job.id ? 'selected-job' : ''}`}
                                >
                                    <div className="job-item-content">
                                        <div className="job-item-image">
                                            <img 
                                                src={baseURL + job.job.employer.profile_pic} 
                                                alt={job.job.employer.user_full_name} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/56?text=Logo";
                                                }}
                                            />
                                        </div>
                                        <div className="job-item-details">
                                            <h3>{job.job.title}</h3>
                                            <p>{job.job.employer.user_full_name}</p>
                                            <p>{job.job.location}</p>
                                            
                                            <div className="job-item-tags">
                                                <span className="job-experience-tag">{job.job.experience} experience</span>
                                                <span className="job-salary-tag">{job.job.lpa} LPA</span>
                                            </div>
                                            
                                            <div className="job-item-footer">
                                                <div className="job-applied-date">
                                                    Applied on {formatDate(job.applyed_on)}
                                                </div>
                                                <div className="job-status-tag">
                                                    <span className={`status-indicator ${job.job_status === 'In Progress' ? 'in-progress' : job.job_status === 'Accepted' ? 'accepted' : 'rejected'}`}>
                                                        {job.job_status || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    


                    
                    {/* Job Details Section */}
                    <div className="job-details-section">
                        {selectedJob ? (
                            <StatusJob toggleDrawer={toggleDrawer} selectedJob={selectedJob} />
                        ) : (
                            <div className="no-job-selected-message">
                                Select a job to view details
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="no-applications-message">
                    <div className="no-applications-content">
                        <div className="no-applications-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2>No Applications Yet</h2>
                        <p>You haven't applied to any jobs yet. Start your job search journey today!</p>
                        <button 
                            onClick={() => navigate('/jobs')}
                            className="find-jobs-button"
                        >
                            Find Jobs
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Drawer */}
            <div className="mobile-drawer-wrapper">
                <Drawer
                    open={isOpen}
                    onClose={toggleDrawer}
                    direction="bottom"
                    size="85vh"
                    className="mobile-drawer-content"
                >
                    <div className="drawer-handle"></div>
                    {selectedJob && (
                        <StatusJob toggleDrawer={toggleDrawer} selectedJob={selectedJob} />
                    )}
                </Drawer>
            </div>
        </div>
    );
}

export default ApplyedJob;