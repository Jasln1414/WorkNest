import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import Swal from 'sweetalert2';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import '../../Styles/SideBar.css';
import '../../Styles/PostJob.css';
import { PostJobValidationSchema } from '../../validation/PostJobValidation';
import DashboardIcon from './DashBoard';

// Define initialValues
const initialValues = {
  title: '',
  location: '',
  jobtype: '',
  jobmode: '',
  experience: '',
  applyBefore: '',
  about: '',
  responsibility: '',
  saleryfrom: '',
  saleryto: '',
};



function PostJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const baseURL = 'http://127.0.0.1:8000/';
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'confirm-button',
      cancelButton: 'cancel-button',
    },
    buttonsStyling: false,
  });

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768); // Check for small screens
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial screen size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const lpa = `${values.saleryfrom}-${values.saleryto}`;
    const formData = new FormData();
    formData.append('title', values.title || '');
    formData.append('location', values.location || '');
    formData.append('lpa', lpa || '');
    formData.append('jobtype', values.jobtype || '');
    formData.append('jobmode', values.jobmode || '');
    formData.append('experience', values.experience || '');
    formData.append('applyBefore', values.applyBefore || '');
    formData.append('about', values.about || '');
    formData.append('responsibility', values.responsibility || '');

    try {
      const response = await axios.post(`${baseURL}api/empjob/postjob/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check for successful status (both 200 and 201 are success codes)
      if (response.status === 200 || response.status === 201) {
        swalWithBootstrapButtons.fire({
          title: 'Posted!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
            resetForm(); // Reset the form after successful submission
            navigate('/employer/Emphome'); // Redirect to emphome after successful submission
          }
        });
      }
    } catch (error) {
      console.error('Error from backend:', error);
      // Show error message to user
      swalWithBootstrapButtons.fire({
        title: 'Error!',
        text: 'Failed to post job. Please try again.',
        icon: 'error',
      });
    }
  };

  return (
    
      <div className="content-wrapper">
        {/* Sidebar */}
        {isSmallScreen ? (
          <>
            {/* Drawer Toggle Button 
            <button onClick={toggleDrawer} className="drawer-toggle-button">
              <DashboardIcon />
              <span>Dashboard</span>
            </button>*/}
    
            {/* Drawer for Mobile */}
            <Drawer open={isOpen} onClose={toggleDrawer} direction="left" className="drawer">
              <div className="drawer-content">
                <SideBar />
              </div>
            </Drawer>
          </>
        ) : (
          <SideBar />
        )}
    
        {/* Post Job Content */}
        <div className="post-job-content">
          <div className="post-job-form-container">
            <div className="post-job-form">
              <Formik
                initialValues={initialValues}
                validationSchema={PostJobValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <h1>Post A Job</h1>
                    <div className="form-grid">
                      {/* Job Title */}
                      <div className="input-group">
                        <Field className="input-field" placeholder=" " name="title" />
                        <label className="input-label">Job Title</label>
                        <ErrorMessage name="title" component="div" className="error-message" />
                      </div>
    
                      {/* Location */}
                      <div className="input-group">
                        <Field className="input-field" placeholder=" " name="location" />
                        <label className="input-label">Location</label>
                        <ErrorMessage name="location" component="div" className="error-message" />
                      </div>
    
                      {/* Salary From */}
                      <div className="input-group">
                        <Field className="input-field" placeholder=" " name="saleryfrom" type="number" />
                        <label className="input-label">Salary From</label>
                        <ErrorMessage name="saleryfrom" component="div" className="error-message" />
                      </div>
    
                      {/* Salary To */}
                      <div className="input-group">
                        <Field className="input-field" placeholder=" " name="saleryto" type="number" />
                        <label className="input-label">Salary To</label>
                        <ErrorMessage name="saleryto" component="div" className="error-message" />
                      </div>
    
                      {/* Job Type */}
                      <div className="input-group">
                        <Field as="select" name="jobtype" className="input-field">
                          <option value="">Select Job Type</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                        </Field>
                        <label className="input-label">Job Type</label>
                        <ErrorMessage name="jobtype" component="div" className="error-message" />
                      </div>
    
                      {/* Job Mode */}
                      <div className="input-group">
                        <Field as="select" name="jobmode" className="input-field">
                          <option value="">Select Job Mode</option>
                          <option value="Remote">Remote</option>
                          <option value="On Site">On Site</option>
                          <option value="Hybrid">Hybrid</option>
                        </Field>
                        <label className="input-label">Job Mode</label>
                        <ErrorMessage name="jobmode" component="div" className="error-message" />
                      </div>
    
                      {/* Experience */}
                      <div className="input-group">
                        <Field as="select" name="experience" className="input-field">
                          <option value="">Select Experience</option>
                          <option value="Internship">Internship</option>
                          <option value="Entry Level">Entry Level</option>
                          <option value="Associate">Associate</option>
                          <option value="Mid Level">Mid Level</option>
                          <option value="Senior Level">Senior Level</option>
                        </Field>
                        <label className="input-label">Experience</label>
                        <ErrorMessage name="experience" component="div" className="error-message" />
                      </div>
    
                      {/* Apply Before */}
                      <div className="input-group">
                        <Field type="date" name="applyBefore" className="input-field" />
                        <label className="input-label">Apply Before</label>
                        <ErrorMessage name="applyBefore" component="div" className="error-message" />
                      </div>
                    </div>
    
                    {/* About & Responsibility - Side by Side */}
                    <div className="two-column-grid">
                      {/* About */}
                      <div className="input-group">
                        <Field as="textarea" className="textarea-field" name="about" rows="4" />
                        <label className="input-label">About</label>
                        <ErrorMessage name="about" component="div" className="error-message" />
                      </div>
    
                      {/* Responsibility */}
                      <div className="input-group">
                        <Field as="textarea" className="textarea-field" name="responsibility" rows="4" />
                        <label className="input-label">Responsibility</label>
                        <ErrorMessage name="responsibility" component="div" className="error-message" />
                      </div>
                    </div>
    
                    {/* Submit Button */}
                    <div className="submit-button-container">
                      <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
  
}

export default PostJob;