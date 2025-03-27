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
import '../../Components/Employer/utilities/Qmodal.css';

function PostJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questions, setQuestions] = useState([{ text: '', question_type: 'TEXT', options: null }]);
  const baseURL = 'http://127.0.0.1:8000/';
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  const toggleDrawer = () => setIsOpen(!isOpen);
  const handleResize = () => setIsSmallScreen(window.innerWidth < 768);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (values) => {
    const formattedQuestions = questions
      .filter(q => q.text.trim() !== '')
      .map(q => ({
        text: q.text,
        question_type: q.question_type,
        ...(q.question_type === 'MCQ' && q.options ? { options: q.options } : {})
      }));

    const formData = {
      ...values,
      lpa: `${values.saleryfrom}-${values.saleryto}`,
      questions: formattedQuestions
    };

    try {
      const response = await axios.post(`${baseURL}api/empjob/postjob/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Job posted successfully',
          icon: 'success'
        }).then(() => {
          navigate('/employer/Emphome');
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to post job',
        icon: 'error'
      });
    }
  };

  return (
    <div className="post-job-container">
      {/* Sidebar/Drawer */}
      {isSmallScreen ? (
        <>
          <button onClick={toggleDrawer} className="drawer-toggle-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <Drawer open={isOpen} onClose={toggleDrawer} direction="left" className="drawer">
            <SideBar />
          </Drawer>
        </>
      ) : (
        <SideBar />
      )}

      <div className="post-job-content">
        {showQuestionModal && (
          <Qmodal 
            setModal={setShowQuestionModal} 
            questions={questions} 
            setQuestions={setQuestions}
          />
        )}

        <div className="post-job-form-wrapper">
          <h1>Post A Job</h1>
          
          <Formik
            initialValues={initialValue}
            validationSchema={PostJobValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="post-job-form">
                <div className="form-grid">
                  {/* Job Title */}
                  <div className="input-group">
                    <Field name="title" placeholder=" " />
                    <label>Job Title</label>
                    <ErrorMessage name="title" component="div" className="error-message" />
                  </div>

                  {/* Location */}
                  <div className="input-group">
                    <Field name="location" placeholder=" " />
                    <label>Location</label>
                    <ErrorMessage name="location" component="div" className="error-message" />
                  </div>

                  {/* Salary Range */}
                  <div className="input-group">
                    <Field name="saleryfrom" type="number" placeholder=" " />
                    <label>Salary From (LPA)</label>
                    <ErrorMessage name="saleryfrom" component="div" className="error-message" />
                  </div>
                  
                  <div className="input-group">
                    <Field name="saleryto" type="number" placeholder=" " />
                    <label>Salary To (LPA)</label>
                    <ErrorMessage name="saleryto" component="div" className="error-message" />
                  </div>

                  {/* Job Type */}
                  <div className="input-group">
                    <Field as="select" name="jobtype">
                      <option value="">Select Job Type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                    </Field>
                    <label>Job Type</label>
                    <ErrorMessage name="jobtype" component="div" className="error-message" />
                  </div>

                  {/* Job Mode */}
                  <div className="input-group">
                    <Field as="select" name="jobmode">
                      <option value="">Select Job Mode</option>
                      <option value="Remote">Remote</option>
                      <option value="On Site">On Site</option>
                      <option value="Hybrid">Hybrid</option>
                    </Field>
                    <label>Job Mode</label>
                    <ErrorMessage name="jobmode" component="div" className="error-message" />
                  </div>

                  {/* Experience */}
                  <div className="input-group">
                    <Field as="select" name="experience">
                      <option value="">Select Experience</option>
                      <option value="Internship">Internship</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Associate">Associate</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                    </Field>
                    <label>Experience</label>
                    <ErrorMessage name="experience" component="div" className="error-message" />
                  </div>

                  {/* Apply Before */}
                  <div className="input-group">
                    <Field type="date" name="applyBefore" />
                    <label>Apply Before</label>
                    <ErrorMessage name="applyBefore" component="div" className="error-message" />
                  </div>
                </div>

                {/* About & Responsibility */}
                <div className="text-area-group">
                  <div className="input-group">
                    <Field as="textarea" name="about" rows="4" placeholder=" " />
                    <label>About the Job</label>
                    <ErrorMessage name="about" component="div" className="error-message" />
                  </div>
                  
                  <div className="input-group">
                    <Field as="textarea" name="responsibility" rows="4" placeholder=" " />
                    <label>Responsibilities</label>
                    <ErrorMessage name="responsibility" component="div" className="error-message" />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="questions-section">
                  <button 
                    type="button" 
                    onClick={() => setShowQuestionModal(true)}
                    className="add-questions-button"
                  >
                    Add Screening Questions
                  </button>
                  {questions.some(q => q.text.trim()) && (
                    <p className="questions-count">
                      {questions.filter(q => q.text.trim()).length} question(s) added
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default PostJob;