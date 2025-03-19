import React, { useState, useEffect } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import ProfilepicModal from '../../Employer/ProfilepicModal';
import { ProfileDataSchema } from '../../../validation/CandidateProfileValidation';
import "../../../Styles/USER/Home.css";

function EditProfileModal({ isOpen, onClose, profileData, refreshProfile }) {
  const baseURL = "http://127.0.0.1:8000/";
  const token = localStorage.getItem("access");
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("personal");
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [modal, setModal] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [profile_pic, setProfilepic] = useState(null);
  const [isSpinner, setIsSpinner] = useState(false);
  const [resume, setResume] = useState({ resume: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Set up initial form values based on profileData
  const [initialValues, setInitialValues] = useState({
    username: profileData?.user_name || "",
    email: profileData?.email || "",
    phone: profileData?.phone || "",
    place: profileData?.place || "",
    dob: profileData?.dob || "",
    gender: profileData?.Gender?.toLowerCase() || "",
    education: profileData?.education?.[0]?.education || "",
    specilization: profileData?.education?.[0]?.specilization || "",
    college: profileData?.education?.[0]?.college || "",
    completed: profileData?.education?.[0]?.completed || "",
    mark: profileData?.education?.[0]?.mark || "",
    linkedin: profileData?.linkedin || "",
    github: profileData?.github || "",
  });

  // Parse skills from profileData when component mounts or profileData changes
  useEffect(() => {
    if (profileData?.skills) {
      const skillArray = profileData.skills.split(",").map(skill => skill.trim());
      setSkills(skillArray);
    }
  }, [profileData]);

  // Skill management
  const handleSkill = (e) => setSkill(e.target.value);
  const handleAddSkill = () => {
    if (skill.trim() !== "") {
      setSkills([...skills, skill.trim()]);
      setSkill("");
    }
  };
  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Profile picture handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      setModal(true);
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file.", { position: "top-center" });
    }
  };

  // Cropped image handling
  const handleCropSubmit = (croppedUrl) => {
    setCroppedImageUrl(croppedUrl);
    setModal(false);
  };

  // Resume handling
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
        setResume({ resume: file });
      } else {
        toast.error("Please upload a valid PDF file (max 5MB).", { position: "top-center" });
      }
    }
  };

  // Convert base64 image to file
  useEffect(() => {
    const convertBase64ToImage = (base64String) => {
      if (!base64String) return;
      const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
      if (!base64Pattern.test(base64String)) return;
      const base64Content = base64String.replace(base64Pattern, "");
      const binaryString = window.atob(base64Content);
      const length = binaryString.length;
      const byteArray = new Uint8Array(length);
      for (let i = 0; i < length; i++) byteArray[i] = binaryString.charCodeAt(i);
      const type = base64String.match(/^data:image\/(png|jpeg|jpg);base64,/)[1];
      const blob = new Blob([byteArray], { type: `image/${type}` });
      const file = new File([blob], `profile_pic.${type}`, { type: `image/${type}` });
      setProfilepic(file);
    };
    
    convertBase64ToImage(croppedImageUrl);
  }, [croppedImageUrl]);

  // Handle form submission for profile update
  const handleSubmit = async (values, { setSubmitting }) => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill.", { position: "top-center" });
      return;
    }

    const skillString = skills.join(",");
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("place", values.place);
    formData.append("phone", values.phone);
    formData.append("dob", values.dob);
    formData.append("Gender", values.gender);
    
    // Only append profile_pic if a new one was selected
    if (profile_pic) {
      formData.append("profile_pic", profile_pic);
    }
    
    // Education details
    formData.append("education", values.education);
    formData.append("specilization", values.specilization);
    formData.append("college", values.college);
    formData.append("completed", values.completed);
    formData.append("mark", values.mark);
    
    // Skills
    formData.append("skills", skillString);
    
    // Social links
    formData.append("linkedin", values.linkedin);
    formData.append("github", values.github);
    
    // Only append resume if a new one was selected
    if (resume.resume) {
      formData.append("resume", resume.resume, resume.resume.name);
    }

    setIsSpinner(true);
    try {
      const response = await axios.put(`${baseURL}api/account/profile/update/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.status === 200) {
        setIsSpinner(false);
        toast.success("Profile updated successfully!", { position: "top-center" });
        refreshProfile(); // Refresh the profile data
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSpinner(false);
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong. Please try again.", { position: "top-center" });
      } else if (error.request) {
        toast.error("Network error. Please check your internet connection.", { position: "top-center" });
      } else {
        toast.error("An unexpected error occurred. Please try again.", { position: "top-center" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    setIsSpinner(true);
    try {
      const response = await axios.delete(`${baseURL}api/account/profile/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      
      if (response.status === 200) {
        setIsSpinner(false);
        toast.success("Profile deleted successfully!", { position: "top-center" });
        localStorage.removeItem("access"); // Clear token
        window.location.href = "/login"; // Redirect to login
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSpinner(false);
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong. Please try again.", { position: "top-center" });
      } else {
        toast.error("An unexpected error occurred. Please try again.", { position: "top-center" });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isSpinner && (
        <div className="spinner-overlay">
          <div className="spinner">
            <div className="spinner-inner"></div>
          </div>
        </div>
      )}
      
      <div className="ep-modal-overlay">
        <div className="ep-modal-container">
          <div className="ep-modal-header">
            <h2>Edit Profile</h2>
            <button className="ep-close-button" onClick={onClose}>×</button>
          </div>
          
          <div className="ep-modal-tabs">
            <button 
              className={`ep-tab-button ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
            <button 
              className={`ep-tab-button ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              Education
            </button>
            <button 
              className={`ep-tab-button ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Skills
            </button>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={ProfileDataSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="ep-modal-content">
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div className="ep-tab-content">
                    <div className="ep-profile-picture">
                      <div className="ep-avatar-container">
                        <img
                          src={
                            croppedImageUrl || 
                            (profileData.profile_pic ? `${baseURL}${profileData.profile_pic}` : "/default-avatar.png")
                          }
                          alt="Profile"
                          className="ep-avatar-preview"
                        />
                        <div className="ep-avatar-overlay">
                          <label htmlFor="profile-pic-upload" className="ep-upload-label">
                            Change
                          </label>
                          <input
                            id="profile-pic-upload"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleImageChange}
                            className="ep-file-input"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Username</label>
                      <Field type="text" name="username" placeholder="Username" readOnly />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Email</label>
                      <Field type="text" name="email" placeholder="Email" readOnly />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Mobile Number</label>
                      <Field type="text" name="phone" placeholder="Type here" />
                      <ErrorMessage name="phone" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Place</label>
                      <Field type="text" name="place" placeholder="Type here" />
                      <ErrorMessage name="place" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Date of Birth</label>
                      <Field type="date" name="dob" />
                      <ErrorMessage name="dob" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Gender</label>
                      <Field as="select" name="gender">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Resume</label>
                      <div className="ep-resume-container">
                        {profileData.resume && (
                          <div className="ep-current-resume">
                            <span>Current: </span>
                            <a
                              href={`${baseURL}${profileData.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Resume
                            </a>
                          </div>
                        )}
                        <input type="file" accept=".pdf" onChange={handleResumeChange} />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="ep-tab-content">
                    <div className="ep-form-group">
                      <label>Education</label>
                      <Field as="select" name="education">
                        <option value="">Select</option>
                        <option value="10th">10th</option>
                        <option value="higher_secondary">Higher Secondary</option>
                        <option value="graduation">Graduation</option>
                        <option value="post_graduation">Post Graduation</option>
                        <option value="iti">ITI</option>
                        <option value="diploma">Diploma</option>
                      </Field>
                      <ErrorMessage name="education" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Specialization</label>
                      <Field type="text" name="specilization" placeholder="Type here" />
                      <ErrorMessage name="specilization" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>College Name</label>
                      <Field type="text" name="college" placeholder="School/College" />
                      <ErrorMessage name="college" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Date of Completion</label>
                      <Field type="date" name="completed" />
                      <ErrorMessage name="completed" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>Mark in CGPA</label>
                      <Field type="text" name="mark" placeholder="Type here" />
                      <ErrorMessage name="mark" component="div" className="ep-error-message" />
                    </div>
                  </div>
                )}
                
                {/* Skills and Links Tab */}
{activeTab === 'skills' && (
    <div className="ep-tab-content">
        <div className="ep-form-group">
            <label>Skills</label>
            <div className="unique-skill-input"> {/* Unique class name */}
                <input 
                    type="text" 
                    value={skill} 
                    onChange={handleSkill} 
                    placeholder="Type here" 
                />
                <button 
                    type="button" 
                    onClick={handleAddSkill} 
                    className="unique-add-skill-btn" 
                >
                    Add
                </button>
            </div>
       
                     
                     
                     
                     
                     
                     
                     
                     
                     
                     
                     
                     
                     
                      <div className="ep-skills-list">
                        {skills.map((skill, index) => (
                          <div key={index} className="ep-skill-item">
                            <span>{skill}</span>
                            <span onClick={() => handleRemoveSkill(index)} className="ep-remove-skill">
                              <CiCircleRemove />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ep-form-group">
                      <label>LinkedIn Profile</label>
                      <Field type="text" name="linkedin" placeholder="Type here" />
                      <ErrorMessage name="linkedin" component="div" className="ep-error-message" />
                    </div>
                    
                    <div className="ep-form-group">
                      <label>GitHub Profile</label>
                      <Field type="text" name="github" placeholder="Type here" />
                      <ErrorMessage name="github" component="div" className="ep-error-message" />
                    </div>
                  </div>
                )}
                
                <div className="ep-modal-actions">
                  <button
                    type="button"
                    className="ep-delete-button"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete 
                  </button>
                  
                  <div className="ep-save-cancel">
  <button type="button" className="ep-cancel-button" onClick={onClose}>
    Cancel
  </button>
  <button type="submit" className="ep-save-button" disabled={isSubmitting}>
    {isSubmitting ? "Saving..." : "Save"}
  </button>
</div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="ep-confirm-overlay">
          <div className="ep-confirm-modal">
            <h3>Delete Profile</h3>
            <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
            <div className="ep-confirm-actions">
              <button 
                className="ep-cancel-button" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="ep-delete-confirm-button" 
                onClick={handleDeleteProfile}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Picture Crop Modal */}
      {modal && (
        <ProfilepicModal
          setCroppedImageUrl={setCroppedImageUrl}
          setImageUrl={setImageUrl}
          imageUrl={imageUrl}
          closeModal={() => setModal(false)}
          onCropSubmit={handleCropSubmit}
        />
      )}
    </>
  );
}

export default EditProfileModal;