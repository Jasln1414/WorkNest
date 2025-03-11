import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSuitcase } from 'react-icons/fa';
import { MdCurrencyRupee } from 'react-icons/md';
import { SlLocationPin } from 'react-icons/sl';
import { MdDateRange } from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';
import '../../../Styles/OTP.css'; // Import the CSS file

function JobDetail() {
  const baseURL = 'http://127.0.0.1:8000/';
  const token = localStorage.getItem('access');
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`${baseURL}api/empjob/getjobs/detail/${jobId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          setJobData(response.data);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
        setError('Failed to fetch job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [jobId, token, baseURL]);

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return 'Date not available';
    }
    return formatDistanceToNow(date, { addSuffix: true })
      .replace('about ', '')
      .replace('hours', 'hr');
  };

  if (loading) {
    return <div className="job-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="job-detail-error">{error}</div>;
  }

  const image = jobData.employer?.profile_pic ? `${baseURL}${jobData.employer.profile_pic}` : '';

  return (
    <div className="job-detail-container">
      <div className="job-detail-content">
        {/* Job Detail Card */}

        
        <div className="job-detail-card">
          <div className="job-detail-header">
            <div className="job-detail-company-logo">
              {image && <img src={image} alt="Company Logo" className="job-detail-logo" />}
            </div>
            <div className="job-detail-company-info">
              <span className="job-detail-title"style={{width:"100px"}}>{jobData.title}</span>
              <div>
                <span className="job-detail-employer">{jobData.employer?.user_full_name || 'Unknown'}</span>
              </div>
            </div>
          </div>
          <div className="job-detail-info">
          
            <div className="job-detail-experience">
              <span className="job-detail-icon"><FaSuitcase /></span>
              <p>{jobData.experience}</p>
            </div>
            <div className="job-detail-salary">
              <span className="job-detail-icon"><MdCurrencyRupee /></span>
              <p>{jobData.lpa} lpa</p>
            </div>
            <div className="job-detail-location">
              <span className="job-detail-icon"><SlLocationPin /></span>
              <p>{jobData.location}</p>
            </div>
          </div>
          <div className="job-detail-divider"></div>
          <div className="job-detail-footer">
            <div className="job-detail-posted-date">
              <span className="job-detail-icon"><MdDateRange /></span>
              <p>{formatDate(jobData.postedDate)}</p>
            </div>
            <div className="job-detail-apply-before">
              <p><span>Apply Before:</span> {jobData.applyBefore}</p>
            </div>
          </div>
        </div>

        {/* Job Description Card */}
        <div className="job-detail-card">
          <h2 className="job-detail-section-title">Job Description</h2>
          <div className="job-detail-description-content">
            <p>{jobData.about}</p>
          </div>

          <div className="job-detail-section">
            <h3 className="job-detail-section-title">Job Type</h3>
            <p>{jobData.jobtype}</p>
          </div>

          <div className="job-detail-section">
            <h3 className="job-detail-section-title">Job Mode</h3>
            <p>{jobData.jobmode}</p>
          </div>

          <div className="job-detail-section">
            <h3 className="job-detail-section-title">Responsibilities</h3>
            <ul className="job-detail-responsibilities-list">
              {jobData.responsibility?.split('\n').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="job-detail-card">
          <h2 className="job-detail-section-title">About Company</h2>
          <div className="job-detail-section">
            <p>{jobData.employer?.about || 'No information available'}</p>
          </div>

          <div className="job-detail-section">
            <h3 className="job-detail-section-title">Address</h3>
            <p>{jobData.employer?.address || 'No address available'}</p>
          </div>

          <div className="job-detail-section">
            <h3 className="job-detail-section-title">Headquarters</h3>
            <p>{jobData.employer?.headquarters || 'No headquarters available'}</p>
          </div>

          <div className="job-detail-section">
            <h3 className="job-detail-section-title">Website Link</h3>
            <a href={jobData.employer?.website_link} className="job-detail-website-link">
              {jobData.employer?.website_link || 'No website available'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;