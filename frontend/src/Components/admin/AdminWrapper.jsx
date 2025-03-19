import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminHome from '../../pages/Admin/AdminHome';
import AdminLogin from '../../pages/Admin/AdminLogin';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import isAuthAdmin from '../../utils/isAuthAdmin';
import AdminHeader from './AdminHeader';
import Cdetails from '../../pages/Admin/CandidateDetails';
import EmployerList from '../../pages/Admin/EmployerList';
import CandidateList from '../../pages/Admin/CadidatesList';
import Edetails from '../../pages/Admin/EmployerDetails';
import '../../Styles/EmpHome.css';
import AdminJobView from '../../pages/Admin/PostedJobs';
import AdminJobDetail from '../../pages/Admin/PostedJobDetails';

function AdminWrapper() {
  const dispatch = useDispatch();
  const location = useLocation(); // Get current location
  const authentication_user = useSelector((state) => state.authentication_user);
  const token = localStorage.getItem("access");

  const checkAuthAndFetchUserData = async () => {
    try {
      const isAuthenticated = await isAuthAdmin();
      dispatch(
        set_Authentication({
          name: isAuthenticated.name,
          isAuthenticated: isAuthenticated.isAuthenticated,
          isAdmin: isAuthenticated.isAdmin,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!authentication_user.name) {
      checkAuthAndFetchUserData();
    }
  }, []);

  const getHeaderTitle = () => {
    console.log('Current pathname:', location.pathname);
    const path = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
    console.log('Cleaned pathname:', path);

    // Handle dynamic routes
    if (path.startsWith('/admin/cdetails/')) {
      return 'Candidate Details';
    }
    if (path.startsWith('/admin/edetails/')) {
      return 'Employer Details';
    }
    if (path.startsWith('/admin/jobDetailList/')) {
      return 'Job Details';
    }


    // Handle static routes
    switch (path) {
      case '/admin/clist':
        return 'Candidate List';
      case '/admin/elist':
        return 'Employer List';
      case '/admin/home':
        return 'AdminHome';
      case '/admin/jobList':
        return 'Posted Jobs';
     
      default:
        return 'Admin Panel';
    }
  };

  return (
    <div className="admin-wrapper">
      <AdminHeader />
      <div className="admin-content">
        <h1 className='header-title'>{getHeaderTitle()}</h1> {/* Display the dynamic title */}
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/home" element={<AdminHome />} />
          <Route path="/clist" element={<CandidateList />} />
          <Route path="/elist" element={<EmployerList />} />
          <Route path="/cdetails/:id" element={<Cdetails />} />
          <Route path="/edetails/:id" element={<Edetails />} />
          <Route path="/jobList" element={<AdminJobView />} />
          <Route path="/jobDetailList/:id" element={<AdminJobDetail />} />

        </Routes>
      </div>
    </div>
  );
}

export default AdminWrapper;