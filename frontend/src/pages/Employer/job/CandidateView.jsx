import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ChatModal from './ChatModal';
import '../../../Styles/USER/Home.css';

const CandidateView = ({ selectedJob, setChange, current, questions }) => {
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const [appStatus, setAppStatus] = useState(current?.status || 'Application Send');
  const [chat, setChat] = useState(false);

  if (!current) {
    return <div>Select an application to view details</div>;
  }

  const answers = current.answers || [];
  const profilePic = current.candidate?.profile_pic ? `${baseURL}${current.candidate.profile_pic}` : '';
  const userName = current.candidate?.user_name || current.candidate_name;
  const candidateId = current.candidate?.id;
  const employerId = selectedJob?.employer_id;
  const empName = selectedJob?.employer_name;

  const changeStatus = async (action) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/empjob/applicationStatus/${current.id}/`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setAppStatus(action);
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Application status changed to ${action}.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error.response || error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update status. Please try again.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleResume = () => {
    changeStatus('Resume Viewed'); // Corrected typo from 'Resume Viewd'
  };

  const handleChat = () => {
    setChat(true);
  };

  return (
    <div className="candidate-view-container">
      {chat && (
        <ChatModal
          candidate_id={candidateId}
          employer_id={employerId}
          setChat={setChat}
          profile_pic={profilePic}
          userName={userName}
          emp_name={empName}
        />
      )}

      <div className="candidate-actions">
        <button
          className={`action-button ${appStatus === 'Pending' ? 'pending-button active' : 'pending-button'}`}
          onClick={() => changeStatus('Pending')}
        >
          Pending
        </button>
        <button
          className={`action-button ${appStatus === 'ShortListed' ? 'accept-button active' : 'accept-button'}`}
          onClick={() => changeStatus('ShortListed')}
        >
          ShortList
        </button>
        <button
          className={`action-button ${appStatus === 'Accepted' ? 'accept-button active' : 'accept-button'}`}
          onClick={() => changeStatus('Accepted')}
        >
          Accept
        </button>
        <button
          className={`action-button ${appStatus === 'Rejected' ? 'reject-button active' : 'reject-button'}`}
          onClick={() => changeStatus('Rejected')}
        >
          Reject
        </button>
        <button className="action-button chat-button" onClick={handleChat}>
          Chat
        </button>
      </div>

      <div className="candidate-info-section">
        <h2 className="section-title">Candidate Info</h2>
        <div className="candidate-profile">
          {profilePic && <img src={profilePic} alt="Candidate Profile" className="profile-image" />}
          <p className="candidate-name">{userName}</p>
        </div>
        <div className="info-details">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <p className="info-value">{current.candidate?.email || 'N/A'}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <p className="info-value">{current.candidate?.phone || 'N/A'}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Gender:</span>
            <p className="info-value">{current.candidate?.Gender || 'N/A'}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Birth:</span>
            <p className="info-value">{current.candidate?.dob || 'N/A'}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Applied On:</span>
            <p className="info-value">{new Date(current.applyed_on).toLocaleDateString()}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <p className="info-value">{appStatus}</p>
          </div>
        </div>
      </div>

      {current.candidate?.education?.length > 0 && (
        <div className="education-info-section">
          <h2 className="section-title">Education Info</h2>
          <div className="info-details">
            <div className="info-item">
              <span className="info-label">Qualification:</span>
              <p className="info-value">{current.candidate.education[0].education}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Specialisation:</span>
              <p className="info-value">{current.candidate.education[0].specilization}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Completed Year:</span>
              <p className="info-value">{current.candidate.education[0].completed}</p>
            </div>
            <div className="info-item">
              <span className="info-label">College:</span>
              <p className="info-value">{current.candidate.education[0].college}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Mark in CGPA:</span>
              <p className="info-value">{current.candidate.education[0].mark}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Skills:</span>
              <p className="info-value">{current.candidate.skills || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="links-section">
        <h2 className="section-title">Links</h2>
        <div className="info-details">
          <div className="info-item">
            <span className="info-label">LinkedIn:</span>
            <p className="info-value">
              {current.candidate?.linkedin ? (
                <a href={current.candidate.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                  {current.candidate.linkedin}
                </a>
              ) : (
                'N/A'
              )}
            </p>
          </div>
          <div className="info-item">
            <span className="info-label">GitHub:</span>
            <p className="info-value">
              {current.candidate?.github ? (
                <a href={current.candidate.github} target="_blank" rel="noopener noreferrer" className="link">
                  {current.candidate.github}
                </a>
              ) : (
                'N/A'
              )}
            </p>
          </div>
          <div className="info-item">
            <span className="info-label">Resume:</span>
            <p className="info-value">
              {current.candidate?.resume ? (
                <a
                  href={`${baseURL}${current.candidate.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                  onClick={handleResume}
                >
                  View Resume
                </a>
              ) : (
                'N/A'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="answers-section">
        <h2 className="section-title">Answers</h2>
        {answers.length > 0 ? (
          <ul className="answers-list">
            {answers.map((answer) => {
              const question = questions.find((q) => q.id === answer.question) || {};
              return (
                <li key={answer.id} className="answer-item">
                  <strong>{question.text || 'Unknown Question'}:</strong>
                  {question.question_type === 'MCQ' ? (
                    <span>
                      {question.options
                        ? `${answer.answer_text}: ${question.options[answer.answer_text]}`
                        : answer.answer_text}
                    </span>
                  ) : (
                    <pre>{answer.answer_text}</pre>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No answers provided</p>
        )}
      </div>

      <button onClick={() => setChange(true)} className="back-btn">
        Back to Applications
      </button>
    </div>
  );
};

export default CandidateView;