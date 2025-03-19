import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import JobCard from '../utilities/JobCard';
import '../../../Styles/LandingPage.css';
function SavedJobs() {
    const baseURL = 'http://127.0.0.1:8000';
    const token = localStorage.getItem('access');
    const [jobdata, setJobData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(baseURL + '/api/empjob/savedjobs/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200) {
                    setJobData(response.data.data);
                } else {
                    Swal.fire("There is no saved jobs");
                }
            } catch (error) {
                console.error("Error fetching saved jobs:", error);
            }
        };
        fetchData();
    }, [baseURL, token]);

    return (
        <div className="saved-jobs-container">
            <div className="saved-jobs-content">
                <div className="job-cards-container">
                    {jobdata.map((job) => (
                        <JobCard
                            key={job.job.id}
                            id={job.job.id}
                            img={job.job.employer.profile_pic}
                            title={job.job.title}
                            posted={job.job.posteDate}
                            applybefore={job.job.applyBefore}
                            empname={job.job.employer.user_full_name}
                            jobtype={job.job.jobtype}
                            salary={job.job.lpa}
                            experiance={job.job.experiance}
                            location={job.job.location}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SavedJobs;