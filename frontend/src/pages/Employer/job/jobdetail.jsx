import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../SideBar';
import JobDetailModal from '../../../Components/Employer/Employjobdetail';
import '../../../Styles/Candidate/Employer/jobdetail.css';

// Configure axios defaults for CSRF
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function JobDetail() {
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const { jobId } = useParams();
  const [jobData, setJobData] = useState({});
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false);

  // Helper function to get CSRF token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Fetch job data
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/empjob/getjobs/detail/${jobId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setJobData(response.data);
          setStatus(response.data.active);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch job details. Please try again later.',
        });
      }
    };
    
    if (token && jobId) {
      fetchJobData();
    }
  }, [jobId, token, baseURL]);

  const handleJobStatusChange = async (action) => {
    try {
      const csrfToken = getCookie('csrftoken');
      
      // If CSRF token is not available from cookie, request it
      if (!csrfToken) {
        await axios.get(`${baseURL}/csrf/`, {
          withCredentials: true,
        });
        // Wait a moment to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const response = await axios.post(
        `${baseURL}/api/empjob/getjobs/status/${jobId}/`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        setStatus(action === 'activate');
        Swal.fire({
          icon: 'success',
          title: action === 'activate' ? 'Activated' : 'Deactivated',
          text: `The job has been successfully ${action}d.`,
        });
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update job status. Please try again later.',
      });
    }
  };

  // Handle deactivate
  const handleDeactivate = () => {
    Swal.fire({
      title: 'Do you want to deactivate this job?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Deactivate',
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleJobStatusChange('deactivate');
      }
    });
  };

  // Handle activate
  const handleActivate = () => {
    Swal.fire({
      title: 'Do you want to activate this job?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Activate',
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleJobStatusChange('activate');
      }
    });
  };

  // Toggle modal
  const toggleModal = () => {
    setModal(true);
  };

  return (
    <div className="job-detail-container">
      <SideBar />

      <div className="job-detail-content">
        {modal && <JobDetailModal setModal={setModal} jobData={jobData} />}
        <h1 className="job-detail-title">Job Details</h1>
        <div className="job-detail-card">
          <h2 className="job-title">{jobData?.title}</h2>
          <p className="job-info">
            <span className="job-info-label">Location:</span> {jobData?.location}
          </p>
          <p className="job-info">
            <span className="job-info-label">Salary:</span> {jobData?.lpa} LPA
          </p>
          <div className="job-info-row">
            <p className="job-info">
              <span className="job-info-label">Job Type:</span> {jobData?.jobtype}
            </p>
            <p className="job-info">
              <span className="job-info-label">Job Mode:</span> {jobData?.jobmode}
            </p>
            <p className="job-info">
              <span className="job-info-label">Experience:</span> {jobData?.experience}
            </p>
          </div>
          <div className="job-info-row">
            <p className="job-info">
              <span className="job-info-label">Date Posted:</span> {jobData?.postedDate}
            </p>
            <p className="job-info">
              <span className="job-info-label">Apply Before:</span> {jobData?.applyBefore}
            </p>
            <p className="job-info">
              <span className="job-info-label">Status:</span>
              {status ? (
                <span className="status-active">Active</span>
              ) : (
                <span className="status-expired">Expired</span>
              )}
            </p>
          </div>
          <p className="job-info-label">About Job:</p>
          <p className="job-description">{jobData?.about}</p>
          <p className="job-info-label">Responsibilities:</p>
          <p className="job-description">{jobData?.responsibility}</p>

          <div className="job-actions">
            <button className="edit-button" onClick={toggleModal}>
              Edit
            </button>
            {status ? (
              <button className="deactivate-button" onClick={handleDeactivate}>
                Deactivate
              </button>
            ) : (
              <button className="activate-button" onClick={handleActivate}>
                Activate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;