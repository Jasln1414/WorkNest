import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../Components/admin/utilities/AdminSideBar';
import '../../Styles/Admin/AdminPage.css';


function AdminJobDetail() {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [action, setAction] = useState('');
  const [reason, setReason] = useState('');
  const [moderationLoading, setModerationLoading] = useState(false);
  const { id } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate();

  const token = localStorage.getItem('access');
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/';

  // Fetch job details
  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseURL}dashboard/admin/jobs/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setJobData(response.data);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to fetch job details. Please try again.');
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { position: 'top-center' });
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle job moderation
  const handleModeration = async () => {
    if (!action) {
      toast.error('Please select an action.', { position: 'top-center' });
      return;
    }

    setModerationLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${baseURL}dashboard/admin/jobs/${id}/moderate/`,
        { action, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message, { position: 'top-center' });
        if (action === 'delete') {
          navigate('/admin/jobs'); // Redirect to jobs list after deletion
        } else {
          fetchJobDetails(); // Refresh job details after activation/deactivation
        }
      }
    } catch (error) {
      console.error('Error moderating job:', error);
      setError('Failed to moderate job. Please try again.');
      toast.error(error.response?.data?.error || 'An error occurred.', { position: 'top-center' });
    } finally {
      setModerationLoading(false);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchJobDetails();
    } else if (!token) {
      navigate('/admin/login');
    }
  }, [token, id, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {

    return (
      <div className="error-container">
       
        <p className="error-message">{error}</p>
        <button onClick={fetchJobDetails} className="retry-button">
          Retry
        </button>
        <button onClick={() => navigate('/admin/jobs')} className="back-button">
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="not-found-container">
        <p>Job not found</p>
        <button onClick={() => navigate('/admin/jobs')} className="back-button">
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="admin-job-detail-container">
       <Sidebar/>
      <h1>{jobData.title}</h1>
      <p>Status: {jobData.active ? 'Active' : 'Inactive'}</p>
      <p>Employer: {jobData.employer?.user_name || 'N/A'}</p>
      <p>Location: {jobData.location}</p>
      <p>Salary: {jobData.lpa} LPA</p>
      <p>Experience: {jobData.experience}</p>
      <p>Job Type: {jobData.jobtype}</p>
      <p>Job Mode: {jobData.jobmode}</p>
      <p className="job-info-label">About Job:</p>
      <p className="job-description">{jobData.about}</p>
      <p className="job-info-label">Responsibilities:</p>
      <p className="job-description">{jobData.responsibility}</p>

      {/* Moderation Section */}
      <div className="moderation-section">
        <h2>Moderate Job</h2>
        <div className="moderation-form">
          <label>
            Action:
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="">Select an action</option>
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
              <option value="delete">Delete</option>
            </select>
          </label>
          <label>
            Reason (optional):
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </label>
          <button onClick={handleModeration} disabled={moderationLoading}>
            {moderationLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default AdminJobDetail;