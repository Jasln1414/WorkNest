import React from 'react';
import logoimg from '../assets/logoimg.jpg'; // Import the logo image
import '../styles/Footer.css'; // Link the external CSS

function Footer() {
  return (
    <footer className="footer">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>For Jobseekers</h4>
            <ul>
              <li><a href="#">Search Jobs</a></li>
              <li><a href="#">Register</a></li>
              <li><a href="#">Job Alerts</a></li>
              <li><a href="#">Career Advice</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Popular</h4>
            <ul>
              <li><a href="#">Search Jobs</a></li>
              <li><a href="#">Employers</a></li>
              <li><a href="#">Agencies</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Recruiters</h4>
            <ul>
              <li><a href="#">CV Database Access</a></li>
              <li><a href="#">Advertise Jobs</a></li>
              <li><a href="#">Search CVs</a></li>
              <li><a href="#">Test CV Search</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>About the Creation</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Help</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo">
            <img src={logoimg} alt="Logo" className="logo" />
            <p>WorkNest</p>
          </div>
          <p>&copy; 2025| All Rights Reserved.</p>
          <p>Created by Jaseela Noushad</p>
        </div>
    </footer>
  );
}

export default Footer;
