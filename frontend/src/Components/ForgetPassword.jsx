import React, { useState } from 'react';
import { Modal } from 'react-bootstrap'; // Bootstrap modal for a clean, responsive modal
import Spinner from './Spinner.jsx';


const ForgetPassword = ({ showModal, closeModal }) => {
  const [formError, setFormError] = useState('');
  const [isSpinner, setIsSpinner] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSpinner(true);

    try {
      // Simulate an API call for password reset
      setTimeout(() => {
        // Here, you can handle the success/failure response as needed
        setIsSpinner(false);
        setFormError('');
        closeModal(); // Close the modal after "successful" request
        alert('Password reset link sent to email!');
      }, 2000);
    } catch (error) {
      setIsSpinner(false);
      setFormError('Something went wrong. Please try again.');
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isSpinner && (
          <form onSubmit={handleSubmit} className="form-container">
            <div className="input-group">
              <p className="label">Enter your email</p>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
              {formError && (
                <div className="error-message">
                  <p>{formError}</p>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="submit-button"
            >
              Send Otp
            </button>
          </form>
        )}
        {isSpinner && (
          <div className="spinner-container">
            <Spinner />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ForgetPassword;
