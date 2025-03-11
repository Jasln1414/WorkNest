import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/admin/utilities/AdminSideBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Styles/Admin/AdminSidebar.css'; // Make sure to create this file with the CSS I provided

function CandidateList() {
    const baseURL = import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:8000';
    const [candidateList, setCandidateList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}/dashboard/clist/`);
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        setCandidateList(response.data);
                    } else {
                        console.error('API response is not an array:', response.data);
                        setCandidateList([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching candidate list:', error);
                setCandidateList([]);
            }
        };

        fetchData();
    }, [baseURL]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCandidates = Array.isArray(candidateList)
        ? candidateList.filter((candidate) =>
              candidate.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    return (
        <div className="ccl-content-wrapper">
            <Sidebar />
            <div className="ccl-main-content">
                <div className="ccl-page-header">
                    <h1 className="ccl-page-title">Candidate List</h1>
                    <div className="ccl-search-container">
                        <span className="ccl-search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </span>
                        <input
                            type="text"
                            className="ccl-search-input"
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                
                <div className="ccl-table-container">
                    <table className="ccl-candidate-table">
                        <thead className="ccl-table-header">
                            <tr>
                                <th className="ccl-header-cell">Profile Pic</th>
                                <th className="ccl-header-cell">Name</th>
                                <th className="ccl-header-cell">Email</th>
                                <th className="ccl-header-cell">Phone</th>
                                <th className="ccl-header-cell">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map((candidate, index) => (
                                <tr key={index} className="ccl-table-row">
                                    <td className="ccl-table-cell">
                                        <Link to={`/admin/cdetails/${candidate.id}`} className="ccl-link-wrapper">
                                            <img className="ccl-avatar" src={baseURL + candidate.profile_pic} alt="Candidate avatar" />
                                        </Link>
                                    </td>
                                    <td className="ccl-table-cell">
                                        <Link to={`/admin/cdetails/${candidate.id}`} className="ccl-link-wrapper">
                                            {candidate.user_name || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="ccl-table-cell">
                                        <Link to={`/admin/cdetails/${candidate.id}`} className="ccl-link-wrapper">
                                            {candidate.email || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="ccl-table-cell">
                                        <Link to={`/admin/cdetails/${candidate.id}`} className="ccl-link-wrapper">
                                            {candidate.phone || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="ccl-table-cell">
                                        <Link to={`/admin/cdetails/${candidate.id}`} className="ccl-link-wrapper">
                                            <span className={`ccl-status-badge ${candidate.status ? "ccl-status-active" : "ccl-status-inactive"}`}>
                                                {candidate.status ? "Active" : "Inactive"}
                                            </span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CandidateList;