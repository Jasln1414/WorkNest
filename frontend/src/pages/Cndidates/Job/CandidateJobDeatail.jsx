import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSuitcase } from "react-icons/fa";
import { MdCurrencyRupee, MdDateRange } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';
import Qmodal from '../../../Components/Candidates/utilities/Qmodal';
import '../../../Styles/Candidate/jobdetail.css';

// Sub-components remain the same
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

const JobActions = ({ jobData, handleApply, handleSave, isSaved, hasQuestions }) => (
  <div className="job-actions">
    <div className="action-item">
      <MdDateRange />
      <span>Posted {formatDistanceToNow(new Date(jobData.posteDate), { addSuffix: true }).replace('about ', '').replace('hours', 'hr')}</span>
    </div>
    <div className="action-item">
      <span>Apply Before: {jobData.applyBefore}</span>
    </div>
    <div className="action-buttons">
      <button 
        className="apply-button" 
        onClick={handleApply}
      >
        Apply
      </button>
      <button className="save-button" onClick={handleSave}>
        {isSaved ? 'Unsave' : 'Save'}
      </button>
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

// Main Component with all fixes
function JobDetail() {
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState(false);
  const [userid, setUserid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debugging logs
  useEffect(() => {
    console.log('Current questions:', questions);
    console.log('Modal state:', modal);
    console.log('Answers state:', answers);
  }, [questions, modal, answers]);

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/account/current_user/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('User data:', response.data);
        setUserid(response.data.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setError('Failed to load user data');
      }
    };
    fetchUserId();
  }, [token]);

  // Fetch job data and questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job details
        const jobResponse = await axios.get(`${baseURL}/api/empjob/getjobs/detail/${jobId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Job data:', jobResponse.data);
        setJobData(jobResponse.data);

        // Fetch questions
        const questionsResponse = await axios.get(`${baseURL}/api/empjob/getjobs/questions/${jobId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Questions response:', questionsResponse.data);
        
        // Handle both response formats
        const questionsData = Array.isArray(questionsResponse.data) 
          ? questionsResponse.data 
          : (questionsResponse.data?.questions || []);
        
        setQuestions(questionsData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, token]);

  const handleSave = async () => {
    try {
      const action = isSaved ? 'unsave' : 'save';
      const response = await axios.post(`${baseURL}/api/empjob/savejob/${jobId}/`, 
        { action }, 
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        setIsSaved(!isSaved);
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Job ${action}ed successfully`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update saved status'
      });
    }
  };

  const handleApplyClick = async () => {
    console.log('Apply button clicked');
    console.log('Questions count:', questions.length);
    
    try {
      if (questions.length > 0) {
        console.log('Showing modal with questions');
        setModal(true);
      } else {
        console.log('No questions - applying directly');
        await handleApply({});
      }
    } catch (error) {
      console.error('Apply click error:', error);
    }
  };

  const handleApply = async (submittedAnswers = {}) => {
    try {
      console.log('Attempting to apply with:', {userid, answers: submittedAnswers});
      
      if (!userid) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(
        `${baseURL}/api/empjob/applyjob/${jobId}/`,
        {
          userid: userid,
          answers: submittedAnswers
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Application response:', response.data);
      setModal(false);
      setAnswers({});

      Swal.fire({
        position: "center",
        icon: "success",
        title: response.data.message || 'Application submitted!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Application error:', error.response || error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Application failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!jobData) return <div className="error">Job not found</div>;

  const image = jobData.employer?.profile_pic ? `${baseURL}${jobData.employer.profile_pic}` : '';

  return (
    <div className="job-detail-container">
      {modal && (
        <Qmodal 
          setModal={setModal} 
          questions={questions} 
          setAnswers={setAnswers} 
          answers={answers} 
          handleApply={handleApply}
        />
      )}
      
      <div className="job-detail-card">
        <JobHeader jobData={jobData} image={image} />
        <JobMeta jobData={jobData} />
        <JobActions 
          jobData={jobData} 
          handleApply={handleApplyClick}
          handleSave={handleSave} 
          isSaved={isSaved}
          hasQuestions={questions.length > 0}
        />
      </div>
      <JobDescription jobData={jobData} />
      <CompanyInfo jobData={jobData} />
    </div>
  );
}

export default JobDetail;