import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Styles/Admin/AdminPage.css';
import Sidebar from '../../Components/admin/utilities/AdminSideBar';

function AdminJobView() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(6);
  const navigate = useNavigate();

  const token = localStorage.getItem('access');
  console.log('Token:', token); // Add this log
  const baseURL = 'http://127.0.0.1:8000/';

  // Fetch all jobs for admin
  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseURL}dashboard/admin/jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setJobData(response.data);
        console.log('Job data:', response.data); // Add this log
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to fetch job details. Please try again.');
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { position: 'top-center' });
        navigate('/admin/login'); // Redirect to login if unauthorized
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle job status change (activate/deactivate)
  const handleJobStatusChange = async (jobId, action) => {
    try {
      const response = await axios.post(
        `${baseURL}dashboard/admin/jobs/${jobId}/moderate/`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the job status in the local state
        setJobData((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, active: action === 'activate' } : job
          )
        );

        toast.success(`Job successfully ${action}d.`, {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status. Please try again later.', {
        position: 'top-center',
      });
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin/login'); // Redirect to login if token is missing
    } else {
      fetchJobDetails();
    }
  }, [token, navigate]);

  // Pagination logic
  const safeJobData = Array.isArray(jobData) ? jobData : [];
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = safeJobData.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(safeJobData.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setJobsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setJobsPerPage(4);
      } else {
        setJobsPerPage(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="ajv-loading-container">
        <div className="ajv-loading-spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ajv-error-container">
        <p className="ajv-error-message">{error}</p>
        <button onClick={fetchJobDetails} className="ajv-retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="ajv-admin-job-view-container">
       <Sidebar />
      {safeJobData.length > 0 ? (
        <>
          <div className="ajv-job-grid">
            {currentJobs.map((job) => (
              <div key={job.id} className="ajv-job-card">
                <h2 className="ajv-title">{job.title}</h2>
                <div className="ajv-job-info-container">
                  <p data-label="Status:" className={job.active ? 'ajv-active-status' : 'ajv-inactive-status'}>
                    {job.active ? 'Active' : 'Inactive'}
                  </p>
                  <p data-label="Location:">{job.location}</p>
                  <p data-label="Salary:">{job.lpa} LPA</p>
                  <p data-label="Experience:">{job.experience}</p>
                  <p data-label="Job Type:">{job.jobtype}</p>
                  <p data-label="Job Mode:">{job.jobmode}</p>
                </div>
                <div className="ajv-job-actions">
                  <button
                    onClick={() =>
                      handleJobStatusChange(job.id, job.active ? 'deactivate' : 'activate')
                    }
                    className={job.active ? 'ajv-deactivate-button' : 'ajv-activate-button'}
                  >
                    {job.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <Link to={`/admin/jobDetailList/${job.id}`} className="ajv-details-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="ajv-pagination-container">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="ajv-pagination-button"
            >
              Previous
            </button>
            <div className="ajv-pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`ajv-pagination-number ${currentPage === i + 1 ? 'ajv-active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ajv-pagination-button"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="ajv-no-jobs-container">
          <p>No jobs found.</p>
        </div>
      )}
    </div>
  );
}

export default AdminJobView;