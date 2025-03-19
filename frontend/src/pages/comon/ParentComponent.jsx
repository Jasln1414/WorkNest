import React, { useState } from 'react';
import ForgetPasswordModal from './ForgotPassword';
import OtpModal from '../../Components/Employer/OtpModal';
import ResetPassword from './ResetPassword';

const PasswordResetFlow = () => {
  const [currentModal, setCurrentModal] = useState(null);
  const [email, setEmail] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const handleForgetPasswordSubmit = (email) => {
    setEmail(email);
    setCurrentModal('otp');
  };

  const handleOtpSuccess = () => {
    setOtpVerified(true);
    setCurrentModal('resetPassword');
  };

  const handleResetPasswordSuccess = () => {
    setCurrentModal(null);
    // Optionally, you can show a success message or redirect the user
  };

  return (
    <>
      <button onClick={() => setCurrentModal('forgetPassword')}>Forgot Password?</button>

      {currentModal === 'forgetPassword' && (
        <ForgetPasswordModal
          isOpen={true}
          onClose={() => setCurrentModal(null)}
          onSubmit={handleForgetPasswordSubmit}
        />
      )}

      {currentModal === 'otp' && (
        <OtpModal
          isOpen={true}
          closeModal={() => setCurrentModal(null)}
          email={email}
          onOtpSuccess={handleOtpSuccess}
        />
      )}

      {currentModal === 'resetPassword' && (
        <ResetPassword
          isOpen={true}
          onClose={() => setCurrentModal(null)}
          onSuccess={handleResetPasswordSuccess}
        />
      )}
    </>
  );
};

export default PasswordResetFlow;