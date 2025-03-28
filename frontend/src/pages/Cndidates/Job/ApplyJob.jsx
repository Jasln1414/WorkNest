import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import StatusJob from './StatusJob';
import { useMediaQuery } from 'react-responsive';
import '../../../Styles/Candidate/Jobdetail.css';

function ApplyedJob() {
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  const authentication_user = useSelector((state) => state.authentication_user);
  const [jobData, setJobData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [loading, setLoading] = useState(true);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const fetchApplyedJobs = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/empjob/getApplyedjobs/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 && response.data.length > 0) {
        setJobData(response.data);
        if (selectedJob) {
          const updatedSelectedJob = response.data.find((job) => job.id === selectedJob.id);
          setSelectedJob(updatedSelectedJob || response.data[0]);
        } else {
          setSelectedJob(response.data[0]);
        }
      } else {
        setJobData([]);
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to fetch applied jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplyedJobs();
  }, [token]);

  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    if (isMobile) toggleDrawer();
  };

  const updateJobStatus = async (jobId, action) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/empjob/application-status/${jobId}/`,
        { action },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        await fetchApplyedJobs(); // Refresh job data after status update
      }
    } catch (error) {
      console.error("Error updating status:", error.response ? error.response.data : error);
      alert(`Failed to update status: ${error.response ? error.response.data.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="applyed-jobs-wrapper">
      <h1 className="applyed-jobs-heading">Applied Jobs</h1>
      {jobData.length > 0 ? (
        <div className="applyed-jobs-layout">
          <div className="job-list-section">
            <h2>Your Applications</h2>
            <p>{jobData.length} applications</p>
            {jobData.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className={`job-list-item ${selectedJob && selectedJob.id === job.id ? 'selected-job' : ''}`}
              >
                <div className="job-item-content">
                  <div className="job-item-image">
                    <img
                      src={`${baseURL}${job.job.employer.profile_pic}`}
                      alt={job.job.employer.user_full_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                      }}
                    />
                  </div>
                  <div className="job-item-details">
                    <h3>{job.job.title}</h3>
                    <p>{job.job.employer.user_full_name}</p>
                    <p>{job.job.location}</p>
                    <div className="job-item-tags">
                      <span className="job-experience-tag">{job.job.experience || 'Not specified'} experience</span>
                      <span className="job-salary-tag">{job.job.lpa} LPA</span>
                    </div>
                    <div className="job-item-footer">
                      <div className="job-applied-date">
                        Applied on {formatDate(job.applyed_on)}
                      </div>
                      <div className="job-status-tag">
                        <span className={`status-indicator ${job.status === 'Pending' ? 'in-progress' : job.status === 'Accepted' ? 'accepted' : job.status === 'Rejected' ? 'rejected' : 'pending'}`}>
                          {job.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="job-details-section">
            {selectedJob ? (
              <StatusJob
                toggleDrawer={toggleDrawer}
                selectedJob={selectedJob}
                updateJobStatus={updateJobStatus}
              />
            ) : (
              <div className="no-job-selected-message">Select a job to view details</div>
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
            <button onClick={() => navigate('/jobs')} className="find-jobs-button">
              Find Jobs
            </button>
          </div>
        </div>
      )}
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
            <StatusJob
              toggleDrawer={toggleDrawer}
              selectedJob={selectedJob}
              updateJobStatus={updateJobStatus}
            />
          )}
        </Drawer>
      </div>
    </div>
  );
}

export default ApplyedJob;