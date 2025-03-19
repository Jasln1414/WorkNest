import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/admin/utilities/AdminSideBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Styles/Admin/AdminSideBar.css'; // Make sure to create this file with the CSS I provided

function EmployerList() {
    const baseURL = import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:8000';
    const [employerList, setEmployerList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch employers from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}/dashboard/elist/`);
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        setEmployerList(response.data);
                    } else {
                        console.error('API response is not an array:', response.data);
                        setEmployerList([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching employer list:', error);
                setEmployerList([]);
            }
        };

        fetchData();
    }, [baseURL]);

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Handle approval/rejection of employers
    const handleApproval = async (id, action) => {
        try {
            const response = await axios.post(`${baseURL}/dashboard/api/employer/approval/`, { id, action });
            if (response.status === 200) {
                alert(response.data.message);
                // Update the employer list with the new approval status
                setEmployerList(prevEmployers =>
                    prevEmployers.map(employer =>
                        employer.id === id ? { ...employer, is_approved_by_admin: action === 'approve' } : employer
                    )
                );
            }
        } catch (error) {
            console.error('Error updating approval status:', error);
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Error Status Code:", error.response.status);
                console.log("Error Headers:", error.response.headers);
            } else if (error.request) {
                console.log("Error Request:", error.request);
            } else {
                console.log("Error Message:", error.message);
            }
        }
    };

    // Filter employers based on search term
    const filteredEmployers = Array.isArray(employerList)
        ? employerList.filter((employer) =>
              employer.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    return (
        <div className="el-content-wrapper">
            <Sidebar />
            <div className="el-main-content">
                <div className="el-page-header">
                   
                    <div className="el-search-container">
                        <span className="el-search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </span>
                        <input
                            type="text"
                            className="el-search-input"
                            placeholder="Search employers..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                
                <div className="el-table-container">
                    <table className="el-employer-table">
                        <thead className="el-table-header">
                            <tr>
                                <th className="el-header-cell">Profile Pic</th>
                                <th className="el-header-cell">Name</th>
                                <th className="el-header-cell">Email</th>
                                <th className="el-header-cell">Phone</th>
                                <th className="el-header-cell">Status</th>
                                <th className="el-header-cell">Actions</th> {/* New column for actions */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployers.map((employer, index) => (
                                <tr key={index} className="el-table-row">
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${employer.id}`} className="el-link-wrapper">
                                            <img className="el-avatar" src={baseURL + employer.profile_pic} alt="Employer avatar" />
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${employer.id}`} className="el-link-wrapper">
                                            {employer.user_name || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${employer.id}`} className="el-link-wrapper">
                                            {employer.email || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${employer.id}`} className="el-link-wrapper">
                                            {employer.phone || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${employer.id}`} className="el-link-wrapper">
                                            <span className={`el-status-badge ${employer.status ? "el-status-active" : "el-status-inactive"}`}>
                                                {employer.status ? "Active" : "Inactive"}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        {!employer.is_approved_by_admin && (
                                            <button
                                                className="el-approve-button"
                                                onClick={() => handleApproval(employer.id, 'approve')}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {employer.is_approved_by_admin && (
                                            <button
                                                className="el-reject-button"
                                                onClick={() => handleApproval(employer.id, 'reject')}
                                            >
                                                Reject
                                            </button>
                                        )}
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

export default EmployerList;