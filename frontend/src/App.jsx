import React, { useEffect,useState } from "react";
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

  // Fetch CSRF token when the app loads
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get-csrf-token/')
      .then(response => {
        // Set the CSRF token in axios defaults
        axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
        // Also set it in cookies if needed
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
    setShowResetPasswordModal(true); // Show Reset Password Modal
    setShowForgotPasswordModal(false); // Close Forgot Password Modal
  };

  return (
    <>
      <CustomToastContainer />
      <ConditionalHeader>
        <Outlet />
      </ConditionalHeader>

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={toggleLoginModal}
        switchToSignup={switchToSignup}
        toggleLoginModal={toggleLoginModal}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={toggleSignupModal}
        switchToLogin={switchToLogin}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        closeModal={() => setShowForgotPasswordModal(false)}
        onOtpSuccess={handleOtpSuccess} // Make sure this is passed correctly
        setEmail={setEmail} // Pass setEmail to store the user's email
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        closeModal={() => setShowResetPasswordModal(false)}
        email={email} // Pass the user's email to the Reset Password Modal
      />
    </>
  );
};

// Router Configuration
const router = createBrowserRouter([
  { 
    path: "/", 
    element: <AppLayout />, 
    errorElement: <ErrorBoundary />, // Global error boundary
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/employer/*", element: <EmployerWrapper /> },
      { path: "/admin/*", element: <AdminWrapper /> },
      { path: "/candidate/*", element: <CandidateWrapper /> },
      { path: "/reset_password/:id", element: <ResetPasswordModal /> }, // Keep this route
      
      { path: "*", element: <div>Page Not Found</div> }
    ]
  }
]);

// App Component
function App() {
  return <RouterProvider router={router} />;
}

export default App;