import React, { useEffect, useState } from 'react';
import SideBar from '../SideBar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JobDetailModal from '../../../Components/Employer/Employjobdetail';
//import '../../Styles/USER/Search.css';

function JobDetail() {
  const baseURL = import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [jobData, setJobData] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState({
    page: true,
    action: false,
    modal: false
  });
  const [error, setError] = useState(null);

  // Fetch job data
  const fetchJobData = async () => {
    setLoading(prev => ({ ...prev, page: true }));
    setError(null);
    try {
      console.log('Token:', token); // Debug token
      const response = await axios.get(
        `${baseURL}/api/empjob/getjobs/detail/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      console.log('Job data:', response.data); // Debug response
      if (response.status === 200) {
        setJobData(response.data);
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      setError('Failed to fetch job details. Please try again.');
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { position: 'top-center' });
        navigate('/employer/login'); // Adjust the login path as needed
      }
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  // Handle job status change (activate/deactivate)
  const handleJobStatusChange = async (action) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      
      const response = await axios.post(
        `${baseURL}/api/empjob/getjobs/status/${jobId}/`,
        { action },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Update the job status in the local state
        setJobData(prev => ({
          ...prev,
          active: action === 'activate'
        }));
        toast.success(`Job successfully ${action}d.`, {
          position: 'top-center',
          autoClose: 2000
        });
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status. Please try again.', {
        position: 'top-center'
      });
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Handle modal operations
  const handleModalUpdate = async () => {
    try {
      setLoading(prev => ({ ...prev, modal: true }));
      const response = await axios.get(
        `${baseURL}/api/empjob/getjobs/detail/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setJobData(response.data);
      toast.success('Job updated successfully', {
        position: 'top-center',
        autoClose: 2000
      });
    } catch (error) {
      console.error('Error refreshing job data:', error);
      toast.error('Failed to refresh job details', {
        position: 'top-center'
      });
    } finally {
      setLoading(prev => ({ ...prev, modal: false }));
      setModal(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/employer/login'); // Redirect to login if token is missing
    } else {
      fetchJobData();
    }
  }, [token, jobId, baseURL, navigate]);

  if (loading.page && !jobData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Job not found'}</p>
        <button onClick={fetchJobData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="job-detail-container-employer" style={{ marginLeft: '30vh',marginTop:'3vh' }}>
      <div>
        <SideBar />
      </div>

      <div className="job-detail-content">
        {modal && <JobDetailModal setModal={setModal} jobData={jobData} onUpdate={handleModalUpdate} />}
      
        <div className="job-detail-card">
          <h1 className="job-detail-title">Job Details</h1>
          
          <div className="job-detail-info">
            <h2 className="job-title">{jobData.title}</h2>
            <p className="job-status">
              <span className="bold-text">Status:</span>
              {jobData.active ? (
                <span className="status-active"  style={{ color: jobData.active ? 'white' : 'white' }}>Active</span>
              ) : (
                <span className="status-expired"  style={{ color: jobData.active ? 'white' : 'white' }}>Inactive</span>
              )}
            </p>
            
            {/* Additional job details */}
            <p className="job-location">
              <span className="bold-text">Location:</span> {jobData.location}
            </p>
            <p className="job-salary">
              <span className="bold-text">Salary:</span> {jobData.lpa} LPA
            </p>
            <div className="job-meta" style={{ backgroundColor: '#fffff' }}>
              <p className="job-type" style={{ backgroundColor: 'white' }}>
                <span className="bold-text" style={{ backgroundColor: 'white' }}>Job Type:</span> {jobData.jobtype}
              </p>
              <p className="job-mode" style={{ backgroundColor: 'white' }}>
              <span className="bold-text" >
  Job Mode:
</span> {jobData.jobmode}
              </p>
              <p className="job-experience">
                <span className="bold-text">Experience:</span> {jobData.experience}
              </p>
            </div>
            
            <div className="job-dates">
              <p className="job-posted-date">
                <span className="bold-text">Posted:</span> {new Date(jobData.posteDate).toLocaleDateString()}
              </p>
              <p className="job-apply-before">
                <span className="bold-text">Apply Before:</span> {new Date(jobData.applyBefore).toLocaleDateString()}
              </p>
            </div>
            
            <div className="job-description">
              <p className="job-info-label">About Job:</p>
              <p>{jobData.about}</p>
            </div>
            
            <div className="job-description">
              <p className="job-info-label">Responsibilities:</p>
              <p>{jobData.responsibility}</p>
            </div>
          </div>
          
          <div className="job-actions">
            <button 
              className="edit-button" 
              onClick={() => setModal(true)}
              disabled={loading.action || loading.modal}
            >
              {loading.modal ? 'Saving...' : 'Edit'}
            </button>
            
            <button 
  style={{ color: jobData.active ? 'white' : 'white' }}
  onClick={() => handleJobStatusChange(jobData.active ? 'deactivate' : 'activate')}
  className={jobData.active ? 'deactivate-button' : 'activate-button'}
  disabled={loading.action}
>
  {loading.action ? 'Processing...' : (jobData.active ? 'Deactivate' : 'Activate')}
</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;