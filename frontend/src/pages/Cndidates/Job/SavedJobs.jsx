import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import JobCard from '../utilities/Jobcard';

const useSavedJobs = (token) => {
    const [jobdata, setJobData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/empjob/savedjobs/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                if (response.status === 200) {
                    setJobData(response.data.data);
                } else {
                    setError("No saved jobs found");
                }
            } catch (error) {
                console.error("Error fetching saved jobs:", error);
                setError("Failed to load saved jobs");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [token]);

    return { jobdata, loading, error };
};

function SavedJobs() {
    const token = localStorage.getItem('access');
    const { jobdata, loading, error } = useSavedJobs(token);

    if (error) {
        Swal.fire({
            title: "Error",
            text: error,
            icon: "error"
        });
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto mb-15">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 tracking-tight mb-15">
                        SAVED JOBS
                    </h1>
                    <div className="w-20 h-1 bg-blue-600 rounded"></div>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="animate-pulse bg-white shadow-md rounded-lg p-6">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                            </div>
                        ))}
                    </div>
                ) : jobdata.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 ">
                        {jobdata.map((job) => (
                            <div key={job.job.id} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <JobCard
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-8 text-center transform transition-all duration-500 hover:shadow-xl">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg mb-4">You haven't saved any jobs yet</p>
                        <p className="text-gray-500 mb-6">Start exploring and save jobs that interest you</p>
                        <button className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
                            Explore Jobs
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SavedJobs;