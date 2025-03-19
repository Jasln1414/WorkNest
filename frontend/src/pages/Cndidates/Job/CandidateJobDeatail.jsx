import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSuitcase } from "react-icons/fa";
import { MdCurrencyRupee, MdDateRange } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';

import '../../../Styles/Candidate/jobdetail.css'; // Add your custom CSS file here

// Sub-components
const JobHeader = ({ jobData, image }) => (
  <div className="job-header">
    <div className="company-logo">
      {image && <img src={image} alt="Company Logo" />}
    </div>
    <div className="job-info">
      <h1>{jobData.title}</h1>
      <h2>{jobData.employer.user_full_name}</h2>
    </div>
  </div>
);

const JobMeta = ({ jobData }) => (
  <div className="job-meta">
    <div className="meta-item">
      <FaSuitcase />
      <span>{jobData.experience}</span>
    </div>
    <div className="meta-item">
      <MdCurrencyRupee />
      <span>{jobData.lpa} LPA</span>
    </div>
    <div className="meta-item">
      <SlLocationPin />
      <span>{jobData.location}</span>
    </div>
  </div>
);

const JobActions = ({ jobData, handleApply, handleSave, isSaved }) => (
  <div className="job-actions">
    <div className="action-item">
      <MdDateRange />
      <span>Posted {formatDistanceToNow(new Date(jobData.posteDate), { addSuffix: true }).replace('about ', '').replace('hours', 'hr')}</span>
    </div>
    <div className="action-item">
      <span>Apply Before: {jobData.applyBefore}</span>
    </div>
    <div className="action-buttons">
      <button className="apply-button" onClick={handleApply}>Apply</button>
      <button className="save-button" onClick={handleSave}>{isSaved ? 'Unsave' : 'Save'}</button>
    </div>
  </div>
);

const JobDescription = ({ jobData }) => (
  <div className="job-description">
    <h2>Job Description</h2>
    <p>{jobData.about}</p>
    <h3>Job Type: {jobData.jobtype}</h3>
    <h3>Job Mode: {jobData.jobmode}</h3>
    <h3>Responsibilities</h3>
    <p>{jobData.responsibility}</p>
  </div>
);

const CompanyInfo = ({ jobData }) => (
  <div className="company-info">
    <h2>About the Company</h2>
    <p>{jobData.employer.about}</p>
    <h3>Address</h3>
    <p>{jobData.employer.address}</p>
    <h3>Headquarters: {jobData.employer.headquarters}</h3>
    <h3>Website: <a href={jobData.employer.website_link} target="_blank" rel="noopener noreferrer">{jobData.employer.website_link}</a></h3>
  </div>
);

// Main Component
function JobDetail() {
  const baseURL = import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [userid, setUserid] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/account/current_user/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          setUserid(response.data.id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    getUserId();
  }, [baseURL, token]);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/empjob/getjobs/detail/${jobId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          setJobData(response.data);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };
    fetchJobData();
  }, [jobId, token, baseURL]);

  const handleSave = async () => {
    try {
      const action = isSaved ? 'unsave' : 'save';
      const response = await axios.post(`${baseURL}/api/empjob/savejob/${jobId}/`, { action }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200 || response.status === 201) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleApply = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/empjob/applyjob/${jobId}/`, 
        { userid }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${response.data.message}`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  if (!jobData) {
    return <div>Loading...</div>;
  }

  const image = jobData.employer?.profile_pic ? `${baseURL}${jobData.employer.profile_pic}` : '';

  return (
    <div className="job-detail-container">
      <div className="job-detail-card">
        <JobHeader jobData={jobData} image={image} />
        <JobMeta jobData={jobData} />
        <JobActions jobData={jobData} handleApply={handleApply} handleSave={handleSave} isSaved={isSaved} />
      </div>
      <JobDescription jobData={jobData} />
      <CompanyInfo jobData={jobData} />
    </div>
  );
}

export default JobDetail;