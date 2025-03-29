import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './common.css';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password should be minimum 8 characters')
    .matches(/[A-Z]/, 'Password should have at least one uppercase')
    .matches(/[a-z]/, 'Password should have at least one lowercase')
    .matches(/[0-9]/, 'Password should have at least one number')
    .matches(/[!@#$%^&*]/, 'Password should have at least one special character')
    .required('Required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required')
});

const initialValues = {
  password: "",
  confirm_password: ""
};

function PasswordResetModal({ isOpen, closeModal, email, onResetSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseURL = "http://127.0.0.1:8000";
  
  const handleResetPassword = async (values, { setSubmitting }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${baseURL}/api/account/reset_password/`, {
        email,
        password: values.password
      });
      
      if (response.status === 200) {
        if (typeof onResetSuccess === 'function') {
          onResetSuccess();
        } else {
          toast.success("Password reset successfully!", { toastId: "reset-success" });
          closeModal();
        }
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(
        error.response?.data?.message || "Error resetting password. Please try again.",
        { toastId: "reset-error" }
      );
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };
  
  const handleBackgroundClick = (e) => {
    if (e.target.className === "password-reset-overlay") {
      closeModal();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="password-reset-overlay" onClick={handleBackgroundClick}>
      <div className="password-reset-content" onClick={(e) => e.stopPropagation()}>
        <button className="password-reset-close" onClick={closeModal}>×</button>
        <h2 className="password-reset-title">Reset Password</h2>
        <p className="password-reset-text">Enter your new password below.</p>
        
        <Formik
          initialValues={initialValues}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleResetPassword}
        >
          {({ errors, touched, isSubmitting: formikSubmitting }) => (
            <Form className="password-reset-form">
              <div className="password-reset-form-group">
                <label htmlFor="password" className="password-reset-label">New Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  className={`password-reset-input ${errors.password && touched.password ? "password-reset-input-error" : ""}`}
                  disabled={isSubmitting || formikSubmitting}
                />
                <ErrorMessage name="password" component="div" className="password-reset-error" />
              </div>
              
              <div className="password-reset-form-group">
                <label htmlFor="confirm_password" className="password-reset-label">Confirm Password</label>
                <Field
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="Confirm new password"
                  className={`password-reset-input ${errors.confirm_password && touched.confirm_password ? "password-reset-input-error" : ""}`}
                  disabled={isSubmitting || formikSubmitting}
                />
                <ErrorMessage name="confirm_password" component="div" className="password-reset-error" />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting || formikSubmitting} 
                className="password-reset-submit"
              >
                {isSubmitting || formikSubmitting ? "Processing..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default PasswordResetModal;