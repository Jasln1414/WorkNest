import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../../Styles/Admin/AdminHome.css'; // Import CSS

function AdminLogin() {
  const authentication_user = useSelector((state) => state.authentication_user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = 'http://127.0.0.1:8000';
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", e.target.email.value);
    formData.append("password", e.target.password.value);
    
    try {
      const response = await axios.post(baseURL + '/api/account/admin/login/', formData);
      if (response.status === 200) {
        localStorage.setItem('access', response.data.access_token);
        localStorage.setItem('refresh', response.data.refresh_token);
        dispatch(
          set_Authentication({
            name: jwtDecode(response.data.access_token).name,
            email: response.data.email,
            isAuthenticated: true,
            isAdmin: response.data.isAdmin,
            usertype: response.data.usertype,
          })
        );
        navigate(response.data.isAdmin ? '/admin/home/' : '/admin/');
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };
  
  useEffect(() => {
    if (authentication_user.isAuthenticated) {
      navigate('/admin/home/');
    }
  }, [authentication_user, navigate]);
  
  return (
    <div className="main-container">
      {/* Header */}
     
      
      {/* Login Container */}
      <div className="login-container">
        <div className="login-card">
          <h3>Admin Panel Sign In</h3>
          <form className="adminlogin-form" onSubmit={handleLoginSubmit} method="POST">
            <label htmlFor="email">Email*</label>
            <input id="email" type="email" placeholder="mail@loopple.com" required />
            
            <label htmlFor="password">Password*</label>
            <input id="password" type="password" placeholder="Enter a password" required />
            
            <button className="adminhome" type="submit">Sign In</button>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Admin Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AdminLogin;