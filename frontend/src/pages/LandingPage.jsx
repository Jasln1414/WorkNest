import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import hero from "../assets/hero.jpg";
import logo from "../assets/logo.jpg";
import "../Styles/LandingPage.css";

const LandingPage = () => {
  return (
    <div>
      <div className="container">
        <div className="Post-job">
          <img src={logo} alt="Find Job" />
          <Link to="/candidate/find-job">
          <button>FIND JOB</button>
          </Link>
        </div>
       
        <div className="Post-job">
          <img src={hero} alt="Post Job" />
          {/* Use Link to navigate to the PostJob page */}
          <Link to="/employer/PostJob">
            <button>POST JOB</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
