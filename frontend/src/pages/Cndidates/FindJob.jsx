import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './utilities/Jobcard';
import SearchBox from './utilities/SearchBox';
import Pagination from './utilities/Paginations';
import Filter from './utilities/Filter';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

function CandidateHome() {
  const baseURL = 'http://127.0.0.1:8000';
  const [jobData, setJobData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [action, setAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;
  const token = localStorage.getItem('access');

  // Fetch job data
  useEffect(() => {
    const fetchJobData = async () => {
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
    };

    fetchJobData();
  }, [baseURL, token]);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = action
    ? filterData.slice(indexOfFirstItem, indexOfLastItem)
    : jobData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((action ? filterData.length : jobData.length) / itemsPerPage);

  // Toggle filter drawer
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="flex relative">
      {/* Filter Sidebar */}
      <div className="absolute md:hidden mt-14">
        <button
          onClick={toggleDrawer}
          className="w-16 h-8 mt-2 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
        >
          Filter
        </button>
        <Drawer open={isOpen} onClose={toggleDrawer} direction="left" className="bg-gray-50">
          <Filter
            setJobData={setJobData}
            jobData={jobData}
            setFilterData={setFilterData}
            setAction={setAction}
          />
        </Drawer>
      </div>

      {/* Main Content */}
      <div className="pt-7 w-full">
        {/* Search Bar */}
        <div className="mt-7 ml-10 flex justify-center">
          <SearchBox
            setJobData={setJobData}
            jobData={jobData}
            setFilterData={setFilterData}
            setAction={setAction}
          />
        </div>

        {/* Job Listings */}
        <div className="flex flex-col min-h-[32rem]">
          <div className="flex-grow flex justify-center">
            <div className="flex flex-col justify-center md:w-4/6">
              {currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  img={job.employer.profile_pic}
                  title={job.title}
                  posted={job.posteDate}
                 
                  applybefore={job.applyBefore}
                  empname={job.employer.user_full_name}
                  jobtype={job.jobtype}
                  salary={job.lpa}
                  experience={job.experience}
                  location={job.location}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateHome;