import React, { useState } from "react";
import { EmployerSignupApi } from "../../Api/Employer_Api/Employer_Auth_Api";
import OtpModal from "./OtpModal";
import "../../Styles/Login.css";

const EmployerSignupModal = ({ isOpen, onClose, switchToLogin }) => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  // If neither modal is open, return null
  if (!isOpen && !isOTPModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", companyName);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await EmployerSignupApi(formData);

      if (response.success) {
        localStorage.setItem("email", email); // Store email in localStorage
        setOtpEmail(email);
        setIsOTPModalOpen(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleOtpSuccess = () => {
    setIsOTPModalOpen(false);
    onClose();
    switchToLogin();
  };

  // If OTP modal is open, render OTP modal
  if (isOTPModalOpen) {
    return (
      <OtpModal
        isOpen={isOTPModalOpen}
        closeModal={() => setIsOTPModalOpen(false)}
        email={otpEmail}
        onOtpSuccess={handleOtpSuccess}
      />
    );
  }

  // Otherwise, render signup modal
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>
          ×
        </button>

        <h2>Employer Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Sign Up
            </button>
          </div>

          <div className="text-gray-700">
            <button type="button" onClick={switchToLogin}>
              BACK TO LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerSignupModal;