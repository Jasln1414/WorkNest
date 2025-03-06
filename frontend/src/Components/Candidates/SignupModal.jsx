import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { SignupSchema, initialValues } from "../../validation/SignupValidation";
import OtpModal from "../Employer/OtpModal";
import "../../Styles/Login.css";

const CandidateSignupModal = ({ isOpen, onClose, switchToLogin }) => {
  const baseURL = "http://127.0.0.1:8000/";
  const [formError, setFormError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setEmail] = useState("");

  // If neither modal is open, return null
  if (!isOpen && !showOtpModal) return null;

  // Callback function for OTP success
  const handleOtpSuccess = () => {
    setShowOtpModal(false); // Close the OTP modal
    onClose(); // Close the signup modal
    switchToLogin(); // Switch to the login modal
  };

  const handleOnSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("full_name", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await axios.post(`${baseURL}api/account/cand_register/`, formData);

      if (response.status === 200) {
        toast.success("Registered successfully!", { position: "top-center" });
        setEmail(values.email); // Save the email for OTP verification
        setShowOtpModal(true); // Show the OTP modal
      } else {
        setFormError(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setFormError(error.response.data.message || "An error occurred during registration.");
      } else {
        setFormError("An error occurred during registration.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // If OTP modal is open, render OTP modal
  if (showOtpModal) {
    return (
      <OtpModal
        isOpen={showOtpModal}
        closeModal={() => setShowOtpModal(false)}
        email={email}
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
        <h2>Candidate Sign Up</h2>
        <Formik 
          initialValues={initialValues} 
          validationSchema={SignupSchema} 
          onSubmit={handleOnSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="input-group">
                <Field name="username" type="text" placeholder="Enter Your Name" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>

              <div className="input-group">
                <Field name="email" type="email" placeholder="example@gmail.com" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="input-group">
                <Field name="password" type="password" placeholder="Enter a password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="input-group">
                <Field name="confirm_password" type="password" placeholder="Confirm Password" />
                <ErrorMessage name="confirm_password" component="div" className="error-message" />
              </div>

              {formError && <div className="error-message">{formError}</div>}

              <div className="button-group">
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  Send OTP
                </button>
              </div>

              <div className="text-gray-700">
                <button type="button" onClick={switchToLogin}>
                  BACK TO LOGIN
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CandidateSignupModal;