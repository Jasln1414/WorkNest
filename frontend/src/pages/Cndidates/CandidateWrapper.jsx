
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CandidateHeader from './CandidateHeader';
import CandidateHome from './FindJob';
import ProfileCreation from './CandidateProfileCreation';
import Profile from './ProfileView';
import JobDetail from './Job/CandidateJobDeatail';
import ApplyedJob from './Job/ApplyJob';
import SavedJobs from './Job/SavedJobs';
import Message from './Message/Message';

function CandidateWrapper() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authentication_user = useSelector((state) => state.authentication_user);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token || !authentication_user.isAuthenticated) {
      navigate('/');
    }
  }, [authentication_user.isAuthenticated, navigate]);

  return (
    <div>
      <CandidateHeader />
      <Routes>
        <Route index element={<CandidateHome />} />
        <Route path="find-job" element={<CandidateHome />} />
        <Route path="/find-job/job/:jobId" element={<JobDetail />} />
        <Route path="/applyedjobs" element={<ApplyedJob />} />
        <Route path="/savedjobs" element={<SavedJobs />} />
        <Route path="/messages" element={<Message />} />
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