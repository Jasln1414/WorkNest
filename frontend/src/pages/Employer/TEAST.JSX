import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSuitcase, FaBuilding, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { MdCurrencyRupee, MdDateRange, MdWorkOutline, MdLocationOn } from 'react-icons/md';
import { BsClockHistory, BsBriefcase } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';
import '../../../Styles/Candidate/jobdetail.css';

function JobDetail() {
  const baseURL = 'http://127.0.0.1:8000/';
  const token = localStorage.getItem('access');
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

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

  const handleApplyJob = () => {
    setIsApplying(true);
    // Application logic would go here
    setTimeout(() => {
      Swal.fire({
        title: 'Application Submitted!',
        text: 'Your application has been successfully submitted.',
        icon: 'success',
        confirmButtonText: 'Great!'
      });
      setIsApplying(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="job-loading-container">
        <div className="job-loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-error-container">
        <div className="job-error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="job-retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const image = jobData.employer?.profile_pic ? `${baseURL}${jobData.employer.profile_pic}` : '';

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        {/* Sticky Apply Button for Mobile */}
       {/* <div className="mobile-apply-sticky">
          <button className="apply-now-button-mobile" onClick={handleApplyJob} disabled={isApplying}>
            {isApplying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>*/}

        {/* Left Column (Job Description) */}
        <div className="job-description-column">
          {/* Job Header Section */}
          <div className="job-header-card">
            <div className="job-header-content">
              <div className="job-company-logo">
                {image ? (
                  <img src={image} alt={`${jobData.employer?.user_full_name} logo`} />
                ) : (
                  <div className="default-company-logo">
                    <FaBuilding />
                  </div>
                )}
              </div>

              <div className="job-title-section">
                <h1 className="job-title">{jobData.title}</h1>
                <h2 className="company-name">{jobData.employer?.user_full_name || 'Unknown Employer'}</h2>

                <div className="job-location-date">
                  <span className="job-location">
                    <FaMapMarkerAlt /> {jobData.location}
                  </span>
                  <span className="job-posted-date">
                    <BsClockHistory /> Posted {formatDate(jobData.postedDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="job-description-card">
            <h3 className="section-title">Job Description</h3>
            <div className="job-description-content">
              <p>{jobData.about}</p>
            </div>

            <div className="responsibilities-section">
              <h4 className="subsection-title">Key Responsibilities</h4>
              <ul className="responsibilities-list">
                {jobData.responsibility?.split('\n').map((item, index) => (
                  item.trim() && <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="apply-deadline">
              <div className="deadline-icon">
                <MdDateRange />
              </div>
              <div className="deadline-content">
                <span className="deadline-label">Apply Before:</span>
                <span className="deadline-date">{jobData.applyBefore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="job-sidebar-column">
          {/* Job Highlights Card */}
          <div className="job-highlights-card">
            <h3 className="highlights-title">Job Highlights</h3>
            <div className="job-highlights-grid">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <BsBriefcase />
                </div>
                <div className="highlight-content">
                  <span className="highlight-label">Job Type</span>
                  <span className="highlight-value">{jobData.jobtype}</span>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">
                  <MdWorkOutline />
                </div>
                <div className="highlight-content">
                  <span className="highlight-label">Experience</span>
                  <span className="highlight-value">{jobData.experience}</span>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">
                  <MdCurrencyRupee />
                </div>
                <div className="highlight-content">
                  <span className="highlight-label">Salary</span>
                  <span className="highlight-value">{jobData.lpa} LPA</span>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">
                  <MdLocationOn />
                </div>
                <div className="highlight-content">
                  <span className="highlight-label">Work Mode</span>
                  <span className="highlight-value">{jobData.jobmode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information Card */}
          <div className="company-info-card">
            <h3 className="section-title">About the Company</h3>
            <div className="company-profile">
              <div className="company-logo-name">
                {image ? (
                  <img src={image} alt={`${jobData.employer?.user_full_name} logo`} className="company-logo" />
                ) : (
                  <div className="default-company-logo large">
                    <FaBuilding />
                  </div>
                )}
                {/*<h4 className="company-name-large">{jobData.employer?.user_full_name || 'Unknown'}</h4>*/}
              </div>

              <div className="company-description">
                <p>{jobData.employer?.about || 'No information available about this company.'}</p>
              </div>

              <div className="company-details-grid">
                {jobData.employer?.headquarters && (
                  <div className="company-detail-item">
                    <div className="detail-icon">
                      <FaBuilding />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Headquarters</span>
                      <span className="detail-value">{jobData.employer.headquarters}</span>
                    </div>
                  </div>
                )}

                {jobData.employer?.address && (
                  <div className="company-detail-item">
                    <div className="detail-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Address</span>
                      <span className="detail-value">{jobData.employer.address}</span>
                    </div>
                  </div>
                )}

                {jobData.employer?.website_link && (
                  <div className="company-detail-item">
                    <div className="detail-icon">
                      <FaGlobe />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Website</span>
                      <a href={jobData.employer.website_link} target="_blank" rel="noopener noreferrer" className="website-link">
                        {jobData.employer.website_link}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Apply Button in Sidebar */}
          <div className="apply-now-button-container">
            <button
              className="apply-now-button"
              onClick={handleApplyJob}
              disabled={isApplying}
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;