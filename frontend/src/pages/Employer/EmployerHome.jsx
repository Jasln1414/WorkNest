import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../Styles/EmpHome.css';
import { useDispatch } from 'react-redux';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import DashboardIcon from './DashBoard';

function EmpHome() {
  const [jobData, setJobData] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(6);

  const token = localStorage.getItem('access');
  const dispatch = useDispatch();
  const baseURL = 'http://127.0.0.1:8000/';

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
// Handle job status change
const handleJobStatusChange = async (action) => {
  try {
    // Make sure we're using the correct payload structure that your API expects
    // Based on your EmpHome component, it seems your API is using 'active' as a boolean
    const isActivating = action === 'activate';
    
    // First, ensure we get a fresh CSRF token
    await axios.get(`${baseURL}/csrf/`, {
      withCredentials: true,
    });
    
    // Now make the actual request with the correct payload structure
    const response = await axios.post(
      `${baseURL}/api/empjob/getjobs/status/${jobId}/`,
      { 
        active: isActivating  // Send active as a boolean
      },
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
      setStatus(isActivating);
      Swal.fire({
        icon: 'success',
        title: isActivating ? 'Activated' : 'Deactivated',
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
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${baseURL}api/account/user/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const profileData = response.data.data || {};
        const userData = response.data.user_data || profileData;

        setUserDetails({
          ...profileData,
          ...userData,
        });

        dispatch(
          set_user_basic_details({
            name: profileData.full_name || profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            profile_pic: userData.profile_pic || profileData.profile_pic,
            user_type_id: userData.id || profileData.id,
          })
        );
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseURL}api/empjob/getAlljobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setJobData(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setJobData(response.data.data);
        } else {
          setJobData([]);
        }
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to fetch job details. Please try again.');
      setJobData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfileData();
      fetchJobDetails();
    }
  }, [token]);

  // Calculate pagination values
  const safeJobData = Array.isArray(jobData) ? jobData : [];
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = safeJobData.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(safeJobData.length / jobsPerPage);

  // Change page
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

  return (
    <div className="eh-container">
      
      
      <div className="ep-sidebar-fixed">
  <h2 className="main-head">EMPLOYER</h2>
  <SideBar />
</div>



      {/* Main Content */}
      <div className={`eh-main-content ${isSmallScreen ? 'eh-mobile-content' : ''}`}>
        {/* Display user details - only show in desktop view */}
        {!isSmallScreen && userDetails && (
          <div className="eh-user-details">
            <h2>Welcome, {userDetails.full_name || userDetails.name}</h2>
          </div>
        )}

        {/* Display job data */}
        {loading ? (
          <div className="eh-loading-message">Loading jobs...</div>
        ) : error ? (
          <div className="eh-error-message">{error}</div>
        ) : safeJobData.length > 0 ? (
          <>
            <div className="eh-job-grid">
              {currentJobs.map((job, index) => (
                <div key={job.id || index} className="eh-job-card">
                  <div className="eh-job-card-inner">
                  <Link to={`/employer/jobdetail/${job.id}`}>  <p className="eh-job-title"> {job.title} </p></Link>
                    
                   
                    <div className="eh-job-detail">
                      <span>Status: {job.active ? <span className="eh-job-status-active">Active</span> : <span className="eh-job-status-inactive">Inactive</span>}</span>
                    </div>
                    <div className="eh-job-detail">
                      <span>Location: {job.location}</span>
                    </div>
                    <div className="eh-job-detail">
                      <span>Experience: {job.experience}</span>
                    </div>
                    <div className="eh-job-detail">
                      <span>Salary: {job.lpa} LPA</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="eh-pagination-container">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`eh-pagination-button eh-prev-btn ${currentPage === 1 ? 'eh-disabled' : ''}`}
              >
                Previous
              </button>

              <div className="eh-pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`eh-pagination-number ${currentPage === i + 1 ? 'eh-active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`eh-pagination-button eh-next-btn ${currentPage === totalPages ? 'eh-disabled' : ''}`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="eh-no-jobs-container">
            <div className="eh-no-jobs-message">
              <h3 className="eh-no-jobs-title">Add your first job</h3>
              <p className="eh-no-jobs-text">There are currently no job listings. Post a job to start attracting candidates.</p>
              <Link to={'/employer/profile_creation/'}>
                <button className="eh-post-job-button">Create Profile</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmpHome;