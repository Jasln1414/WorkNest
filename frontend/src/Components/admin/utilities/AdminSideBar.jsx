import React from 'react';
import { Link } from 'react-router-dom';
import '../../../Styles/Sidebar.css';

function Sidebar() {
  return (
    <div>
      <aside id="default-sidebar" className="sidebar-container" aria-label="Sidebar">
        <div className="sidebar-inner">
            <ul className="sidebar-menu">
              <li className="sidebar-item">
                <Link to={'/admin/home/'} >
                  <p className="sidebar-link">
                    <span className="sidebar-text">Dashboard</span>
                  </p>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to={'/admin/clist/'}>
                  <p className="sidebar-link">
                    <span className="sidebar-text">Candidates</span>
                  </p>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to={'/admin/elist/'} >
                  <p className="sidebar-link">
                    <span className="sidebar-text">Employers</span>
                  </p>
                  
                </Link>
                </li>
                <li className="sidebar-item">
                <Link to={'/admin/jobList/'} >
                  <p className="sidebar-link">
                    <span className="sidebar-text">Posted Jobs</span>
                  </p>
                </Link>

              </li>
              <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                    <span className="sidebar-text">Sign Out</span>
                  </a>
              </li>
            </ul>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;