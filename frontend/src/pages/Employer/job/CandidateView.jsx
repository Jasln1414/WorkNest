import React, { useState } from "react";
import axios from "axios";
import ChatModal from "./ChatModal";
import Swal from "sweetalert2"; // Import SweetAlert2
import "../../../Styles/USER/Home.css";

function CandidateView({ selectedJob, setChange, current, questions }) {
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem("access");
  const [appStatus, setAppStatus] = useState(current.status);
  const [chat, setChat] = useState(false);

  const profile_pic = baseURL + current.candidate.profile_pic;
  const userName = current.candidate.user_name;
  const candidate_id = current.candidate.id;
  const employer_id = selectedJob.employer_id;
  const emp_name = selectedJob.employer_name;

  // Function to handle status change
  const changeStatus = async (action) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/empjob/applicationStatus/${current.id}/`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setAppStatus(action); // Update the local state
        // Show a success message using SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Application status changed to ${action}.`,
          showConfirmButton: false,
          timer: 1500, // Auto-close after 1.5 seconds
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Show an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
        showConfirmButton: false,
        timer: 1500, // Auto-close after 1.5 seconds
      });
    }
  };

  // Function to handle resume viewing
  const handleResume = () => {
    changeStatus("Resume Viewed");
    setAppStatus("Resume Viewed");
  };

  // Function to handle chat modal
  const handleChat = () => {
    setChat(true);
  };

  return (
    <div className="candidate-view-container">
      {chat && (
        <ChatModal
          candidate_id={candidate_id}
          employer_id={employer_id}
          setChat={setChat}
          profile_pic={profile_pic}
          userName={userName}
          emp_name={emp_name}
        />
      )}

      {/* Action Buttons */}
      <div className="candidate-actions">
        <button
          className={`action-button ${appStatus === "Pending" ? "pending-button active" : "pending-button"}`}
          onClick={() => changeStatus("Pending")}
        >
          Pending
        </button>
        <button
          className={`action-button ${appStatus === "Accepted" ? "accept-button active" : "accept-button"}`}
          onClick={() => changeStatus("Accepted")}
        >
          Accept
        </button>
        <button
          className={`action-button ${appStatus === "Rejected" ? "reject-button active" : "reject-button"}`}
          onClick={() => changeStatus("Rejected")}
        >
          Reject
        </button>
        <button className="action-button chat-button" onClick={handleChat}>
          Chat
        </button>
      </div>

      {/* Candidate Profile Section */}
      <div className="candidate-info-section">
        <h2 className="section-title">Candidate Info</h2>
        <div className="candidate-profile">
          <img
            src={profile_pic}
            alt="Candidate Profile"
            className="profile-image"
          />
          <p className="candidate-name">{userName}</p>
        </div>
        <div className="info-details">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <p className="info-value">{current.candidate.email}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <p className="info-value">{current.candidate.phone}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Gender:</span>
            <p className="info-value">{current.candidate.Gender}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Birth:</span>
            <p className="info-value">{current.candidate.dob}</p>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="education-info-section">
        <h2 className="section-title">Education Info</h2>
        <div className="info-details">
          <div className="info-item">
            <span className="info-label">Qualification:</span>
            <p className="info-value">
              {current.candidate.education[0].education}
            </p>
          </div>
          <div className="info-item">
            <span className="info-label">Specialisation:</span>
            <p className="info-value">
              {current.candidate.education[0].specilization}
            </p>
          </div>
          <div className="info-item">
            <span className="info-label">Completed Year:</span>
            <p className="info-value">
              {current.candidate.education[0].completed}
            </p>
          </div>
          <div className="info-item">
            <span className="info-label">College:</span>
            <p className="info-value">
              {current.candidate.education[0].college}
            </p>
          </div>
          <div className="info-item">
            <span className="info-label">Mark in CGPA:</span>
            <p className="info-value">{current.candidate.education[0].mark}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Skills:</span>
            <p className="info-value">{current.candidate.skills}</p>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="links-section">
        <h2 className="section-title">Links</h2>
        <div className="info-details">
          <div className="info-item">
            <span className="info-label">LinkedIn:</span>
            <p className="info-value">
              <a
                href={current.candidate.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {current.candidate.linkedin}
              </a>
            </p>
          </div>
          <div className="info-item">
            <span className="info-label">GitHub:</span>
            <p className="info-value">
              <a
                href={current.candidate.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {current.candidate.github}
              </a>
            </p>
          </div>
          <div className="info-item">
            <span className="info-label">Resume:</span>
            <p className="info-value">
              <a
                href={`${baseURL}${current.candidate.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
                onClick={handleResume}
              >
                View Resume
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateView;