import React, { useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PostJobValidationSchema } from '../../validation/PostJobValidation';
import { toast } from 'react-toastify';
import axios from 'axios';
 // Import custom CSS

function JobDetailMOdal({ setModal, jobData }) {
  const baseURL =  'http://127.0.0.1:8000/';
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
    <div ref={modalRef} onClick={closeModal} className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={() => setModal(false)}>
          <IoMdClose size={30} />
        </button>
        <div className="modal-content">
          <Formik
            initialValues={initialValue}
            validationSchema={PostJobValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="title">Title</label>
                      <Field
                        type="text"
                        id="title"
                        name="title"
                        className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
                      />
                      <ErrorMessage name="title" component="div" className="error-message" />
                    </div>

                    <div className="form-field">
                      <label htmlFor="location">Location</label>
                      <Field
                        type="text"
                        id="location"
                        name="location"
                        className={`form-input ${errors.location && touched.location ? 'error' : ''}`}
                      />
                      <ErrorMessage name="location" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="saleryfrom">Salary From</label>
                      <Field
                        type="text"
                        id="saleryfrom"
                        name="saleryfrom"
                        className={`form-input ${errors.saleryfrom && touched.saleryfrom ? 'error' : ''}`}
                      />
                      <ErrorMessage name="saleryfrom" component="div" className="error-message" />
                    </div>

                    <div className="form-field">
                      <label htmlFor="saleryto">Salary To</label>
                      <Field
                        type="text"
                        id="saleryto"
                        name="saleryto"
                        className={`form-input ${errors.saleryto && touched.saleryto ? 'error' : ''}`}
                      />
                      <ErrorMessage name="saleryto" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="jobtype">Job Type</label>
                      <Field
                        as="select"
                        id="jobtype"
                        name="jobtype"
                        className={`form-input ${errors.jobtype && touched.jobtype ? 'error' : ''}`}
                      >
                        <option value="">Select</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                      </Field>
                      <ErrorMessage name="jobtype" component="div" className="error-message" />
                    </div>

                    <div className="form-field">
                      <label htmlFor="jobmode">Job Mode</label>
                      <Field
                        as="select"
                        id="jobmode"
                        name="jobmode"
                        className={`form-input ${errors.jobmode && touched.jobmode ? 'error' : ''}`}
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
                    <div className="form-field">
                      <label htmlFor="experiance">Experience</label>
                      <Field
                        as="select"
                        id="experiance"
                        name="experiance"
                        className={`form-input ${errors.experiance && touched.experiance ? 'error' : ''}`}
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

                    <div className="form-field">
                      <label htmlFor="applyBefore">Apply Before</label>
                      <Field
                        type="date"
                        id="applyBefore"
                        name="applyBefore"
                        className={`form-input ${errors.applyBefore && touched.applyBefore ? 'error' : ''}`}
                      />
                      <ErrorMessage name="applyBefore" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="about">About</label>
                      <Field
                        as="textarea"
                        id="about"
                        name="about"
                        className={`form-input ${errors.about && touched.about ? 'error' : ''}`}
                      />
                      <ErrorMessage name="about" component="div" className="error-message" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="responsibility">Responsibility</label>
                      <Field
                        as="textarea"
                        id="responsibility"
                        name="responsibility"
                        className={`form-input ${errors.responsibility && touched.responsibility ? 'error' : ''}`}
                      />
                      <ErrorMessage name="responsibility" component="div" className="error-message" />
                    </div>
                  </div>
                </div>

                <div className="form-submit">
                  <button type="submit" className="submit-button">
                    Submit
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

export default JobDetailMOdal;