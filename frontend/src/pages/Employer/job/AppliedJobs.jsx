import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApplyCard from '../utilities/ApplyCard';
import CandidateView from './CandidateView';
import SideBar from '../SideBar';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import ApplicationData from '../utilities/ApplicationData';
import { FaArrowLeft } from "react-icons/fa6";
import '../../../Styles/Job/StatusJob.css';

function ApplicationsManagement() {
    const [isOpen, setIsOpen] = useState(false);
    const [applicationOpen, setApplicationOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [jobData, setJobData] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [change, setChange] = useState(true);
    const [current, setCurrent] = useState(null);
    const [status, setStatus] = useState('');
    const [questions, setQuestions] = useState([]);
    const baseURL = 'http://127.0.0.1:8000';
    const token = localStorage.getItem('access');

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const toggleApplication = () => {
        setApplicationOpen(!applicationOpen);
    };

    const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 768);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Check initial screen size
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(baseURL + '/api/empjob/getApplicationjobs/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200) {
                    setJobData(response.data.data);
                    setSelectedJob(response.data.data[0]);
                    if (response.data.data[0].questions !== null) {
                        setQuestions(response.data.data[0].questions);
                    } else {
                        setQuestions([]);
                    }
                }
            } catch (error) {
                console.error("Something went wrong", error);
            }
        };
        fetchJobDetails();
    }, [token]);

    const handleJobClick = (job) => {
        setSelectedJob(job);
        toggleApplication();
    };

    return (
        <div className="app-mgmt-container">
            <div className="app-mgmt-sidebar-container">
                {isSmallScreen ? (
                    <>
                        <div className="app-mgmt-drawer-toggle">
                            <button onClick={toggleDrawer} className="app-mgmt-drawer-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"
                                    className="app-mgmt-drawer-icon">
                                    <path
                                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                                        strokeWidth="1.5"
                                    ></path>
                                    <path d="M8 12H16" strokeWidth="1.5"></path>
                                    <path d="M12 16V8" strokeWidth="1.5"></path>
                                </svg>
                            </button>
                        </div>
                        <Drawer
                            open={isOpen}
                            onClose={toggleDrawer}
                            direction='left'
                            className="app-mgmt-drawer"
                        >
                            <div className="app-mgmt-drawer-content">
                                <SideBar />
                            </div>
                        </Drawer>
                        <Drawer
                            open={applicationOpen}
                            onClose={toggleApplication}
                            size={580}
                            direction='bottom'
                            className="app-mgmt-application-drawer"
                        >
                            <div className="app-mgmt-application-drawer-content">
                                <div className="app-mgmt-header">
                                    <span>Applied Candidates</span>
                                    <div onClick={() => setChange(!change)} className="app-mgmt-back-button">
                                        <FaArrowLeft size={27} />
                                    </div>
                                </div>
                                <div className="app-mgmt-candidates-content">
                                    {change ? (
                                        <ApplyCard selectedJob={selectedJob} setChange={setChange} setCurrent={setCurrent} setStatus={setStatus} />
                                    ) : (
                                        <CandidateView selectedJob={selectedJob} setChange={setChange} current={current} questions={questions} />
                                    )}
                                </div>
                            </div>
                        </Drawer>
                    </>
                ) : (
                    <SideBar />
                )}
            </div>
            <div className="app-mgmt-content-wrapper">
                <div className="app-mgmt-job-list-section">
                    <ApplicationData jobData={jobData} handleJobClick={handleJobClick} toggleApplication={toggleApplication} />
                </div>
                <div className="app-mgmt-candidates-section">
                    <div className="app-mgmt-header">
                        <span>Applied Candidates</span>
                        <div onClick={() => setChange(!change)} className="app-mgmt-back-button">
                            <FaArrowLeft size={27} />
                        </div>
                    </div>
                    <div className="app-mgmt-candidates-content">
                        {change ? (
                            <ApplyCard selectedJob={selectedJob} setChange={setChange} setCurrent={setCurrent} setStatus={setStatus} />
                        ) : (
                            <CandidateView selectedJob={selectedJob} setChange={setChange} current={current} questions={questions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationsManagement;