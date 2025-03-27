import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import hero from "../assets/hero.jpg";
import logo from "../assets/logo.jpg";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for menu and close
import Swal from "sweetalert2"; // Import SweetAlert2
import "../Styles/LandingPage.css";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage dropdown visibility
  const [isCandidateLoggedIn, setIsCandidateLoggedIn] = useState(false); // State to manage candidate login status
  const [isEmployerLoggedIn, setIsEmployerLoggedIn] = useState(false); // State to manage employer login status
  const navigate = useNavigate(); // Hook for navigation

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu state
  };

  const handleFindJobClick = () => {
    if (isCandidateLoggedIn) {
      navigate("/candidate/find-job"); // Navigate to find job page if logged in
    } else {
      // Show SweetAlert2 modal if not logged in
      Swal.fire({
        title: "Please Login",
        text: "You need to log in as a candidate to find jobs.",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/candidate/login"); // Navigate to candidate login page
        }
      });
    }
  };

  const handlePostJobClick = () => {
    if (isEmployerLoggedIn) {
      navigate("/employer/PostJob"); // Navigate to post job page if logged in
    } else {
      // Show SweetAlert2 modal if not logged in
      Swal.fire({
        title: "Please Login",
        text: "You need to log in as an employer to post jobs.",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/employer/login"); // Navigate to employer login page
        }
      });
    }
  };

  return (
    <div>
      {/* Menu Icon for Small Screens */}
      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />} {/* Toggle between menu and close icon */}
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          <Link to="/candidate/login" onClick={toggleMenu}>
            <button>Candidate Login</button>
          </Link>
          <Link to="/employer/login" onClick={toggleMenu}>
            <button>Employer Login</button>
          </Link>
        </div>
      )}

      {/* Main Content */}
      <div className="container-land">
        <div className="Post-job">
          <img src={logo} alt="Find Job" />
          <button onClick={handleFindJobClick}>FIND JOly</button>
        </div>

        <div className="Post-job">
          <img src={hero} alt="Post Job" />
          <button onClick={handlePostJobClick}>POST JOB</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;