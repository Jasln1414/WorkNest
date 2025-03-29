import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { EmployerVerifyOtpApi, ResendOtpApi, UserVerifyOtpApi, UserResendOtpApi } from "../../Api/Employer_Api/Employer_Auth_Api";
import "../../Styles/OTP.css";

const EmailVerificationModal = ({ isOpen, closeModal, email, onOtpSuccess, isEmployer = false }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCountdown(60);
      setResendDisabled(true);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending OTP verification request...", { otp, email });
      const response = isEmployer
        ? await EmployerVerifyOtpApi({ otp, email })
        : await UserVerifyOtpApi({ otp, email });
      console.log("OTP verification response:", response);

      if (response.success) {
        toast.success("OTP Verified Successfully!", { toastId: "otp-success" });
        if (onOtpSuccess) {
          onOtpSuccess();
        }
      } else {
        toast.error(response.message || "Invalid OTP. Please try again.");
        console.error("OTP verification failed:", response.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(error.response.data.message || "Error verifying OTP. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
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
      console.log("Sending OTP resend request...", { email });
      const response = isEmployer
        ? await ResendOtpApi({ email })
        : await UserResendOtpApi({ email });
      console.log("OTP resend response:", response);

      if (response.success) {
        toast.success("OTP resent successfully!");
        setCountdown(60);
      } else {
        toast.error(response.message || "Failed to resend OTP. Please try again.");
        setResendDisabled(false);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(error.response.data.message || "Error resending OTP. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
      setResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="email-verification-overlay">
      <div className="email-verification-content">
        <button className="email-verification-close" onClick={closeModal}>
          ×
        </button>

        <h2 className="email-verification-title">Enter Verification Code</h2>
        <p className="email-verification-text">
          We've sent a verification code to your email address. Please enter it below.
        </p>

        <form onSubmit={handleOTPSubmit} className="email-verification-form">
          <div className="email-verification-input-group">
            <input
              type="text"
              placeholder="Enter code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoFocus
              className="email-verification-input"
            />
          </div>

          <div className="email-verification-buttons">
            <button type="submit" disabled={loading} className="email-verification-submit">
              {loading ? (
                <>
                  <div className="email-verification-spinner"></div> Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
          
          <div className="email-verification-resend">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendDisabled || loading}
              className="email-verification-resend-btn"
            >
              Resend Code {countdown > 0 && <span className="email-verification-timer">{countdown}s</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerificationModal;