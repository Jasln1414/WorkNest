import React, { useState } from "react";
import { EmployerSignupApi } from "../../Api/Employer_Api/Employer_Auth_Api";
import OtpModal from "./OtpModal";
import "../../Styles/Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { SignupSchema, initialValues } from "../../validation/SignupValidation";

const EmployerSignupModal = ({ isOpen, onClose, switchToLogin }) => {
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  // If neither modal is open, return null
  if (!isOpen && !isOTPModalOpen) return null;

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("full_name", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await EmployerSignupApi(formData);

      if (response.success) {
        localStorage.setItem("email", values.email); // Store email in localStorage
        setOtpEmail(values.email);
        setIsOTPModalOpen(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setSubmitting(false);
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

        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="input-group">
                <Field
                  type="text"
                  name="username"
                  placeholder="Enter Company Name"
                  className={errors.username && touched.username ? "error-input" : ""}
                />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>

              <div className="input-group">
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email id"
                  className={errors.email && touched.email ? "error-input" : ""}
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="input-group">
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className={errors.password && touched.password ? "error-input" : ""}
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="input-group">
                <Field
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm your password"
                  className={errors.confirm_password && touched.confirm_password ? "error-input" : ""}
                />
                <ErrorMessage name="confirm_password" component="div" className="error-message" />
              </div>

              <div className="button-group">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
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

export default EmployerSignupModal;