import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import JobCard from './utilities/Jobcard';
import SearchBox from './utilities/SearchBox';
import Pagination from './utilities/Paginations';
import '../../Styles/FindJob.css';

function CandidateHome() {
  const baseURL = 'http://127.0.0.1:8000';
  const [jobData, setJobData] = useState([]);
  const [filterData, setFilterData] = useState([]); // State for filtered data
  const [action, setAction] = useState(false); // State to track if filtering is applied
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 6;
  const token = localStorage.getItem('access');

  // Fetch job data
  const fetchJobData = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}/api/empjob/getAlljobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setJobData(response.data);
        setFilterData(response.data); // Initialize filterData with all jobs
        setError(null);
      } else {
        setError('Failed to fetch job data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      setError('An error occurred while fetching job data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [baseURL, token]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = action
    ? filterData.slice(indexOfFirstItem, indexOfLastItem) // Use filtered data if action is true
    : jobData.slice(indexOfFirstItem, indexOfLastItem); // Use all jobs otherwise
  const totalPages = Math.ceil((action ? filterData.length : jobData.length) / itemsPerPage);

  if (loading) {
    return (
      <div className="ch-find-job-page">
        <div className="ch-loading-container">
          <div className="ch-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ch-find-job-page">
        <div className="ch-error-message">{error}</div>
      </div>
    );
  }

  if (jobData.length === 0 || (action && filterData.length === 0)) {
    return (
      <div className="ch-find-job-page">
        <div className="ch-no-jobs-message">No jobs found.</div>
      </div>
    );
  }

  return (
    <div className="ch-find-job-page">
      {/* Main Content */}
      <div className="ch-main-content">
        {/* Search Bar */}
        <div className="ch-search-box-container">
          <SearchBox
            jobData={jobData}
            setFilterData={setFilterData}
            setAction={setAction}
          />
        </div>

        {/* Job Listings */}
        <div className="ch-job-cards-container">
          {currentJobs.map((job) => (
            <JobCard
              key={`${job.id}-${job.title}`}
              id={job.id}
              img={job.employer.profile_pic || 'default-profile.png'} 
              title={job.title}
              posted={job.posteDate}
              applybefore={job.applyBefore}
              empname={job.employer.user_full_name}
              jobtype={job.jobtype}
              salary={job.lpa}
              experience={job.experience}
              location={job.location}
              about={job.about}
              Responsibility={job.Responsibility}
              cardClass="ch-job-card"
              headerClass="ch-card-header"
              profileImgClass="ch-profile-img"
              titleClass="ch-card-title"
              companyClass="ch-company-name"
              detailsClass="ch-card-details"
              detailItemClass="ch-detail-item"
              iconClass="ch-detail-icon"
              textClass="ch-detail-text"
              footerClass="ch-card-footer"
              tagsClass="ch-tags-container"
              tagClass="ch-tag"
              buttonClass="ch-apply-button"
              About="about"
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="ch-pagination-container-find-job">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            controlClass="ch-pagination-control"
            buttonClass="ch-page-button"
            activeClass="ch-active"
          />
        </div>
      </div>
    </div>
  );
}

export default CandidateHome;