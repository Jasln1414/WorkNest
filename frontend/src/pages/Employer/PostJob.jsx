import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Qmodal from '../../Components/Employer/utilities/Qmodal';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import Swal from 'sweetalert2';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PostJobValidationSchema, initialValue } from '../../validation/PostJobValidation';
import '../../Styles/SideBar.css';
import '../../Styles/PostJob.css';

function PostJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const baseURL = 'http://127.0.0.1:8000/';
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(['']);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [submitFunction, setSubmitFunction] = useState(null);

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
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
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
    
    questions.forEach((question, index) => {
      if (question.trim() !== '') {
        formData.append(`questions[${index}]`, question);
      }
    });

    try {
      const response = await axios.post(`${baseURL}api/empjob/postjob/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        swalWithBootstrapButtons.fire({
          title: 'Posted!',
          text: 'Your job has been posted successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          resetForm();
          setQuestions(['']);
          navigate('/employer/Emphome');
        });
      }
    } catch (error) {
      console.error('Error from backend:', error);
      swalWithBootstrapButtons.fire({
        title: 'Error!',
        text: 'Failed to post job. Please try again.',
        icon: 'error',
      });
    }
  };

  const promptForQuestions = (values, actions) => {
    const submitForm = () => {
      handleSubmit(values, actions);
    };
    setSubmitFunction(() => submitForm);

    swalWithBootstrapButtons.fire({
      title: "Add Screening Questions?",
      text: "Would you like to add screening questions for applicants?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, add questions",
      cancelButtonText: "No, post without questions",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setShowQuestionModal(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        submitForm();
      }
    });
  };

  return (
    <div className="post-job-container">
      {/* Sidebar/Drawer */}
      <div>
        {isSmallScreen ? (
          <>
            <button onClick={toggleDrawer} title="Add New" className="drawer-toggle-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"
                className="drawer-icon">
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  strokeWidth="1.5"
                ></path>
                <path d="M8 12H16" strokeWidth="1.5"></path>
                <path d="M12 16V8" strokeWidth="1.5"></path>
              </svg>
            </button>

            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction='left'
              className='drawer'
            >
              <div className='drawer-content'><SideBar /></div>
            </Drawer>
          </>
        ) : (
          <SideBar />
        )}
      </div>

      {/* Main Content */}
      <div className="post-job-content">
        {showQuestionModal && (
          <Qmodal 
            setModal={setShowQuestionModal} 
            setQuestions={setQuestions} 
            questions={questions}
            handleformSubmit={submitFunction}
          />
        )}

        <div className="post-job-form-container">
          <div className="post-job-form-wrapper">
            <h1>Post A Job</h1>
            
            <Formik
              initialValues={initialValue}
              validationSchema={PostJobValidationSchema}
              onSubmit={(values, actions) => {
                promptForQuestions(values, actions);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="post-job-form">
                  <div className="form-fields-container">
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

                    {/* About & Responsibility */}
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
                  </div>

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