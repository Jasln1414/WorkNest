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
  try {
    const response = await BaseApi.post("/api/account/Emplogin/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response.status === 200) {
      const { access_token, refresh_token, email, isAdmin, usertype, user_data } = response.data;

      if (!access_token || !refresh_token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: 'Missing authentication tokens!',
        });
        return { success: false };
      }

      // Store tokens
      localStorage.setItem("access", access_token);
      localStorage.setItem("refresh", refresh_token);

      // Decode token
      const decodedToken = jwtDecode(access_token);

      // Handle profile picture URL
      const baseURL = "http://127.0.0.1:8000";
      let profilePic = null;
      
      if (user_data?.profile_pic) {
        profilePic = user_data.profile_pic.startsWith('http')
          ? user_data.profile_pic
          : `${baseURL}${user_data.profile_pic.startsWith('/') ? '' : '/'}${user_data.profile_pic}`;
      }

      // Update Redux state
      dispatch(set_Authentication({
        name: decodedToken.name || "Unknown",
        email: email,
        isAuthenticated: true,
        isAdmin: isAdmin,
        usertype: usertype,
        profilePic: profilePic,
      }));

      // Store in localStorage
      if (profilePic) {
        localStorage.setItem("profilePic", profilePic);
      }

      // Redirect based on profile completion
      if (response.data.user_data?.completed === false) {
        navigate('/employer/profile_creation/');
      } else {
        navigate('/employer/EmpHome/');
      }

      return { success: true };
    }
  } catch (error) {
    console.error("Login Error:", error);
    
    if (error.response?.status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Account Not Approved',
        text: 'Your employer account needs admin approval before you can login.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.detail || 'Login failed. Please try again.',
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