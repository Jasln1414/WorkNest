import React, { useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EmployerWrapper from "./pages/Employer/EmployWrapper";
import Footer from "./Components/Footer";
import { ToastContainer } from "react-toastify";
import Header from "./Components/Header";
import LoginModal from "./Components/Employer/LoginModal";
import SignupModal from "./Components/Employer/SignupModal";
import ForgotPassword from "./Components/Employer/ForgotPassword";
import AdminWrapper from "./Components/admin/AdminWrapper";

import CandidateWrapper from './pages/Cndidates/CandidateWrapper'
import SidebarCandidate from "./Components/Candidates/CandidateSideBar";
import './validation/App.css'

const ConditionalHeader = ({ children }) => {
  const location = useLocation();
  
  return (
    <>
      {location.pathname === '/' && <Header />}
      {children}
    </>
  );
};
console.log('Rendering App component'); // Add this to App.jsx
const AppLayout = () => {
  console.log("AppLayout rendered");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

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

  return (
    <>
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
      />

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
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/employer/*",
        element: <EmployerWrapper />,
      },
     {
       path:'admin/*', element:<AdminWrapper/>
      
    },
      
      
      {
        path: "/candidate/*",
        element: <CandidateWrapper />,
      },
      
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "*",
        element: <div>Page Not Found</div>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}


export default App;