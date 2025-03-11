import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/admin/utilities/AdminSideBar';
import axios from 'axios';
import '../../Styles/Admin/AdminSidebar.css'; // Updated CSS file

function AdminHome() {
  const [counts, setCounts] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + '/dashboard/home/');
        if (response.status === 200) {
          setCounts(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-home-page">
      <div className="admin-sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="admin-content-wrapper">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-title">
              <span>Candidates</span>
            </div>
            <div className="admin-stat-value">
              <span>{counts ? counts.candidates_count : "Loading..."}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-title">
              <span>Employers</span>
            </div>
            <div className="admin-stat-value">
              <span>{counts ? counts.employers_count : "Loading..."}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-title">
              <span>Jobs</span>
            </div>
            <div className="admin-stat-value">
              <span>{counts ? counts.jobs_count : "Loading..."}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;