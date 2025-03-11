import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import isAuthUser from '../../utils/isAuthUser';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import CandidateHeader from './CandidateHeader';
import ProfileCreation from './CandidateProfileCreation';
import CandidateHome from './FindJob';
import Profile from './ProfileView';
import JobDetail from './Job/CandidateJobDeatail';

function CandidateWrapper() {
  const baseURL = 'http://127.0.0.1:8000';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authentication_user = useSelector((state) => state.authentication_user);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthAndFetchUserDetails = async () => {
    console.log('Token:', localStorage.getItem('access'));
    console.log('Current Path:', window.location.pathname);
    console.log('Authentication State:', authentication_user);

    const token = localStorage.getItem('access');

    if (!token) {
      console.warn('No token found, redirecting to login');
      navigate('/');
      setIsLoading(false);
      return;
    }

    try {
      // Check if the user is authenticated
      const authResult = await isAuthUser();
      console.log('Authentication Result:', authResult);

      if (!authResult.isAuthenticated) {
        console.warn('Not authenticated, redirecting to login');
        navigate('/');
        setIsLoading(false);
        return;
      }

      // Fetch user details
      const response = await axios.get(`${baseURL}api/account/user/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('User Details Response:', response.data);

      if (response.status === 200) {
        // Update authentication state
        dispatch(
          set_Authentication({
            name: response.data.data.full_name,
            email: response.data.data.email,
            isAuthenticated: true,
            usertype: response.data.data.usertype,
          })
        );

        // Update user basic details
        dispatch(
          set_user_basic_details({
            profile_pic: response.data.profile_pic,
          })
        );

        setIsLoading(false);
        return;
      }

      // If the response is not successful, redirect to login
      navigate('/');
      setIsLoading(false);

    } catch (error) {
      console.error('Authentication Detailed Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      navigate('/');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Effect Triggered - Current Auth State:', authentication_user);

    if (!authentication_user.isAuthenticated) {
      checkAuthAndFetchUserDetails();
    } else {
      setIsLoading(false);
    }
  }, [authentication_user.isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CandidateHeader />
      <Routes>
        <Route index element={<CandidateHome />} />
        <Route path="find-job" element={<CandidateHome />} />
        <Route path="/find-job/job/:jobId" element={<JobDetail />} />
        <Route
          path="profile-creation"
          element={
            authentication_user.isAuthenticated ? (
              <ProfileCreation />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="profile"
          element={
            authentication_user.isAuthenticated ? (
              <Profile />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <div>
              <h1>404 - Candidate Page Not Found</h1>
              <p>The candidate page you are looking for does not exist.</p>
              <button onClick={() => navigate('/candidate')}>
                Go to Candidate Home
              </button>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default CandidateWrapper;