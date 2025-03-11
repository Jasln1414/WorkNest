import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/admin/utilities/AdminSideBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Styles/Admin/AdminSideBar.css'; // Make sure to create this file with the CSS I provided

function EmployerList() {
    const baseURL = import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:8000';
    const [employelist, setEmployelist] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}/dashboard/elist/`);
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        setEmployelist(response.data);
                    } else {
                        console.error('API response is not an array:', response.data);
                        setEmployelist([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching employer list:', error);
                setEmployelist([]);
            }
        };

        fetchData();
    }, [baseURL]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredEmployers = Array.isArray(employelist)
        ? employelist.filter((employer) =>
              employer.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    return (
        <div className="el-content-wrapper">
            <Sidebar />
            <div className="el-main-content">
               
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
                
                <div className="el-table-container">
                    <table className="el-employer-table">
                        <thead className="el-table-header">
                            <tr>
                                <th className="el-header-cell">Profile Pic</th>
                                <th className="el-header-cell">Name</th>
                                <th className="el-header-cell">Email</th>
                                <th className="el-header-cell">Phone</th>
                                <th className="el-header-cell">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployers.map((list, index) => (
                                <tr key={index} className="el-table-row">
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${list.id}`} className="el-link-wrapper">
                                            <img className="el-avatar" src={baseURL + list.profile_pic} alt="Employer avatar" />
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${list.id}`} className="el-link-wrapper">
                                            {list.user_name || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${list.id}`} className="el-link-wrapper">
                                            {list.email || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${list.id}`} className="el-link-wrapper">
                                            {list.phone || 'N/A'}
                                        </Link>
                                    </td>
                                    <td className="el-table-cell">
                                        <Link to={`/admin/edetails/${list.id}`} className="el-link-wrapper">
                                            <span className={`el-status-badge ${list.status ? "el-status-active" : "el-status-inactive"}`}>
                                                {list.status ? "Active" : "Inactive"}
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

export default EmployerList;