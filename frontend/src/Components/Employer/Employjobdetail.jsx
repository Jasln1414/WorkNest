import React, { useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PostJobValidationSchema } from '../../validation/PostJobValidation';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../../pages/comon/common.css';

function JobDetailModal({ setModal, jobData, onUpdate }) {
  const baseURL = 'http://127.0.0.1:8000/';
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setModal(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const lpa = `${values.saleryfrom}-${values.saleryto}`;
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('location', values.location);
      formData.append('lpa', lpa);
      formData.append('applyBefore', values.applyBefore);
      formData.append('experience', values.experience);
      formData.append('jobmode', values.jobmode);
      formData.append('jobtype', values.jobtype);
      formData.append('about', values.about);
      formData.append('responsibility', values.responsibility);
      formData.append('jobId', jobData.id);

      const response = await axios.post(baseURL + 'api/empjob/editJob/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        toast.success('Job updated successfully!', {
          position: 'top-center',
        });
        onUpdate();
        setModal(false);
      }
    } catch (error) {
      console.error('Error editing job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job', {
        position: 'top-center',
      });
    }
  };

  const parseSalary = () => {
    if (!jobData?.lpa) return ['', ''];
    const parts = jobData.lpa.split('-');
    return parts.length === 2 ? parts : ['', ''];
  };
  const [salaryFrom, salaryTo] = parseSalary();

  const initialValues = {
    title: jobData?.title || '',
    location: jobData?.location || '',
    saleryfrom: salaryFrom,
    saleryto: salaryTo,
    applyBefore: jobData?.applyBefore || '',
    experience: jobData?.experience || '',
    jobmode: jobData?.jobmode || '',
    jobtype: jobData?.jobtype || '',
    about: jobData?.about || '',
    responsibility: jobData?.responsibility || '',
  };

  return (
    <div 
      ref={modalRef} 
      onClick={closeModal} 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        overflowY: 'auto' // Added to ensure outer scroll if needed
      }}
    >
      <div 
        className="modal-container"
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto', // Already present, kept for inner scroll
          position: 'relative',
          minHeight: '0' // Added to prevent flex issues
        }}
      >
        <button 
          className="modal-close-button" 
          onClick={() => setModal(false)}
          style={{
            position: 'sticky',
            top: '1rem',
            left: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            zIndex: 2,
            marginLeft: 'auto',
            display: 'block'
          }}
        >
          <IoMdClose size={30} />
        </button>
        
        <div 
          className="modal-content" 
          style={{ 
            paddingBottom: '2rem',
            overflowY: 'auto' // Added to ensure content can scroll
          }}
        >
          <h2 className="modal-title" style={{ 
            marginBottom: '1.5rem',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            paddingBottom: '1rem',
            zIndex: 1
          }}>
            Edit Job Details
          </h2>
          
          <Formik
            initialValues={initialValues}
            validationSchema={PostJobValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="modal-form">
                <div className="form-section">
                  <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="title" className="form-label">Title</label>
                      <Field
                        type="text"
                        id="title"
                        name="title"
                        className={`form-input ${errors.title && touched.title ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage name="title" component="div" className="error-message" />
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="location" className="form-label">Location</label>
                      <Field
                        type="text"
                        id="location"
                        name="location"
                        className={`form-input ${errors.location && touched.location ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage name="location" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="saleryfrom" className="form-label">Salary From (LPA)</label>
                      <Field
                        type="number"
                        id="saleryfrom"
                        name="saleryfrom"
                        className={`form-input ${errors.saleryfrom && touched.saleryfrom ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage name="saleryfrom" component="div" className="error-message" />
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="saleryto" className="form-label">Salary To (LPA)</label>
                      <Field
                        type="number"
                        id="saleryto"
                        name="saleryto"
                        className={`form-input ${errors.saleryto && touched.saleryto ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage name="saleryto" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="jobtype" className="form-label">Job Type</label>
                      <Field
                        as="select"
                        id="jobtype"
                        name="jobtype"
                        className={`form-input ${errors.jobtype && touched.jobtype ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </Field>
                      <ErrorMessage name="jobtype" component="div" className="error-message" />
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="jobmode" className="form-label">Job Mode</label>
                      <Field
                        as="select"
                        id="jobmode"
                        name="jobmode"
                        className={`form-input ${errors.jobmode && touched.jobmode ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Remote">Remote</option>
                        <option value="On Site">On Site</option>
                        <option value="Hybrid">Hybrid</option>
                      </Field>
                      <ErrorMessage name="jobmode" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="experience" className="form-label">Experience</label>
                      <Field
                        as="select"
                        id="experience"
                        name="experience"
                        className={`form-input ${errors.experience && touched.experience ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Internship">Internship</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Associate">Associate</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                      </Field>
                      <ErrorMessage name="experience" component="div" className="error-message" />
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="applyBefore" className="form-label">Apply Before</label>
                      <Field
                        type="date"
                        id="applyBefore"
                        name="applyBefore"
                        className={`form-input ${errors.applyBefore && touched.applyBefore ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage name="applyBefore" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="about" className="form-label">About</label>
                    <Field
                      as="textarea"
                      id="about"
                      name="about"
                      rows="4"
                      className={`form-textarea ${errors.about && touched.about ? 'input-error' : ''}`}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />
                    <ErrorMessage name="about" component="div" className="error-message" />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="responsibility" className="form-label">Responsibilities</label>
                    <Field
                      as="textarea"
                      id="responsibility"
                      name="responsibility"
                      rows="4"
                      className={`form-textarea ${errors.responsibility && touched.responsibility ? 'input-error' : ''}`}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />
                    <ErrorMessage name="responsibility" component="div" className="error-message" />
                  </div>
                </div>

                <div className="form-actions" style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: 'white',
                  paddingTop: '1rem',
                  zIndex: 1
                }}>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Job'}
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