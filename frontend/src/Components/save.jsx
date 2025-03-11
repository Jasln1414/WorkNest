import React, { useState } from "react";
import CandidateLoginModal from "./Candidates/LoginModal";
import CandidateSignupModal from "./Candidates/SignupModal";
import EmployerLoginModal from "./Employer/LoginModal";
import EmployerSignupModal from "./Employer/SignupModal";
import logoimg from '../assets/logoimg.jpg';
import '../Styles/Header.css';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'candidate' or 'employer'

  // Functions to open and close modals
  const toggleLoginModal = (type) => {
    console.log(`Opening ${type} login modal`); // Debugging
    setModalType(type); // Set the type of modal (candidate or employer)
    setIsLoginModalOpen(true);
  };

  const toggleSignupModal = (type) => {
    console.log(`Opening ${type} signup modal`); // Debugging
    setModalType(type); // Set the type of modal (candidate or employer)
    setIsSignupModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setModalType(null); // Reset modalType when closing the modal
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
    setModalType(null); // Reset modalType when closing the modal
  };

  return (
    <header>
      <div className="logo">
        <img src={logoimg} alt="WorkNest Logo" />
        <h1>WorkNest</h1>
      </div>

      <nav>
        <button onClick={() => toggleLoginModal('candidate')}>CANDIDATE LOGIN</button>
        <button onClick={() => toggleLoginModal('employer')}>EMPLOYER LOGIN</button>
      </nav>

      {/* Conditional Login Modal */}
      {modalType === 'candidate' ? (
        <CandidateLoginModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          switchToSignup={() => {
            closeLoginModal();
            toggleSignupModal('candidate');
          }}
        />
      ) : modalType === 'employer' ? (
        <EmployerLoginModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          switchToSignup={() => {
            closeLoginModal();
            toggleSignupModal('employer');
          }}
        />
      ) : null}

      {/* Conditional Signup Modal */}
      {modalType === 'candidate' ? (
        <CandidateSignupModal
          isOpen={isSignupModalOpen}
          onClose={closeSignupModal}
          switchToLogin={() => {
            closeSignupModal();
            toggleLoginModal('candidate');
          }}
        />
      ) : modalType === 'employer' ? (
        <EmployerSignupModal
          isOpen={isSignupModalOpen}
          onClose={closeSignupModal}
          switchToLogin={() => {
            closeSignupModal();
            toggleLoginModal('employer');
          }}
        />
      ) : null}
    </header>
  );
};

export default Header;