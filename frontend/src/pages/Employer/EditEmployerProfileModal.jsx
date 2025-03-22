import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ProfilepicModal from './ProfilepicModal';
import '../../Styles/EmpHome.css';

function EditEmployerProfileModal({ profileData, onClose, onSave }) {
  const baseURL = "http://127.0.0.1:8000"; // Django backend URL
  const token = localStorage.getItem('access'); // Retrieve JWT token from local storage

  // State for profile picture and image handling
  const [profile_pic, setProfilepic] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [modal, setModal] = useState(false); // Controls the profile picture modal
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [imgError, setImgError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token from Django backend
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Make a request to your CSRF token endpoint
        const response = await axios.get(`${baseURL}/get-csrf-token/`);
        if (response.data && response.data.csrfToken) {
          setCsrfToken(response.data.csrfToken);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, [baseURL]);

  // Set initial profile picture if available
  useEffect(() => {
    if (profileData.profile_pic) {
      setCroppedImageUrl(
        profileData.profile_pic.startsWith('http')
          ? profileData.profile_pic
          : `${baseURL}${profileData.profile_pic}`
      );
    }
  }, [profileData.profile_pic, baseURL]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      setModal(true); // Open the cropping modal
      reader.readAsDataURL(file);
    }
  };

  // Handle cropped image submission
  const handleCropSubmit = (croppedUrl) => {
    setCroppedImageUrl(croppedUrl);
    setModal(false); // Close the cropping modal
  };

  // Convert base64 image to a file for upload
  useEffect(() => {
    const convertBase64ToImage = (base64String) => {
      if (!base64String || !base64String.startsWith('data:image')) {
        return;
      }
      const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
      const base64Content = base64String.replace(base64Pattern, '');
      const binaryString = window.atob(base64Content);
      const length = binaryString.length;
      const byteArray = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'image/png' });
      const file = new File([blob], 'profile_pic.png', { type: 'image/png' });
      setProfilepic(file); // Set the profile picture file
    };

    convertBase64ToImage(croppedImageUrl);
  }, [croppedImageUrl]);

  // Validation schema for the form
  const ProfileEditValidationSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone number must be digits only')
      .min(10, 'Phone number must be at least 10 digits')
      .required('Phone number is required'),
    website_link: Yup.string()
      .url('Enter a valid URL')
      .required('Website link is required'),
    headquarters: Yup.string()
      .required('Headquarters location is required'),
    industry: Yup.string()
      .required('Industry type is required'),
    address: Yup.string()
      .required('Address is required'),
    about: Yup.string()
      .required('Company description is required')
      .min(50, 'Description should be at least 50 characters'),
  });

  // Configure axios to include CSRF with credentials
  useEffect(() => {
    // Set axios defaults to include credentials and CSRF handling
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('phone', values.phone);
    formData.append('website_link', values.website_link);
    formData.append('headquarters', values.headquarters);
    formData.append('industry', values.industry);
    formData.append('address', values.address);
    formData.append('about', values.about);

    if (profile_pic) {
      formData.append('profile_pic', profile_pic);
    }

    try {
      // First make a request to ensure CSRF cookie is set
      await axios.get(`${baseURL}/get-csrf-token/`);
      
      const response = await axios.put(`${baseURL}/api/account/employer/profile/update/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        onSave(response.data); // Notify parent component of successful save
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Backend error:', error.response.data);
      } else {
        console.error('Network or other error:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle profile deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        // First make a request to ensure CSRF cookie is set
        await axios.get(`${baseURL}/get-csrf-token/`);
        
        const response = await axios.delete(`${baseURL}/api/account/employer/profile/delete/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        });
        if (response.status === 204) {
          onClose(); // Close the modal
          window.location.reload(); // Reload the page or redirect
        }
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Edit Company Profile</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <Formik
            initialValues={{
              phone: profileData.phone || '',
              website_link: profileData.website_link || '',
              headquarters: profileData.headquarters || '',
              industry: profileData.industry || '',
              address: profileData.address || '',
              about: profileData.about || '',
            }}
            validationSchema={ProfileEditValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-fields-container">
                  {/* Company Name and Phone */}
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={profileData.user_full_name || ''}
                        className="form-input"
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        type="text"
                        placeholder="Mobile Number"
                        name="phone"
                        className={`form-input ${errors.phone && touched.phone ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="phone" component="div" className="error-message" />
                    </div>
                  </div>

                  {/* Email and Website */}
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Email"
                        value={profileData.user_email || ''}
                        className="form-input"
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        type="text"
                        placeholder="Company Website"
                        name="website_link"
                        className={`form-input ${errors.website_link && touched.website_link ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="website_link" component="div" className="error-message" />
                    </div>
                  </div>

                  {/* Headquarters and Industry */}
                  <div className="form-row">
                    <div className="form-group">
                      <Field
                        type="text"
                        placeholder="Headquarters"
                        name="headquarters"
                        className={`form-input ${errors.headquarters && touched.headquarters ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="headquarters" component="div" className="error-message" />
                    </div>
                    <div className="form-group">
                      <Field
                        type="text"
                        placeholder="Industry Type"
                        name="industry"
                        className={`form-input ${errors.industry && touched.industry ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="industry" component="div" className="error-message" />
                    </div>
                  </div>

                  {/* About the Company */}
                  <div className="form-row">
                    <div className="form-group full-width">
                      <Field
                        as="textarea"
                        className={`form-textarea ${errors.about && touched.about ? 'input-error' : ''}`}
                        name="about"
                        rows="4"
                        placeholder="About the company"
                      />
                      <ErrorMessage name="about" component="div" className="error-message" />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="form-row">
                    <div className="form-group full-width">
                      <Field
                        type="text"
                        placeholder="Address"
                        name="address"
                        className={`form-input ${errors.address && touched.address ? 'input-error' : ''}`}
                      />
                      <ErrorMessage name="address" component="div" className="error-message" />
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label htmlFor="profile_pic" className="file-label">Profile Image</label>
                      <input
                        type="file"
                        name="profile_pic"
                        onChange={handleImageChange}
                        className="file-input"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {croppedImageUrl && (
                    <div className="form-row">
                      <div className="image-preview">
                        <img
                          src={croppedImageUrl}
                          alt="Avatar"
                          className="profile-image"
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="delete-button"
                    >
                      Delete Profile
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="submit-button"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Profile Picture Modal */}
      {modal && (
        <ProfilepicModal
          setCroppedImageUrl={setCroppedImageUrl}
          setImageUrl={setImageUrl}
          setImgError={setImgError}
          imageUrl={imageUrl}
          closeModal={() => setModal(false)}
          onCropSubmit={handleCropSubmit}
        />
      )}
    </div>
  );
}

export default EditEmployerProfileModal;