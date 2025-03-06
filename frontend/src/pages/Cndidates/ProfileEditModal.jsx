import React from 'react';

const Modal = () => {
  return (
    <div>
      Hi
    </div>
  );
}

export default Modal;
{/*import React, { useRef, useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ProfileEditSchema, EducationSchema } from '../../../validation/CandidateProfileValidation';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Modal.css'; // Import your CSS file

function Modal({ setShowModal, section, modalData, userId, setAction, action }) {
  const baseURL = import.meta.env.VITE_API_BASEURL;
  const token = localStorage.getItem('access');
  const [data, setData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState('');
  const [info, setInfo] = useState({
    linkedin: '',
    github: '',
  });
  const [resume, setResume] = useState({
    resume: null,
  });

  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const handlePersonal = async (values, { setSubmitting }) => {
    const action = 'personal';
    const formData = new FormData();
    formData.append('full_name', values.username);
    formData.append('email', values.email);
    formData.append('place', values.place);
    formData.append('phone', values.phone);
    formData.append('dob', values.dob);
    formData.append('Gender', values.Gender);
    formData.append('action', action);
    formData.append('userId', userId);
    handleSubmit(formData);
    setSubmitting(false);
  };

  const handleEducation = async (values, { setSubmitting }) => {
    const action = 'education';
    const formData = new FormData();
    formData.append('education', values.education);
    formData.append('specilization', values.specilization);
    formData.append('college', values.college);
    formData.append('completed', values.completed);
    formData.append('mark', values.mark);
    formData.append('userId', userId);
    formData.append('action', action);
    handleSubmit(formData);
    setSubmitting(false);
  };

  const handleSkillSubmit = async () => {
    const skill = skills.toString();
    const action = 'skills';
    const formData = new FormData();
    formData.append('skills', skill);
    formData.append('action', action);
    formData.append('userId', userId);
    handleSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResumeChange = (e) => {
    setResume({ resume: e.target.files[0] });
  };

  const handleInfoSubmit = () => {
    const action = 'otherinfo';
    const formData = new FormData();
    formData.append('linkedin', info.linkedin || modalData.linkedin);
    formData.append('github', info.github || modalData.github);
    formData.append('action', action);
    formData.append('userId', userId);
    if (resume.resume) {
      formData.append('resume', resume.resume, resume.resume.name);
    }
    handleSubmit(formData);
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(baseURL + '/api/account/user/edit/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: 'top-center',
        });
        setAction(!action);
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setSkills(Array.isArray(modalData.skills) ? modalData.skills : []);
  }, [section === 'skills']);

  const handleSkill = (e) => setSkill(e.target.value);

  const handleAddSkill = () => {
    if (skill.trim() !== '') {
      setSkills([...skills, skill.trim()]);
      setSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const renderContent = () => {
    switch (section) {
      case 'personal':
        const personalValues = {
          username: modalData.user_name,
          email: modalData.email,
          place: modalData.place,
          phone: modalData.phone,
          dob: modalData.dob,
          Gender: modalData.Gender,
        };
        return (
          <div className="modal-content">
            <h1 className="modal-title">Personal Info</h1>
            <Formik initialValues={personalValues} validationSchema={ProfileEditSchema} onSubmit={handlePersonal}>
              {({ errors, touched, isSubmitting }) => (
                <Form className="modal-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <Field
                      type="text"
                      id="name"
                      name="username"
                      defaultValue={modalData.user_name}
                      className={`form-input ${errors.username && touched.username ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="username" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Your email</label>
                    <Field
                      type="email"
                      name="email"
                      defaultValue={modalData.email}
                      id="email"
                      className={`form-input ${errors.email && touched.email ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="place">Place</label>
                    <Field
                      type="text"
                      name="place"
                      defaultValue={modalData.place}
                      id="place"
                      className={`form-input ${errors.place && touched.place ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="place" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Mobile Number</label>
                    <Field
                      type="number"
                      name="phone"
                      defaultValue={modalData.phone}
                      id="phone"
                      className={`form-input ${errors.phone && touched.phone ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="phone" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <Field
                      type="date"
                      name="dob"
                      defaultValue={modalData.dob}
                      id="dob"
                      className={`form-input ${errors.dob && touched.dob ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="dob" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Gender">Gender</label>
                    <Field
                      name="Gender"
                      as="select"
                      defaultValue={modalData.Gender}
                      className={`form-input ${errors.Gender && touched.Gender ? 'input-error' : ''}`}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </Field>
                    <ErrorMessage name="Gender" component="div" className="error-message" />
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={isSubmitting} className="submit-button">
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        );
      case 'education':
        const educationValue = {
          education: '',
          college: '',
          specilization: '',
          mark: '',
          completed: '',
        };
        return (
          <div className="modal-content">
            <h1 className="modal-title">Education Info</h1>
            <Formik initialValues={educationValue} validationSchema={EducationSchema} onSubmit={handleEducation}>
              {({ errors, touched, isSubmitting }) => (
                <Form className="modal-form">
                  <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <Field
                      type="text"
                      name="education"
                      className={`form-input ${errors.education && touched.education ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="education" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="college">College</label>
                    <Field
                      type="text"
                      name="college"
                      className={`form-input ${errors.college && touched.college ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="college" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="specilization">Specilization</label>
                    <Field
                      type="text"
                      name="specilization"
                      className={`form-input ${errors.specilization && touched.specilization ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="specilization" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mark">Mark in cgpa</label>
                    <Field
                      type="text"
                      name="mark"
                      className={`form-input ${errors.mark && touched.mark ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="mark" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="completed">Completed On</label>
                    <Field
                      type="date"
                      name="completed"
                      id="name"
                      className={`form-input ${errors.completed && touched.completed ? 'input-error' : ''}`}
                    />
                    <ErrorMessage name="completed" component="div" className="error-message" />
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={isSubmitting} className="submit-button">
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        );
      case 'skills':
        return (
          <div className="modal-content">
            <h1 className="modal-title">Skills</h1>
            <div className="skill-input-container">
              <div className="form-group">
                <label htmlFor="skills">Skill</label>
                <input
                  type="text"
                  value={skill}
                  onChange={handleSkill}
                  id="name"
                  className="form-input"
                />
              </div>
              <button onClick={handleAddSkill} className="add-skill-button">
                Add
              </button>
            </div>
            <div className="skills-list">
              {Array.isArray(skills)
                ? skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <div>{skill}</div>
                      <div className="remove-skill" onClick={() => handleRemoveSkill(index)}>
                        <IoMdClose size={17} />
                      </div>
                    </div>
                  ))
                : 'No skills available'}
            </div>
            <form>
              <div className="form-actions">
                <button type="button" onClick={handleSkillSubmit} className="submit-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );
      case 'otherInfo':
        return (
          <div className="modal-content">
            <h1 className="modal-title">Other Info</h1>
            <form className="modal-form">
              <div className="form-group">
                <label htmlFor="linkedin">Linkedin Link</label>
                <input
                  name="linkedin"
                  onChange={handleChange}
                  type="text"
                  defaultValue={modalData.linkedin}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="github">Github</label>
                <input
                  name="github"
                  onChange={handleChange}
                  type="text"
                  defaultValue={modalData.github}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="resume">Resume</label>
                <input
                  type="file"
                  id="name"
                  onChange={(e) => handleResumeChange(e)}
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleInfoSubmit} className="submit-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return <div>No section matched</div>;
    }
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={() => setShowModal(false)}>
          <IoMdClose size={30} />
        </button>
        <div className="modal-content-wrapper">{renderContent()}</div>
      </div>
    </div>
  );
}












.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  color: white;
  width: 90%;
  max-width: 500px;
}

.close-button {
  align-self: flex-end;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
}

.modal-content-wrapper {
  background-color: #d1d5db;
  border-radius: 12px;
  padding: 20px;
  margin: 0 16px;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  color: black;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #374151;
  text-align: center;
  margin-bottom: 20px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.input-error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.skill-input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-skill-button {
  background-color: #4ade80;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.add-skill-button:hover {
  background-color: #22c55e;
}

.skills-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.skill-item {
  background-color: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remove-skill {
  cursor: pointer;
}
export default Modal;*/}