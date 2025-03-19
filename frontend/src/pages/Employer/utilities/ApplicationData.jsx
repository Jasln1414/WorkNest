import React from "react";
import '../../../Styles/Job/StatusJob.css';

function ApplicationData({ jobData, handleJobClick, toggleApplication }) {
  const formatDate = (dateTimeString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="app-data-container">
      <div className="app-data-card">
        <div className="app-data-header">
          <span className="app-data-title">Applications</span>
        </div>
        <div className="app-data-list">
          {jobData.map((job) => (
            <div
              key={job.id}
              onClick={() => handleJobClick(job)}
              className="app-data-job-item"
            >
              <div className="app-data-expiry">
                Expiry: {job.applyBefore}
              </div>
              <div className="app-data-applications-count">
                <span className="app-data-count-badge">
                  {job.applications.length}
                </span>
              </div>

              <div className="app-data-job-header">
                <div className="app-data-job-title-section">
                  <p className="app-data-job-title">{job.title}</p>
                  <p className="app-data-employer">{job.employer_name}</p>
                </div>
              </div>

              <div className="app-data-job-details">
                <div className="app-data-job-info">
                  <div className="app-data-info-item">
                    Job Posted:
                    <span className="app-data-badge app-data-badge-green">
                      {formatDate(job.posteDate)}
                    </span>
                  </div>
                  <div className="app-data-info-item">
                    Location:
                    <span className="app-data-badge app-data-badge-yellow">
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="app-data-job-info">
                  <div className="app-data-info-item">
                    Experience:
                    <span className="app-data-badge app-data-badge-pink">
                      {job.experience}
                    </span>
                  </div>
                  <div className="app-data-info-item">
                    Salary:
                    <span className="app-data-badge app-data-badge-blue">
                      {job.lpa} lpa
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApplicationData;