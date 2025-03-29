import React, { useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PostJobValidationSchema } from '../../validation/PostJobValidation';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../../pages/comon/common.css';

function JobDetailModal({ setModal, jobData }) {
  const baseURL = 'http://127.0.0.1:8000/';
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setModal(false);
    }
  };

  const handleSubmit = async (values) => {
    const lpa = `${values.saleryfrom}-${values.saleryto}`;
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('location', values.location);
    formData.append('lpa', lpa);
    formData.append('applyBefore', values.applyBefore);
    formData.append('experiance', values.experiance);
    formData.append('jobmode', values.jobmode);
    formData.append('jobtype', values.jobtype);
    formData.append('about', values.about);
    formData.append('responsibility', values.responsibility);
    formData.append('jobId', jobData.id);

    try {
      const response = await axios.post(baseURL + 'api/empjob/editJob/', formData);
      if (response.status === 200) {
        toast.success('Job edited!', {
          position: 'top-center',
        });
        setModal(false);
      } else {
        toast.error('Something went wrong. Try again later!', {
          position: 'top-center',
        });
        setModal(false);
      }
    } catch (error) {
      console.error('Error editing job:', error);
    }
  };

  let [salaryFrom, salaryTo] = jobData.lpa.split('-');
  const initialValue = {
    title: jobData.title,
    location: jobData.location,
    saleryfrom: salaryFrom,
    saleryto: salaryTo,
    applyBefore: jobData.applyBefore,
    experience: jobData.experience,
    jobmode: jobData.jobmode,
    jobtype: jobData.jobtype,
    about: jobData.about,
    responsibility: jobData.responsibility,
  };

  return (
    <div 
      ref={modalRef} 
      onClick={closeModal} 
      className="modal-overlay"
    >
      <div className="modal-container">
        <button 
          className="modal-close-button" 
          onClick={() => setModal(false)}
        >
          <IoMdClose size={30} />
        </button>
        
        <div className="modal-content">
          <h2 className="modal-title">Edit Job Details</h2>
          
          <Formik
            initialValues={initialValue}
            validationSchema={PostJobValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="modal-form">
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">Title</label>
                      <Field
                        type="text"
                        id="title"
                        name="title"
                        className={`form-input ${errors.title && touched.title ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="title" component="div" className="error-message" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="location" className="form-label">Location</label>
                      <Field
                        type="text"
                        id="location"
                        name="location"
                        className={`form-input ${errors.location && touched.location ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="location" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="saleryfrom" className="form-label">Salary From</label>
                      <Field
                        type="text"
                        id="saleryfrom"
                        name="saleryfrom"
                        className={`form-input ${errors.saleryfrom && touched.saleryfrom ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="saleryfrom" component="div" className="error-message" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="saleryto" className="form-label">Salary To</label>
                      <Field
                        type="text"
                        id="saleryto"
                        name="saleryto"
                        className={`form-input ${errors.saleryto && touched.saleryto ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="saleryto" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="jobtype" className="form-label">Job Type</label>
                      <Field
                        as="select"
                        id="jobtype"
                        name="jobtype"
                        className={`form-input ${errors.jobtype && touched.jobtype ? 'input-error' : ''}`}
                      >
                        <option value="">Select</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                      </Field>
                      <ErrorMessage name="jobtype" component="div" className="error-message" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="jobmode" className="form-label">Job Mode</label>
                      <Field
                        as="select"
                        id="jobmode"
                        name="jobmode"
                        className={`form-input ${errors.jobmode && touched.jobmode ? 'input-error' : ''}`}
                      >
                        <option value="">Select</option>
                        <option value="Remote">Remote</option>
                        <option value="On Site">On Site</option>
                        <option value="Hybrid">Hybrid</option>
                      </Field>
                      <ErrorMessage name="jobmode" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="experiance" className="form-label">Experience</label>
                      <Field
                        as="select"
                        id="experiance"
                        name="experiance"
                        className={`form-input ${errors.experience && touched.experiance ? 'input-error' : ''}`}
                      >
                        <option value="">Select</option>
                        <option value="Internship">Internship</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Associate">Associate</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                      </Field>
                      <ErrorMessage name="experiance" component="div" className="error-message" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="applyBefore" className="form-label">Apply Before</label>
                      <Field
                        type="date"
                        id="applyBefore"
                        name="applyBefore"
                        className={`form-input ${errors.applyBefore && touched.applyBefore ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="applyBefore" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="about" className="form-label">About</label>
                    <Field
                      as="textarea"
                      id="about"
                      name="about"
                      rows="4"
                      className={`form-textarea ${errors.about && touched.about ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="about" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="responsibility" className="form-label">Responsibility</label>
                    <Field
                      as="textarea"
                      id="responsibility"
                      name="responsibility"
                      rows="4"
                      className={`form-textarea ${errors.responsibility && touched.responsibility ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="responsibility" component="div" className="error-message" />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-button"
                  >
                    Update Job
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

export default JobDetailModal;