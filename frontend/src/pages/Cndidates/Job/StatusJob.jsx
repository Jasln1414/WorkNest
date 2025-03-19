import React, { useState, useEffect } from 'react';
import { RiMessage2Fill } from 'react-icons/ri';
import ChatModal from './ChatModal';

function StatusJob({ selectedJob, toggleDrawer }) {
    const [step, setStep] = useState(0);
    const [chat, setChat] = useState(false);
    const baseURL = import.meta.env.VITE_API_BASEURL;

    useEffect(() => {
        if (selectedJob && selectedJob.status) {
            if (selectedJob.status === 'Application Send') {
                setStep(1);
            } else if (selectedJob.status === 'Application Viewd') {
                setStep(2);
            } else if (selectedJob.status === 'Resume Viewd') {
                setStep(3);
            } else if (selectedJob.status === 'Interview Sheduled') {
                setStep(4);
            } else if (selectedJob.status === 'Accepted') {
                setStep(5);
            } else {
                setStep(6);
            }
        }
    }, [selectedJob]);

    if (!selectedJob) {
        return null;
    }

    const handleChat = () => {
        setChat(true);
    };

    const profile_pic = baseURL + selectedJob.job.employer.profile_pic;
    const userName = selectedJob.job.employer.user_full_name;
    const candidate_id = selectedJob.candidate;
    const employer_id = selectedJob.job.employer.id;
    const candidate_name = selectedJob.candidate_name;

    return (
        <div className="status-job-container">
            <style>
                {`
                    .status-job-container {
                        margin-bottom: 16px;
                        width: 100%;
                    }
                    .status-job-card {
                        background-color: white;
                        margin-bottom: 8px;
                        padding: 12px;
                        border-radius: 8px;
                        position: relative;
                    }
                    .chat-icon {
                        position: absolute;
                        top: 0;
                        right: 0;
                        padding: 8px;
                        color: #6b7280;
                        cursor: pointer;
                    }
                    .job-title {
                        font-size: 1.25rem;
                        font-weight: bold;
                        color: #1f2937;
                        margin-right: 30px; /* Make space for chat icon */
                    }
                    .job-employer {
                        color: #6b7280;
                        display: block;
                    }
                    .status-divider {
                        width: 100%;
                        border-top: 2px solid #9ca3af;
                        margin-top: 12px;
                    }
                    .status-title {
                        font-size: 1.125rem;
                        font-weight: bold;
                        color: #1f2937;
                    }
                    .status-steps {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 12px;
                        flex-wrap: wrap;
                    }
                    .status-step {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-bottom: 8px;
                        width: 24%;
                    }
                    .status-circle {
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .status-circle.green {
                        background-color: #10b981;
                    }
                    .status-circle.gray {
                        background-color: #6b7280;
                    }
                    .status-circle.red {
                        background-color: #ef4444;
                    }
                    .status-circle.blue {
                        background-color: #3b82f6;
                    }
                    .status-label {
                        margin-top: 8px;
                        text-align: center;
                        font-size: 0.875rem;
                    }
                    .job-details {
                        background-color: white;
                        margin-bottom: 8px;
                        padding: 12px;
                        border-radius: 8px;
                    }
                    .job-details-section {
                        margin-bottom: 16px;
                    }
                    .job-details-title {
                        font-size: 1.125rem;
                        font-weight: 600;
                        color: #374151;
                        display: block;
                        margin-bottom: 4px;
                    }
                    .job-details-content {
                        font-size: 1rem;
                        color: #374151;
                        white-space: pre-wrap;
                        word-break: break-word;
                        text-align: justify;
                        hyphens: auto;
                    }
                    
                    /* Responsive styles for mobile */
                    @media (max-width: 640px) {
                        .status-steps {
                            flex-wrap: wrap;
                        }
                        .status-step {
                            width: 50%;
                            margin-bottom: 16px;
                        }
                        .job-title {
                            font-size: 1.125rem;
                        }
                        .status-title {
                            font-size: 1rem;
                        }
                        .job-details-title {
                            font-size: 1rem;
                        }
                        .job-details-content {
                            font-size: 0.875rem;
                        }
                    }
                    
                    /* Even smaller screens */
                    @media (max-width: 400px) {
                        .status-step {
                            width: 50%;
                        }
                        .status-label {
                            font-size: 0.75rem;
                        }
                    }
                `}
            </style>

            <div className="status-job-card">
                {chat && (
                    <ChatModal
                        candidate_name={candidate_name}
                        profile_pic={profile_pic}
                        userName={userName}
                        setChat={setChat}
                        candidate_id={candidate_id}
                        employer_id={employer_id}
                    />
                )}
                <div className="chat-icon">
                    <RiMessage2Fill size={25} onClick={handleChat} />
                </div>

                <div>
                    <p className="job-title">{selectedJob.job.title}</p>
                    <span className="job-employer">{selectedJob.job.employer.user_full_name}</span>
                </div>
                <div className="status-divider"></div>
                <span className="status-title">Application Status</span>

                <div className="status-steps">
                    <div className="status-step">
                        <div className={`status-circle ${step >= 1 ? 'green' : 'gray'}`}>
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <p className="status-label">Application Sent</p>
                    </div>
                    <div className="status-step">
                        <div className={`status-circle ${step >= 2 ? 'green' : 'gray'}`}>
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <p className="status-label">Application Viewed</p>
                    </div>
                    <div className="status-step">
                        <div className={`status-circle ${step >= 3 ? 'green' : 'gray'}`}>
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <p className="status-label">Resume Viewed</p>
                    </div>
                    <div className="status-step">
                        <div className={`status-circle ${step === 4 ? 'green' : step === 6 ? 'red' : 'blue'}`}>
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <p className={`status-label ${step >= 4 ? 'font-bold' : ''}`}>
                            {step >= 4 ? selectedJob.status : "Recruiter Action"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="job-details">
                <div className="job-details-section">
                    <span className="job-details-title">Job description</span>
                    <p className="job-details-content">{selectedJob.job.about}</p>
                </div>
                <div className="job-details-section">
                    <span className="job-details-title">Job Type:</span>
                    <p className="job-details-content">{selectedJob.job.jobtype}</p>
                </div>
                <div className="job-details-section">
                    <span className="job-details-title">Job Mode:</span>
                    <p className="job-details-content">{selectedJob.job.jobmode}</p>
                </div>
                <div className="job-details-section">
                    <span className="job-details-title">Responsibilities</span>
                    <p className="job-details-content">{selectedJob.job.responsibility}</p>
                </div>
            </div>
        </div>
    );
}

export default StatusJob;