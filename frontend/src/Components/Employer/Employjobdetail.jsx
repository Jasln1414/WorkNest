import React, { useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PostJobValidationSchema } from '../../validation/PostJobValidation';
import { toast } from 'react-toastify';
import axios from 'axios';

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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-100 bg-opacity-75"
    >
      <div className="relative w-full max-w-4xl mx-auto my-6 p-5 bg-white rounded-lg shadow-xl md:p-8">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200" 
          onClick={() => setModal(false)}
        >
          <IoMdClose size={30} />
        </button>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Job Details</h2>
          
          <Formik
            initialValues={initialValue}
            validationSchema={PostJobValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <Field
                        type="text"
                        id="title"
                        name="title"
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.title && touched.title ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                      />
                      <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <Field
                        type="text"
                        id="location"
                        name="location"
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.location && touched.location ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                      />
                      <ErrorMessage name="location" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="saleryfrom" className="block text-sm font-medium text-gray-700 mb-1">Salary From</label>
                      <Field
                        type="text"
                        id="saleryfrom"
                        name="saleryfrom"
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.saleryfrom && touched.saleryfrom ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                      />
                      <ErrorMessage name="saleryfrom" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="saleryto" className="block text-sm font-medium text-gray-700 mb-1">Salary To</label>
                      <Field
                        type="text"
                        id="saleryto"
                        name="saleryto"
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.saleryto && touched.saleryto ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                      />
                      <ErrorMessage name="saleryto" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="jobtype" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                      <Field
                        as="select"
                        id="jobtype"
                        name="jobtype"
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.jobtype && touched.jobtype ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                      </Field>
                      <ErrorMessage name="jobtype" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="jobmode" className="block text-sm font-medium text-gray-700 mb-1">Job Mode</label>
                      <Field
                        as="select"
                        id="jobmode"
                        name="jobmode"
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.jobmode && touched.jobmode ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="Remote">Remote</option>
                        <option value="On Site">On Site</option>
                        <option value="Hybrid">Hybrid</option>
                      </Field>
                      <ErrorMessage name="jobmode" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="experiance" className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <Field
                        as="select"
                        id="experiance"
                        name="experiance"
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.experience && touched.experiance ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="Internship">Internship</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Associate">Associate</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                      </Field>
                      <ErrorMessage name="experiance" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="applyBefore" className="block text-sm font-medium text-gray-700 mb-1">Apply Before</label>
                      <Field
                        type="date"
                        id="applyBefore"
                        name="applyBefore"
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.applyBefore && touched.applyBefore ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                        }`}
                      />
                      <ErrorMessage name="applyBefore" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About</label>
                    <Field
                      as="textarea"
                      id="about"
                      name="about"
                      rows="4"
                      className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                        errors.about && touched.about ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                      }`}
                    />
                    <ErrorMessage name="about" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="responsibility" className="block text-sm font-medium text-gray-700 mb-1">Responsibility</label>
                    <Field
                      as="textarea"
                      id="responsibility"
                      name="responsibility"
                      rows="4"
                      className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                        errors.responsibility && touched.responsibility ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                      }`}
                    />
                    <ErrorMessage name="responsibility" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button 
                    type="submit" 
                    className="inline-flex justify-center items-center text-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 sm:px-5 sm:py-2.5 transition-colors"
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