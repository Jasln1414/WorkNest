import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { set_Authentication } from "../../Redux/Authentication/authenticationSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../../Styles/Login.css";
import { EmployerLoginApi } from "../../Api/Employer_Api/Employer_Auth_Api";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ForgotPasswordPage from "../../pages/comon/ForgotPassword";

const LoginModal = ({ isOpen, onClose, switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBackToLogin = () => {
    setShowForgotPasswordModal(false);
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

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

      // Check if the employer is verified
      if (!response.data.is_verified) {
        // Show SweetAlert2 message if the employer is not verified
        Swal.fire({
          icon: 'warning',
          title: 'Account Not Verified',
          text: 'Your account is not verified by the admin. Please wait for verification.',
          confirmButtonText: 'OK',
        });

        // Clear the form fields
        setEmail("");
        setPassword("");
        return; // Stop further execution
      }

      // Debugging: Log the user_data.completed value
      console.log("User data completed:", response.data?.user_data?.completed);

      // If the employer is verified, proceed with login
      toast.success("Login successful!");

      // Add an extra layer of protection with optional chaining
      if (response.data?.user_data?.completed === false) {
        navigate('/employer/profile_creation/');
      } else {
        navigate('/employer/EmpHome/');
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

  const GoogleTestlogin = async (userDetails) => {
    console.log("userDetails after login", userDetails);
    const formData = {
      client_id: userDetails,
    };
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/account/auth/employer/', formData);
      console.log("auth response ", response);

      if (response.status === 200) {
        localStorage.setItem('access', response.data.access_token);
        localStorage.setItem('refresh', response.data.refresh_token);

        dispatch(
          set_Authentication({
            name: jwtDecode(response.data.access_token).name,
            email: response.data.email,
            isAuthenticated: true,
            isAdmin: response.data.isAdmin,
            usertype: response.data.usertype,
          })
        );

        toast.success('Login successful!', {
          position: "top-center",
        });

        // Debugging: Log the user_data.completed value
        console.log("User data completed:", response.data?.user_data?.completed);

        // Add an extra layer of protection with optional chaining
        if (response.data?.user_data?.completed === false) {
          navigate('/employer/profile_creation/');
        } else {
          navigate('/employer/EmpHome/');
        }
      } else {
        console.log("response...............................", response);
        setFormError(response.data.message);
      }
    } catch (error) {
      console.error("Google login error:", error.response?.data || error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.detail || 'You have to be approved by admin.',
      });
    }
  };

  if (!isOpen) return null;
  
  if (showForgotPasswordModal) {
    return (
      <ForgotPasswordPage
        isOpen={true} 
        onClose={() => setShowForgotPasswordModal(false)}
        onBackToLogin={handleBackToLogin}
        userType="employer"  // Add this line to specify user type
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>
          ×
        </button>

        <h2>Employer Sign In</h2>

        {formError && <div className="error-message">{formError}</div>}

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

          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <div className="text-right mt-1">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                openForgotPasswordModal();
              }}
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <br></br>
          <div className="text-gray-700">
           
            <button type="button" onClick={switchToSignup}>
              Don't have an account?{" "} Sign Up
            </button>
          </div>

          <div className='flex justify-center'>
            <GoogleLogin
              onSuccess={credentialResponse => {
                GoogleTestlogin(credentialResponse.credential);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;