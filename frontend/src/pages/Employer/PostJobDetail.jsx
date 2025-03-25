import React, { useEffect, useState } from 'react';
import SideBar from '../../../components/employer/SideBar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import JobDetailMOdal from '../../../components/employer/utilities/JobDetailMOdal';
import './JobDetail.css'; // Import the CSS file

function JobDetail() {
  const baseURL = import.meta.env.VITE_API_BASEURL||  'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const [jobData, setJobData] = useState({});
  const { jobId } = useParams();
  const [status, setStatus] = useState();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/empjob/getjobs/detail/${jobId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setJobData(response.data);
          setStatus(response.data.active);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };
    fetchJobData();
  }, [jobId, token, baseURL]);

  const handleJobStatusChange = async (action) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/empjob/getjobs/status/${jobId}/`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        setStatus(action === 'activate');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleDeactivate = () => {
    Swal.fire({
      title: 'Do you want to deactivate?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Deactivate',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deactivated!', '', 'success');
        handleJobStatusChange('deactivate');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  const handleActivate = () => {
    Swal.fire({
      title: 'Do you want to activate again?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Activate',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Activated!', '', 'success');
        handleJobStatusChange('activate');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  const toggleModal = () => {
    setModal(true);
  };

  return (
    <div className="job-detail-container">
      <div>
        <SideBar />
      </div>

      <div className="job-detail-content">
        {modal && <JobDetailMOdal setModal={setModal} jobData={jobData} />}
        <div className="job-detail-card">
          <h1 className="job-detail-title">Job Details</h1>
          <div className="job-detail-info">
            <h2 className="job-title">{jobData.title}</h2>
            <p className="job-location"><span className="bold-text">Location:</span> {jobData.location}</p>
            <p className="job-salary"><span className="bold-text">Salary:</span> {jobData.lpa} lpa</p>
            <div className="job-meta">
              <p className="job-type"><span className="bold-text">Job Type:</span> {jobData.jobtype}</p>
              <p className="job-mode"><span className="bold-text">Job Mode:</span> {jobData.jobmode}</p>
              <p className="job-experience"><span className="bold-text">Experience:</span> {jobData.experiance}</p>
            </div>
            <div className="job-dates">
              <p className="job-posted-date"><span className="bold-text">Date Posted:</span> {jobData.posteDate}</p>
              <p className="job-apply-before"><span className="bold-text">Apply Before:</span> {jobData.applyBefore}</p>
              <p className="job-status">
                <span className="bold-text">Status:</span>
                {status ? (
                  <span className="status-active">Active</span>
                ) : (
                  <span className="status-expired">Expired</span>
                )}
              </p>
            </div>
            <p className="job-about"><span className="bold-text">About Job:</span> {jobData.about}</p>
            <p className="job-responsibilities"><span className="bold-text">Responsibilities:</span> {jobData.responsibility}</p>
          </div>
          <div className="job-actions">
            <button className="edit-button" onClick={toggleModal}>Edit</button>
            {status ? (
              <button className="deactivate-button" onClick={handleDeactivate}>Deactivate</button>
            ) : (
              <button className="activate-button" onClick={handleActivate}>Activate</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;