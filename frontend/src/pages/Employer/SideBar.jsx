import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineAddTask, MdOutlineMessage } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import { PiUserCircleCheckFill } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { set_Authentication } from "../../Redux/Authentication/authenticationSlice";
import "../../Styles/SideBar.css";

function SideBar() {
  const location = useLocation(); // Get current URL path
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authentication_user = useSelector((state) => state.authentication_user);

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

  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        {/* Post Job Link */}
        <li>
          <Link
            to="/employer/postjob/"
            className={`sidebar-link ${
              location.pathname === "/employer/postjob/" ? "active" : ""
            }`}
          >
            <MdOutlineAddTask className="icon" />
            <span>Post Job</span>
          </Link>
        </li>

        {/* Home Link */}
        <li>
          <Link
            to="/employer/EmpHome"
            className={`sidebar-link ${
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
            className={`sidebar-link ${
              location.pathname === "/employer/profile/" ? "active" : ""
            }`}
          >
            <PiUserCircleCheckFill className="icon" />
            <span>Profile</span>
          </Link>
        </li>

        {/* Logout Button */}
        <li>
          <button onClick={handleLogout} className="sidebar-link logout">
            <IoIosLogOut className="icon" />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
