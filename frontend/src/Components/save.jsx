import React, { useState, useEffect, useRef } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { FaPhone } from 'react-icons/fa6';
import { MdOutlineMail } from 'react-icons/md';
import { RxAvatar } from 'react-icons/rx';
import { MdDateRange } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import Modal from './ProfileEditModal';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { GoPencil } from 'react-icons/go';
import ProfilepicModal from '../Employer/ProfilepicModal';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice';
import '../../Styles/Candidate/ProfileView.css';

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [section, setSection] = useState('');
  const [modalData, setModalData] = useState([]);
  const [action, setAction] = useState(false);
  const dispatch = useDispatch();
  const baseURL = 'http://127.0.0.1:8000';

  const fileInputRef = useRef(null);

  const [modal, setModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [profile_pic, setProfilepic] = useState(null);
  const [imgError, setImgError] = useState('');

  const token = localStorage.getItem('access');
  const [profileData, setProfileData] = useState([]);
  const [eduData, setEduData] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + '/api/empjob/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            ContentType: 'multipart/form-data',
          },
        });
        if (response.status == 200) {
          setProfileData(response.data.data);
          setEduData(response.data.data.education);
        }
      } catch (error) {
        // Error handling
      }
    };
    fetchData();
  }, [action]);

  useEffect(() => {
    if (profileData?.skills) {
      const value = profileData.skills.split(',');
      setSkills(value);
    } else {
      setSkills([]);
    }
  }, [profileData]);

  const toggleModal = (section = '', modalData = []) => {
    setShowModal(true);
    setSection(section);
    setModalData(modalData || {});
  };

  const handleDelete = async (data) => {
    const actiondata = 'educationDelete';
    const formData = new FormData();
    formData.append('eduId', data.id);
    formData.append('action', actiondata);
    handleFormSubmit(formData);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await axios.post(baseURL + '/api/account/user/edit/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          ContentType: 'multipart/form-data',
        },
      });
      if (response.status == 200) {
        try {
          const responce = await axios.get(baseURL + '/api/account/user/details', {
            headers: {
              authorization: `Bearer ${token}`,
              Accept: 'application/json',
              ContentType: 'application/json',
            },
          });
          if (responce.status == 200) {
            dispatch(
              set_user_basic_details({
                profile_pic: responce.data.user_data.profile_pic,
              })
            );
          }
        } catch (error) {
          // Error handling
        }

        toast.success(response.data.message, {
          position: 'top-center',
        });
        setAction(!action);
      }
    } catch (error) {
      // Error handling
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

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

  useEffect(() => {
    const actionPicData = 'profilepic';
    const formData = new FormData();
    formData.append('profile_pic', profile_pic);
    formData.append('action', actionPicData);
    formData.append('userId', profileData.user);
    handleFormSubmit(formData);
  }, [profile_pic]);

  return (
    <div>
      <div>
        <div>
          {showModal && (
            <Modal
              action={action}
              setAction={setAction}
              setShowModal={setShowModal}
              section={section}
              modalData={modalData}
              userId={profileData.user}
            />
          )}
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

          <div>
            {/* Personal Info */}
            <div>
              <div>
                <div>
                  <CiEdit onClick={() => toggleModal('personal', profileData)} />
                </div>
                <div>Personal Info</div>
              </div>
              <div>
                <div onClick={handleIconClick}>
                  <GoPencil />
                </div>
                <img src={`${baseURL}${profileData.profile_pic}`} alt="Avatar" />
              </div>
              <div>
                <span>{profileData.user_name}</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
              />
            </div>

            {/* Educational Info */}
            <div>
              <div>
                <button type="button" onClick={() => toggleModal('education', eduData)}>
                  Add
                </button>
                <div>Educational Info</div>
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Education</th>
                      <th>Specialization</th>
                      <th>College</th>
                      <th>Completed</th>
                      <th>Mark</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eduData.map((edu, index) => (
                      <tr key={index}>
                        <td>{edu.education}</td>
                        <td>{edu.specilization}</td>
                        <td>{edu.college}</td>
                        <td>{edu.completed}</td>
                        <td>{edu.mark}</td>
                        <td>
                          <button onClick={() => handleDelete(edu)}>
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div>
                <CiEdit onClick={() => toggleModal('skills', { skills })} />
                <div>Skills</div>
              </div>
              <div>
                {skills.map((skill) => (
                  <div key={skill}>{skill}</div>
                ))}
              </div>
            </div>

            {/* Other Info */}
            <div>
              <div>
                <CiEdit onClick={() => toggleModal('otherInfo', profileData)} />
                <div>Other Info</div>
              </div>
              <div>
                <div>
                  <div>
                    <p>Linkedin</p>
                    <p>GitHub</p>
                    <p>Resume</p>
                  </div>
                </div>
                <div>
                  <div>
                    <p>{profileData.linkedin}</p>
                    <p>{profileData.github}</p>
                    <p>
                      <a
                        href={`${baseURL}${profileData.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;