import React, { useState, useEffect } from "react";
import { RiMessage2Fill } from "react-icons/ri";
import ChatModal from "./ChatModal";
import '../../../Styles/Candidate/Jobdetail.css';

function StatusJob({ selectedJob, toggleDrawer, updateJobStatus }) {
  const [step, setStep] = useState(0);
  const [chat, setChat] = useState(false);
  const baseURL = "http://127.0.0.1:8000";

  useEffect(() => {
    setStep(0); // Reset step first
    if (selectedJob?.status) {
      const statusSteps = {
        "Application Send": 1,
        "Application Viewed": 2,
        "Resume Viewed": 3,
        "Pending": 4,
        "ShortListed": 5,
        "Accepted": 5,
        "Rejected": 6,
      };
      setStep(statusSteps[selectedJob.status] || 0);
    }
    console.log('StatusJob Updated:', selectedJob); // Debug log
  }, [selectedJob]);

  if (!selectedJob) return null;

  const handleChat = () => setChat(true);

  const profile_pic = `${baseURL}${selectedJob.job.employer.profile_pic}`;
  const userName = selectedJob.job.employer.user_full_name;
  const candidate_id = selectedJob.candidate;
  const employer_id = selectedJob.job.employer.id;
  const candidate_name = selectedJob.candidate_name;

  return (
    <div className="status-job-container">
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
        <div className="chat-icon" onClick={handleChat}>
          <RiMessage2Fill size={22} />
        </div>
        
        <div className="card-header">
          <h1>{selectedJob.job.title}</h1>
          <span>{selectedJob.job.employer.user_full_name}</span>
        </div>
        
        <div className="status-tracker">
          <h2>Application Status</h2>
          <div className="status-steps">
            {[
              { label: "Application Sent", step: 1 },
              { label: "Application Viewed", step: 2 },
              { label: "Resume Viewed", step: 3 },
              { 
                label: step >= 4 ? selectedJob.status : "Recruiter Action", 
                step: 4,
                status: selectedJob.status
              },
            ].map(({ label, step: stepValue, status }, index) => {
              let statusClass = '';
              if (step >= stepValue) {
                if (stepValue === 4) {
                  if (status === 'Pending') statusClass = 'pending';
                  else if (status === 'ShortListed') statusClass = 'shortlisted';
                  else if (status === 'Accepted') statusClass = 'accepted';
                  else if (status === 'Rejected') statusClass = 'rejected';
                } else {
                  statusClass = 'completed';
                }
              }
              
              return (
                <div
                  key={`step-${index}`}
                  className={`status-step ${statusClass}`}
                >
                  <div className="step-circle">
                    {step >= stepValue && (
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="step-label">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="job-details-card">
        <h3>Job Details</h3>
        <div className="job-details-content">
          <div className="job-description">
            <h4>Description</h4>
            <p>{selectedJob.job.about || 'Not specified'}</p>
          </div>
          <div className="job-type-mode">
            <div className="job-type">
              <h4>Job Type</h4>
              <p>{selectedJob.job.jobtype || 'Not specified'}</p>
            </div>
            <div className="job-mode">
              <h4>Job Mode</h4>
              <p>{selectedJob.job.jobmode || 'Not specified'}</p>
            </div>
          </div>
          <div className="responsibilities">
            <h4>Responsibilities</h4>
            <p>{selectedJob.job.responsibility || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusJob;