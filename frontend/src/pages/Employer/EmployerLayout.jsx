// EmployerLayout.js
import React from 'react';
import EmployerHeader from './EmployerHeader';
import SideBar from './SideBar';

const EmployerLayout = ({ children }) => {
  return (
    <div className="employer-layout">
      <EmployerHeader />
      <div className="layout-content">
        <SideBar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EmployerLayout;