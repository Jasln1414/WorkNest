import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import JobCard from './utilities/Jobcard';
import Pagination from './utilities/Paginations';
import BlinkingArrow from './utilities/BlinkingArow';
import SearchBar from './utilities/SearchBox';
import QuickFilterDropdowns from './utilities/Filter';
import '../../Styles/LandingPage.css';
import '../../Styles/USER/Home.css';

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
    jobtype: '',
    jobmode: '',
    experience: '',
    lpa: '',
    location: '',
  });

  const itemsPerPage = 6;
  const token = localStorage.getItem('access');

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
        setJobData(jobs);
        setFilteredJobs(jobs);
        setError(null);
      } else {
        setError('Failed to fetch job data.');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('An error occurred while fetching jobs.');
    } finally {
      setLoading(false);
    }
  }, [token, baseURL]);

  const handleSearch = useCallback((updatedFilters = filters) => {
    if (isSearching) return;

    setIsSearching(true);
    setLoading(true);
    setSearchPerformed(true);
    setCurrentPage(1);

    const queryParams = new URLSearchParams();
    if (searchParams.keyword) queryParams.append('search', searchParams.keyword);
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (updatedFilters.jobtype) queryParams.append('jobtype', updatedFilters.jobtype);
    if (updatedFilters.jobmode) queryParams.append('jobmode', updatedFilters.jobmode);
    if (updatedFilters.experience) queryParams.append('experience', updatedFilters.experience);
    if (updatedFilters.lpa) queryParams.append('lpa', updatedFilters.lpa);
    if (updatedFilters.location && !searchParams.location) queryParams.append('location', updatedFilters.location);

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
          const jobs = Array.isArray(response.data) 
            ? response.data 
            : response.data.results && Array.isArray(response.data.results) 
              ? response.data.results 
              : [];
          setFilteredJobs(jobs);
          setError(null);
        } else {
          setError('Failed to fetch jobs.');
          setFilteredJobs(jobData);
        }
      })
      .catch((error) => {
        console.error('Search error:', error);
        setError('Error during search. Showing all jobs.');
        setFilteredJobs(jobData);
      })
      .finally(() => {
        setLoading(false);
        setIsSearching(false);
      });
  }, [searchParams, filters, token, jobData, isSearching, baseURL]);

  const resetFilters = () => {
    const resetFilters = {
      jobtype: '',
      jobmode: '',
      experience: '',
      lpa: '',
      location: '',
    };
    setFilters(resetFilters);
    handleSearch(resetFilters);
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
      />

      {error && (
        <div className="error-container-h1233">
          <p className="error-text-h1233">{error}</p>
          <button onClick={resetFilters} className="reset-filters-button">
            Reset Filters
          </button>
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
            getCurrentJobs().map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                img={job.employer?.profile_pic}
                title={job.title}
                posted={job.posteDate}
                applybefore={job.applyBefore}
                empname={job.employer?.name}
                experience={job.experience}
                jobmode={job.jobmode}
                jobtype={job.jobtype}
                location={job.location}
                salary={job.lpa}
              />
            ))
          ) : (
            <div className="no-jobs-message-h1233">
              <p>No jobs match your current filters</p>
              <BlinkingArrow onClick={fetchAllJobs} />
              <p>Click to see all available jobs</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

export default CandidateHome;