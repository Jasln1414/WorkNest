import React, { useState, useEffect } from 'react';
import logoimg from '../../assets/logoimg.jpg';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ProfileValidationSchema, initialValues } from '../../validation/EmpProfile';
import ProfilepicModal from './ProfilepicModal';
import EmployerHeader from './EmployerHeader'; // Import the EmployerHeader component
import '../../Styles/EmpProfile.css';

function EmpProfileCreation() {
  const baseURL = "http://127.0.0.1:8000";
  const token = localStorage.getItem('access');
  const authentication_user = useSelector((state) => state.authentication_user) || {
    name: "",
    email: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profile_pic, setProfilepic] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [modal, setModal] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [imgError, setImgError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      setModal(true);
      reader.readAsDataURL(file);
    }
  };

  const handleCropSubmit = (croppedUrl) => {
    setCroppedImageUrl(croppedUrl);
    setModal(false);
  };

  useEffect(() => {
    const convertBase64ToImage = (base64String) => {
      const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
      if (!base64Pattern.test(base64String)) {
        return;
      }
      const base64Content = base64String.replace(base64Pattern, '');
      const binaryString = window.atob(base64Content);
      const length = binaryString.length;
      const byteArray = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'image/png' });
      const file = new File([blob], 'profile_pic.png', { type: 'image/png' });
      setProfilepic(file);
    };
    convertBase64ToImage(croppedImageUrl);
  }, [croppedImageUrl]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("email", authentication_user.email);
    formData.append("phone", values.phone);
    formData.append("website_link", values.website_link);
    formData.append("headquarters", values.headquarters);
    formData.append("industry", values.industry);
    formData.append("hr_name", values.hr_name);
    formData.append("hr_phone", values.hr_phone);
    formData.append("hr_email", values.hr_email);
    formData.append("address", values.address);
    formData.append("about", values.about);
    
    if (profile_pic) {
      formData.append("profile_pic", profile_pic);
    }
    
    try {
      const response = await axios.post(baseURL + '/api/account/user/emp_profile_creation/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        dispatch(
          set_user_basic_details({
            profile_pic: response.data.data.profile_pic
          })
        );
        navigate('employer/EmpHome');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
     
      <div className="profile-wrapper">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Complete Company Profile</h3>
            <p className="sidebar-text">Unlock 500+ jobs from top companies and receive direct calls from HRs</p>
          </div>
          <div className="sidebar-content">
            <ul>
              {/* Sidebar content can go here */}
            </ul>
          </div>
        </div>
        <div className="main-content">
          <div className="form-container">
            <div className="form-header">
              <p className="form-title">About Company</p>
              <div className="form-body">
                <Formik
                  initialValues={initialValues}
                  validationSchema={ProfileValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      <div className="form-fields-container">
                        {/* Company Name and Phone */}
                        <div className="form-row">
                          <div className="form-group">
                            <input 
                              type="text" 
                              placeholder="Company Name" 
                              value={authentication_user.name || ""} // Default to empty string
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
                              value={authentication_user.email || ""} // Default to empty string
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
                              id="about" 
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
                        
                        {/* Submit Button */}
                        <div className="form-actions">
                          <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="submit-button"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmpProfileCreation;