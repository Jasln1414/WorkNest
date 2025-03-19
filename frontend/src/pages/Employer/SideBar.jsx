import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineAddTask } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import { PiUserCircleCheckFill } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { PiFileTextFill } from "react-icons/pi"; // From Phosphor Icons
import { PiClipboardTextFill } from "react-icons/pi"; // From Phosphor Icons

import { FaClipboardList } from "react-icons/fa"; // From Font Awesome
import { FaFileAlt } from "react-icons/fa"; // From Font Awesome
import { set_Authentication } from "../../Redux/Authentication/authenticationSlice";
import "../../Styles/SideBar.css";
import DashboardIcon from "./DashBoard";

function SideBar({ hideHeader = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authentication_user = useSelector((state) => state.authentication_user);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(
      set_Authentication({
        name: null,
        email: null,
        isAuthenticated: false,
        isAdmin: false,
        usertype: null,
      })
    );
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`employer-sidebar ${isOpen ? "open" : ""}`}>
        <div className="employer-sidebar-logo">
          <h1>Dashboard</h1>
        </div>
        <br />
        <Link to="/employer/postjob/" className="employer-post-job-button-sidebar">
          <MdOutlineAddTask className="icon" />
          <span>Post Job</span>
        </Link>
      
        <ul className="employer-sidebar-list">
          {/* Home Link */}
          <li>
            <Link
              to="/employer/EmpHome"
              className={`employer-sidebar-link ${
                location.pathname === "/employer/EmpHome" ? "active" : ""
              }`}
            >
              <HiHome className="icon" />
              <span>Home</span>
            </Link>
          </li>
          {/* Profile Link */}
          <li>
            <Link
              to="/employer/profile/"
              className={`employer-sidebar-link ${
                location.pathname === "/employer/profile/" ? "active" : ""
              }`}
            >
              <PiUserCircleCheckFill className="icon" />
              <span>Profile</span>
            </Link>
          </li>
          {/* Applications Link */}
          <li>
            <Link
              to="/employer/applications"
              className={`employer-sidebar-link ${
                location.pathname === "/employer/applications" ? "active" : ""
              }`}
            >
              


              
    <PiClipboardTextFill className="icon" />
    <span>Applications</span>
  </Link>

             
          </li>
        </ul>
        <button onClick={handleLogout} className="signout">
          <IoIosLogOut className="icon-1" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}

export default SideBar;