import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../Styles/SideBar.css';

function EmpHome() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = "http://127.0.0.1:8000/";
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(baseURL + 'api/empjob/getjobs/', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          setJobData(response.data.data);
        }
      } catch (error) {
        console.error("Something went wrong", error);
        setError("Failed to fetch job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchJobDetails();
    }
  }, [token]);

  return (
    <div className="emp-home-container">
      {/* Always display the SideBar */}
      <SideBar />

      <div className="main-content">
        {loading ? (
          <div className="loading-message">Loading jobs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : jobData.length > 0 ? (
          jobData.map((job, index) => (
            <div key={index} className="job-card">
              <div>
                <Link to={`/employer/jobdetail/${job.id}`}>
                  <p className="job-title">{job.title}</p>
                </Link>
                <div className="job-detail">
                  <span>Status: {job.active ? <span className="job-status-active">Active</span> : <span className="job-status-active">Active</span>}</span>
                </div>
                <div className="job-detail">
                  <span>Location: {job.location}</span>
                </div>
                <div className="job-detail">
                  <span>Experience: {job.experience}</span>
                </div>
                <div className="job-detail">
                  <span>Salary: {job.lpa} LPA</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-jobs-container">
            <div className="no-jobs-message">
              <h3 className="no-jobs-title">Add your first job</h3>
              <p className="no-jobs-text">There are currently no job listings. Post a job to start attracting candidates.</p>
              <Link to={'/employer/postjob/'}>
                <button className="post-job-button">Post Job</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmpHome;