import React, { useState, useEffect } from 'react';
import { RiMessage2Fill } from 'react-icons/ri';
//import ChatModal from './ChatModal';
//import './StatusJob.css'; // Import your custom CSS file

function StatusJob({ selectedJob, toggleDrawer }) {
  const [step, setStep] = useState(0);
  const [chat, setChat] = useState(false);
  const baseURL = 'http://127.0.0.1:8000';

  useEffect(() => {
    if (selectedJob && selectedJob.status) {
      switch (selectedJob.status) {
        case 'Application Send':
          setStep(1);
          break;
        case 'Application Viewd':
          setStep(2);
          break;
        case 'Resume Viewd':
          setStep(3);
          break;
        case 'Interview Sheduled':
          setStep(4);
          break;
        case 'Accepted':
          setStep(5);
          break;
        default:
          setStep(6);
          break;
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
      <div className="job-card">
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
          <RiMessage2Fill size={25} className="cursor-pointer" onClick={handleChat} />
        </div>

        <div className="job-header">
          <p className="job-title">{selectedJob.job.title}</p>
          <span className="employer-name">{selectedJob.job.employer.user_full_name}</span>
        </div>
        <div className="divider"></div>
        <span className="status-title">Application Status</span>

        <div className="status-steps">
          <div className={`step ${step >= 1 ? 'completed' : ''}`}>
            <div className="step-icon">
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="step-label">Application Sent</p>
          </div>
          <div className={`step ${step >= 2 ? 'completed' : ''}`}>
            <div className="step-icon">
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="step-label">Application Viewed</p>
          </div>
          <div className={`step ${step >= 3 ? 'completed' : ''}`}>
            <div className="step-icon">
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="step-label">Resume Viewed</p>
          </div>
          <div className={`step ${step === 4 ? 'completed' : step === 6 ? 'rejected' : 'pending'}`}>
            <div className="step-icon">
              <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className={`step-label ${step >= 4 ? 'bold' : ''}`}>
              {step >= 4 ? selectedJob.status : 'Recruiter Action'}
            </p>
          </div>
        </div>
      </div>

      <div className="job-details">
        <div className="details-section">
          <span className="section-title">Job Description</span>
          <p className="section-content">{selectedJob.job.about}</p>
        </div>
        <div className="details-section">
          <span className="section-title">Job Type:</span>
          <p className="section-content">{selectedJob.job.jobtype}</p>
        </div>
        <div className="details-section">
          <span className="section-title">Job Mode:</span>
          <p className="section-content">{selectedJob.job.jobmode}</p>
        </div>
        <div className="details-section">
          <span className="section-title">Responsibilities</span>
          <p className="section-content">{selectedJob.job.responsibility}</p>
        </div>
      </div>
    </div>
  );
}

export default StatusJob;