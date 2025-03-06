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

function CandidateLogin({ isOpen, onClose, switchToSignup }) {
  const [formError, setFormError] = useState("");
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

  if (!isOpen) return null;

  return (
    <div className="candidate-login-overlay" onClick={onClose}>
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
                </div>
                {formError && <div className="candidate-form-error">{formError}</div>}
                <div className="candidate-forgot-password">
                  <button
                    type="button"
                    className="candidate-forgot-password-button"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="candidate-submit-button"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
                <div className="candidate-signup-text">
                  <button type="button" onClick={switchToSignup}>
                    Don't have an account? Sign Up
                  </button>
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