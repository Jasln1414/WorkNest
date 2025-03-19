import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import OtpModal from './OTP'; // Adjust this path if needed
import ResetPasswordModal from './ResetPassword'; // Import the ResetPasswordModal component
import '../../Styles/Candidate/CandidateLogin.css';

function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }) {
  const [localEmail, setLocalEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const baseURL = "http://127.0.0.1:8000";
  
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = { email: localEmail };
    console.log("Sending payload:", payload);
    
    try {
      // Determine API endpoint based on user type (candidate or employer)
      const endpoint = "/api/account/forgot_pass/"; // Default to candidate endpoint
      const response = await axios.post(`${baseURL}${endpoint}`, payload);
      
      if (response.status === 200) {
        toast.success('OTP has been sent to your email.', { position: 'top-center' });
        setIsOtpModalOpen(true); // Show OTP modal
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.', { position: 'top-center' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOtpSuccess = () => {
    console.log("OTP verified successfully!");
    setIsOtpModalOpen(false); // Close the OTP modal
    setIsResetModalOpen(true); // Show the reset password modal
  };
  
  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
  };
  
  const closeResetModal = () => {
    setIsResetModalOpen(false);
  };
  
  const handlePasswordResetSuccess = () => {
    toast.success("Password reset successful! Please log in with your new password.");
    setIsResetModalOpen(false);
    // Return to login form
    if (typeof onBackToLogin === 'function') {
      onBackToLogin();
    } else {
      onClose(); // Fallback to just closing if onBackToLogin isn't provided
    }
  };
  
  const handleBackgroundClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={handleBackgroundClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>×</button>
        <h2>Forgot Password</h2>
        <p>Enter your email address and we'll send you an OTP to reset your password.</p>
        
        <form onSubmit={handleResetRequest}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? "Processing..." : "Send OTP"}
          </button>
        </form>
        
        {/* OTP Modal */}
        <OtpModal
          isOpen={isOtpModalOpen}
          closeModal={closeOtpModal}
          email={localEmail}
          onOtpSuccess={handleOtpSuccess}
        />
        
        {/* Reset Password Modal */}
        <ResetPasswordModal
          isOpen={isResetModalOpen}
          closeModal={closeResetModal}
          email={localEmail}
          onResetSuccess={handlePasswordResetSuccess}
        />
      </div>
    </div>
  );
}

export default ForgotPasswordModal;