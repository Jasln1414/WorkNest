import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import JobCard from './utilities/Jobcard';
import Pagination from './utilities/Paginations';
import BlinkingArrow from './utilities/BlinkingArow';
import SearchBar from './utilities/SearchBox';
import QuickFilterDropdowns from './utilities/Filter';
import '../../Styles/LandingPage.css';
import '../../Styles/USER/Home.css';
import { Link } from "react-router-dom"; // Add this import

function CandidateHome() {
  const baseURL = 'http://127.0.0.1:8000';
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
  });

  const [filters, setFilters] = useState({
    jobType: '',
    jobMode: '',
    experience: '',
    salaryRange: '',
    location: '',
  });

  const itemsPerPage = 6;
  const token = localStorage.getItem('access');

  // Fetch all jobs on component mount
  const fetchAllJobs = useCallback(async () => {
    setLoading(true);
    setSearchPerformed(false);
    try {
      const response = await axios.get(`${baseURL}/api/empjob/getAlljobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const jobs = Array.isArray(response.data) ? response.data : [];
        console.log("Fetched Jobs:", jobs); // Debugging line
        setJobData(jobs);
        setFilteredJobs(jobs);
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
  }, [token]);

  // Handle search with filters
  const handleSearch = useCallback(() => {
    if (isSearching) return;

    setIsSearching(true);
    setLoading(true);
    setSearchPerformed(true);
    setCurrentPage(1);

    const queryParams = new URLSearchParams();

    // Add search parameters
    if (searchParams.keyword) queryParams.append('search', searchParams.keyword);
    if (searchParams.location) queryParams.append('location', searchParams.location);

    // Add filter parameters
    if (filters.jobType) queryParams.append('jobtype', filters.jobType);
    if (filters.jobMode) queryParams.append('jobmode', filters.jobMode);
    if (filters.experience) queryParams.append('experience', filters.experience);
    if (filters.salaryRange) queryParams.append('salary', filters.salaryRange);
    if (filters.location && !searchParams.location) queryParams.append('location', filters.location);

    // Execute the search
    axios
      .get(`${baseURL}/api/empjob/search/?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          let jobs = [];
          if (Array.isArray(response.data)) {
            jobs = response.data;
          } else if (response.data.results && Array.isArray(response.data.results)) {
            jobs = response.data.results;
          } else if (typeof response.data === 'object' && Object.keys(response.data).length > 0) {
            jobs = Object.values(response.data);
          }
          setFilteredJobs(jobs);
          setError(null);
        } else {
          setError('Failed to fetch job data. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error fetching job data:', error);
        if (error.response && error.response.status === 500) {
          setError('Server error. There might be an issue with your search criteria.');
          setFilteredJobs(jobData); // Fall back to showing all jobs
        } else {
          setError('An error occurred while fetching job data. Please try again later.');
        }
      })
      .finally(() => {
        setLoading(false);
        setIsSearching(false);
      });
  }, [searchParams, filters, token, jobData, isSearching, baseURL]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      jobType: '',
      jobMode: '',
      experience: '',
      salaryRange: '',
      location: '',
    });
    handleSearch(); // Trigger search after reset
  };

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentJobs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  if (loading) {
    return (
      <div className="find-job-page-h1233">
        <div className="loading-container-h1233">
          <div className="spinner-h1233"></div>
          <p>Loading job listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="find-job-page-h1233">
      <div className="find-job-header-h1233">
        <h1>Find Your Next Opportunity</h1>
        <p>Browse through hundreds of job listings tailored for you</p>
      </div>

      <SearchBar
        searchParams={searchParams}
        handleSearchInputChange={handleSearchInputChange}
        handleSearch={handleSearch}
      />

      <QuickFilterDropdowns
        filters={filters}
        setFilters={setFilters}
        handleSearch={handleSearch}
        resetFilters={resetFilters}
      />

      {error && (
        <div className="error-container-h1233">
          <p className="error-text-h1233">{error}</p>
        </div>
      )}

      <div className="jobs-content-area">
        <div className="search-status">
          <p>{filteredJobs.length} jobs found</p>
          {searchPerformed && filteredJobs.length === 0 && (
            <button onClick={fetchAllJobs} className="view-all-jobs-button">
              View All Available Jobs
            </button>
          )}
        </div>

        <div className="job-cards-container-h1233">
          {getCurrentJobs().length > 0 ? (
            getCurrentJobs().map((job) => {
              console.log("Job Data:", job); // Debugging line
              return (
                <JobCard 
                id={job.id} 
                img={job.employer.profile_pic} 
                title={job.title} 
                posted={job.posteDate} // Pass actual date
                applybefore={job.applyBefore} 
                empname={job.employer.name} 
                experience={job.experience} 
                jobmode={job.jobmode} 
                jobtype={job.jobtype} 
                location={job.location} 
                salary={job.lpa} 
              />
              
              );
            })
          ) : (
            <div className="no-jobs-message-h1233">
              <p>No jobs match your current filters</p>
              <BlinkingArrow onClick={fetchAllJobs} />
              <p>Click to see all available jobs</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </div>
  );
}

export default CandidateHome;