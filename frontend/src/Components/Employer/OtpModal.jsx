import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { EmployerVerifyOtpApi, ResendOtpApi } from "../../Api/Employer_Api/Employer_Auth_Api";
import "../../Styles/OTP.css";

const OtpModal = ({ isOpen, closeModal, email, onOtpSuccess }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0); // Timer countdown in seconds

  // Start the countdown when the modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(60); // Set initial countdown to 60 seconds
      setResendDisabled(true); // Disable the resend button initially
    }
  }, [isOpen]);

  // Handle countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false); // Enable the resend button when countdown reaches 0
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending OTP verification request...");
      const response = await EmployerVerifyOtpApi({ otp, email });
      console.log("OTP verification response:", response);

      if (response.success) {
        toast.success("OTP Verified Successfully!", { toastId: "otp-success" });
        if (onOtpSuccess) onOtpSuccess();
        closeModal();
      } else {
        toast.error("Invalid OTP. Please try again.");
        console.error("OTP verification failed:", response.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error("Error verifying OTP. Please try again.");
      } else {
        toast.error("Error verifying OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    setLoading(true);
    setResendDisabled(true);

    try {
      console.log("Sending OTP resend request...");
      const response = await ResendOtpApi({ email });
      console.log("OTP resend response:", response);

      if (response.success) {
        toast.success("OTP resent successfully!");
        setCountdown(60); // Reset the countdown to 60 seconds
      } else {
        toast.error("Failed to resend OTP. Please try again.");
        setResendDisabled(false);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error("Error resending OTP. Please try again.");
      } else {
        toast.error("Error resending OTP. Please try again.");
      }
      setResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal-content">
        <button className="otp-close-icon" onClick={closeModal}>
          ×
        </button>

        <h2>Enter Verification Code</h2>
        <p className="otp-instructions">
          We've sent a verification code to your email address. Please enter it below.
        </p>

        <form onSubmit={handleOTPSubmit}>
          <div className="otp-input-group">
            <input
              type="text"
              placeholder="Enter code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="otp-button-group">
            <button type="submit" disabled={loading} className="verify-btn">
              {loading ? (
                <>
                  <div className="spinner"></div> Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
<br></br>
          <div className="resend-section">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendDisabled || loading}
              className="otp-resend-btn"
            >
              Resend Code {countdown > 0 && <span className="timer-box">{countdown}s</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;