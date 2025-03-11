import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { set_Authentication } from "../../Redux/Authentication/authenticationSlice";
import { toast } from "react-toastify";
import "../../Styles/Login.css";
import { EmployerLoginApi } from "../../Api/Employer_Api/Employer_Auth_Api";

const LoginModal = ({ isOpen, onClose, switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setFormError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await EmployerLoginApi(formData, dispatch, set_Authentication, navigate);
      
      // If the API call fails, this will throw an error
      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      // Handle different types of errors
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "An unexpected error occurred";
      
      // Set form error to display to user
      setFormError(errorMessage);
      
      // Clear the form fields
      setEmail("");
      setPassword("");
     
    } finally {
      // Always reset submitting state
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot");
  };

  const handleClearForm = () => {
    setEmail("");
    setPassword("");
    setFormError("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>
          ×
        </button>

        <h2>Employer Sign In</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email id"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError(""); // Clear error when user starts typing
              }}
              required
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError(""); // Clear error when user starts typing
              }}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

         {/* <span 
            className="forgot-password" 
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </span>*/}

        

          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <div className="text-gray-700">
            <button type="button" onClick={switchToSignup}>
              Sign Up
            </button>
            Don't have an account?{" "}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;