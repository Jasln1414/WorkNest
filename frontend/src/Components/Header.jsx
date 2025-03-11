import React, { useState, useEffect, useRef } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navMenuRef = useRef(null); // Ref for the dropdown menu

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Functions to open and close modals
  const toggleLoginModal = (type) => {
    console.log(`Opening ${type} login modal`); // Debugging
    setModalType(type); // Set the type of modal (candidate or employer)
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening modal
  };

  const toggleSignupModal = (type) => {
    console.log(`Opening ${type} signup modal`); // Debugging
    setModalType(type); // Set the type of modal (candidate or employer)
    setIsSignupModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening modal
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setModalType(null); // Reset modalType when closing the modal
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
    setModalType(null); // Reset modalType when closing the modal
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logoimg} alt="WorkNest Logo" />
          <h1>WorkNest</h1>
        </div>

        {/* Hamburger menu for mobile */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Navigation - will be hidden on mobile unless menu is open */}
        <nav
          className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          ref={navMenuRef}
        >
          <button onClick={() => toggleLoginModal('candidate')}>CANDIDATE LOGIN</button>
          <button onClick={() => toggleLoginModal('employer')}>EMPLOYER LOGIN</button>
        </nav>
      </div>

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