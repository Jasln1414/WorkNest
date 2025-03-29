// src/App.js
import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import LandingPage from "./pages/LandingPage";
import EmployerWrapper from "./pages/Employer/EmployWrapper";
import Footer from "./Components/Footer";
import { ToastContainer } from "react-toastify";
import Header from "./Components/Header";
import LoginModal from "./Components/Employer/LoginModal";
import SignupModal from "./Components/Employer/SignupModal";
import AdminWrapper from "./Components/admin/AdminWrapper";
import CandidateWrapper from './pages/Cndidates/CandidateWrapper';
import ResetPasswordModal from "./pages/comon/ResetPassword";
import ForgotPasswordModal from "./pages/comon/ForgotPassword";
import './validation/App.css';
import './index.css';

// Custom Toast Container Component
const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{ 
        width: '400px',
        '--toastify-toast-min-height': '80px',
        '--toastify-toast-width': '400px'
      }}
      closeButton={({ closeToast }) => (
        <button 
          onClick={closeToast}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginLeft: '30vh'
          }}
        >
          ✕
        </button>
      )}
    />
  );
};

// Conditional Header Component
const ConditionalHeader = ({ children }) => {
  const location = useLocation();
  
  return (
    <>
      {location.pathname === '/' && <Header />}
      {children}
    </>
  );
};

// Error Boundary Component
const ErrorBoundary = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Oops! Something went wrong.</h2>
      <p>Please try again later or contact support.</p>
    </div>
  );
};

// AppLayout Component
const AppLayout = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get-csrf-token/')
      .then(response => {
        axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
        document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
        console.log('CSRF token set successfully');
      })
      .catch(error => {
        console.error('Error fetching CSRF token:', error);
      });
  }, []);

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
    if (showSignupModal) setShowSignupModal(false);
  };

  const toggleSignupModal = () => {
    setShowSignupModal(!showSignupModal);
    if (showLoginModal) setShowLoginModal(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleOtpSuccess = () => {
    console.log("OTP verification successful in AppLayout");
    setShowResetPasswordModal(true);
    setShowForgotPasswordModal(false);
  };

  return (
    <>
      <CustomToastContainer />
      <ConditionalHeader>
        <Outlet />
      </ConditionalHeader>
      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={toggleLoginModal}
        switchToSignup={switchToSignup}
        toggleLoginModal={toggleLoginModal}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={toggleSignupModal}
        switchToLogin={switchToLogin}
      />
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        closeModal={() => setShowForgotPasswordModal(false)}
        onOtpSuccess={handleOtpSuccess}
        setEmail={setEmail}
      />
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        closeModal={() => setShowResetPasswordModal(false)}
        email={email}
      />
    </>
  );
};

// Router Configuration
const router = createBrowserRouter([
  { 
    path: "/", 
    element: <AppLayout />, 
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/employer/*", element: <EmployerWrapper /> },
      { path: "/admin/*", element: <AdminWrapper /> },
      { path: "/candidate/*", element: <CandidateWrapper /> },
      { path: "/reset_password/:id", element: <ResetPasswordModal /> },
      { path: "*", element: <div>Page Not Found</div> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;