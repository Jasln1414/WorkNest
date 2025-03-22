// Employer_Auth_Api.js
import { BaseApi } from "../BaseApi";
import { toast } from "react-toastify";

export const EmployerSignupApi = async (formData) => {
  try {
    const response = await BaseApi.post("/api/account/employer/register/", formData);

    if (response.status === 200 || response.status === 201) {
      toast.success("Registration successful! OTP sent.");
      localStorage.setItem("email", formData.get("email"));
      return { success: true, data: response.data };
    } else {
      toast.error("Something went wrong. Please try again.");
      return { success: false };
    }
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("An error occurred. Please try again later.");
    return { success: false };
  }
};

export const EmployerVerifyOtpApi = async (otpData) => {
  try {
    const response = await BaseApi.post("/api/account/verify-otp/", otpData);

    if (response.status === 200 || response.status === 201) {
     {/*toast.success("OTP verified successfully!");*/}
      return { success: true, data: response.data };
    } else {
      toast.error("Invalid OTP. Please try again.");
      return { success: false };
    }
  } catch (error) {
    if (error.response) {
      console.error("OTP verification error response:", error.response);
      toast.error(`Error: ${error.response.data.error || "An error occurred. Please try again."}`);
    } else {
      console.error("OTP verification error:", error);
      toast.error("An error occurred. Please try again.");
    }
    return { success: false };
  }
};

export const ResendOtpApi = async (data) => {
  try {
    const response = await BaseApi.post("/api/account/resend-otp/", data);
    
    if (response.status === 200 || response.status === 201) {
      {/*toast.success("OTP has been resent to your email.");*/}
      return { success: true, data: response.data };
    } else {
      toast.error("Failed to resend OTP. Please try again.");
      return { success: false };
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    toast.error("An error occurred. Please try again later.");
    return { success: false };
  }
};


import {jwtDecode} from "jwt-decode";

import Swal from 'sweetalert2'; // Import SweetAlert

export const EmployerLoginApi = async (formData, dispatch, set_Authentication, navigate) => {
  console.log("📌 FormData:", formData);

  try {
    const response = await BaseApi.post("/api/account/Emplogin/", formData);
    console.log("✅ API Response:", response);

    if (response.status === 200) {
      const { access_token, refresh_token, email, isAdmin, usertype, user_data } = response.data;

      if (!access_token || !refresh_token) {
        console.error("❌ Missing authentication tokens!");
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: 'Authentication failed. Please try again.',
        });
        return { success: false };
      }

      // Store tokens in localStorage
      localStorage.setItem("access", access_token);
      localStorage.setItem("refresh", refresh_token);

      // Decode JWT token
      const decodedToken = jwtDecode(access_token);
      console.log("🔍 Decoded Token:", decodedToken);

      // Extract profile picture URL from user_data
      const baseURL = "http://127.0.0.1:8000"; // Replace with your backend URL
      const profilePic = user_data?.profile_pic ? `${baseURL}${user_data.profile_pic}` : null;
      console.log("Profile Picture URL:", profilePic); // Debugging

      // Update Redux state with profile picture
      dispatch(
        set_Authentication({
          name: decodedToken.name || "Unknown",
          email: email,
          isAuthenticated: true,
          isAdmin: isAdmin,
          usertype: usertype,
          profilePic: profilePic, // Ensure this is added
        })
      );

      // Store profile picture in localStorage (optional)
      if (profilePic) {
        localStorage.setItem("profilePic", profilePic);
      }

      // Success SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'You have successfully logged in.',
        timer: 2000, // Auto-close after 2 seconds
        showConfirmButton: false,
      });

      if (response.data.user_data.completed === false) {
        navigate('/employer/profile_creation/');
      } else {
        navigate('/employer/EmpHome/');
      }

      return { success: true };
    } else {
      console.warn("⚠️ Unexpected status code:", response.status);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Login failed. Please try again.',
      });
      return { success: false };
    }
  } catch (error) {
    console.error("❌ Login Error:", error);

    if (error.response) {
      console.error("🚨 Error Response:", error.response);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response.data.detail || 'You have to approved by admin.',
      });
    } else if (error.request) {
      console.error("📡 No response from server:", error.request);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Server is not responding. Please try again later.',
      });
    } else {
      console.error("⚙️ Error setting up request:", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again.',
      });
    }

    return { success: false };
  }
};


export const UserVerifyOtpApi = async (otpData) => {
  try {
    const response = await BaseApi.post("/api/account/verify-otp/", otpData);

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      toast.error("Invalid OTP. Please try again.");
      return { success: false };
    }
  } catch (error) {
    if (error.response) {
      console.error("OTP verification error response:", error.response);
      toast.error(`Error: ${error.response.data.error || "An error occurred. Please try again."}`);
    } else {
      console.error("OTP verification error:", error);
      toast.error("An error occurred. Please try again.");
    }
    return { success: false };
  }
};

export const UserResendOtpApi = async (data) => {
  try {
    const response = await BaseApi.post("/api/account/resend-otp/", data);

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      toast.error("Failed to resend OTP. Please try again.");
      return { success: false };
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    toast.error("An error occurred. Please try again later.");
    return { success: false };
  }
};