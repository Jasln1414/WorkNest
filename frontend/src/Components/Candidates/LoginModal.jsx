import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { set_Authentication } from "../../Redux/Authentication/authenticationSlice";
import { set_user_basic_details } from "../../Redux/UserDetails/userBasicDetailsSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { LoginSchema, initialValues } from "../../validation/LoginValidation";
import "../../Styles/Candidate/CandidateLogin.css";
import { GoogleLogin } from '@react-oauth/google';
import ForgotPasswordPage from "../../pages/comon/ForgotPassword";


function CandidateLogin({ isOpen, onClose, switchToSignup }) {
  const [formError, setFormError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = "http://127.0.0.1:8000";

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await axios.post(`${baseURL}/api/account/candidatelogin/`, formData);
      console.log("Login Response:", response);

      if (response.status === 200) {
        // Save tokens to localStorage
        localStorage.setItem("access", response.data.access_token);
        localStorage.setItem("refresh", response.data.refresh_token);

        // Decode the token
        const decodedToken = jwtDecode(response.data.access_token);

        // Update Redux store
        dispatch(
          set_Authentication({
            name: decodedToken.name,
            email: response.data.email,
            isAuthenticated: true,
            isAdmin: response.data.isAdmin,
            usertype: response.data.usertype,
          })
        );

        dispatch(
          set_user_basic_details({
            profile_pic: response.data.user_data.profile_pic,
            user_type_id: response.data.user_data.id,
          })
        );

        // Show success toast
        toast.success("Login successful!", {
          position: "top-center",
        });

        // Close the modal
        onClose();

        // Navigate based on profile completion status
        if (response.data.user_data.completed === false) {
          navigate("/candidate/profile-creation");
        } else {
          navigate("/candidate/find-job");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setFormError(error.response?.data?.message || "Login failed. Please try again.");
      toast.error("Login failed. Please check your credentials.", {
        position: "top-center",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPasswordModal(false);
  };

  const handleBackgroundClick = (e) => {
    if (e.target.className === "candidate-login-overlay") {
      onClose();
    }
  };

  if (!isOpen) return null;
  
  // If forgot password modal is open, render the ForgotPasswordPage component
  if (showForgotPasswordModal) {
    return (
      <ForgotPasswordPage
        isOpen={true} 
        onClose={() => setShowForgotPasswordModal(false)}
        onBackToLogin={handleBackToLogin}
        userType="candidate"  // Add this line to specify user type
      />
    );
  }

  const GoogleTestlogin = async (userDetails) => {
    console.log("userDetails after login", userDetails);
    const formData = {
      client_id: userDetails,
    };
    try {
      const response = await axios.post(baseURL + '/api/account/auth/candidate/', formData);
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
        dispatch(
          set_user_basic_details({
            profile_pic: response.data.user_data.profile_pic,
            user_type_id: response.data.user_data.id,
          })
        );
        toast.success('Login successful!', {
          position: "top-center",
        });
        if (response.data.user_data.completed === false) {
          navigate("/candidate/profile-creation");
        } else {
          navigate("/candidate/find-job");
        }
      } else {
        console.log("response...............................", response);
        setFormError(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="candidate-login-overlay" onClick={handleBackgroundClick}>
      <div className="candidate-login-content" onClick={(e) => e.stopPropagation()}>
        <button className="candidate-login-close-icon" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="candidate-login-form">
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleLoginSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <h3 className="candidate-login-title">Candidate Sign In</h3>
                <div className="candidate-form-group">
                  <label htmlFor="email" className="candidate-sr-only">Email</label>
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email id"
                    className={`candidate-form-input ${errors.email && touched.email ? "candidate-input-error" : ""}`}
                    disabled={isSubmitting}
                    aria-label="Email"
                  />
                  <ErrorMessage name="email" component="div" className="candidate-error-message" />
                </div>
                <div className="candidate-form-group">
                  <label htmlFor="password" className="candidate-sr-only">Password</label>
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className={`candidate-form-input ${errors.password && touched.password ? "candidate-input-error" : ""}`}
                    disabled={isSubmitting}
                    aria-label="Password"
                  />
                  <ErrorMessage name="password" component="div" className="candidate-error-message" />
                  {/* Forgot Password Link - added to the right side */}
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
                </div>
                {formError && <div className="candidate-form-error">{formError}</div>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="candidate-submit-button"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>

                {/* Sign Up and Google Login Section */}
                <div className="candidate-signup-text">
                  <button type="button" onClick={switchToSignup}>
                    Don't have an account? Sign Up
                  </button>
                  <br />
                  <br />
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={credentialResponse => {
                        GoogleTestlogin(credentialResponse.credential);
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CandidateLogin;