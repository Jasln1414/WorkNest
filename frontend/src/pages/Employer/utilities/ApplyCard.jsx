import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../Styles/Job/StatusJob.css';

function ApplyCard({ selectedJob, setChange, setCurrent, setStatus }) {
    const baseURL = 'http://127.0.0.1:8000';
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        if (selectedJob) {
            setApplications(selectedJob.applications);
        }
    }, [selectedJob]);

    const handleClick = (data) => {
        setChange(false);
        setCurrent(data);
    };

    return (
        <div className="apply-card-container">
            {applications.map((data, index) => (
                <div key={index} className="application-card">
                    <div className="application-card-header">
                        <div className="candidate-info">
                            <div className="profile-pic-container">
                                <img src={baseURL + data.candidate.profile_pic} alt="" className="profile-pic" />
                            </div>
                            <div className="candidate-details">
                                <p className="candidate-name">{data.candidate.user_name}</p>
                                <p className="candidate-education">{data.candidate.education[0].education}</p>
                            </div>
                        </div>
                        <div className="view-button-container">
                            <button className="view-button" onClick={() => handleClick(data)}>
                                View
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ApplyCard;