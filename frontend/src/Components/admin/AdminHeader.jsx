import React, { useState } from 'react';
import logoimg from '../../assets/logoimg.jpg';
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import '../../Styles/EmpHome.css';


function AdminHeader() {
    const authentication_user = useSelector((state) => state.authentication_user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        navigate('/admin/');
    };

    const items = [
        {
            label: <p>Profile</p>,
            key: '0',
        },
        {
            label: <p onClick={handleLogout} className="logout-option">Logout</p>,
            key: '1',
        },
    ];

    return (
        <div className="admin-header">
            <Link to={'/'}>
                <div className="logo-container">
                    <div className="logo-wrapper">
                        <img src={logoimg} alt="Logo" className="logo-image" />
                    </div>
                    <p className="site-name">WorkNest</p>
                </div>
            </Link>

            {/* Hamburger Menu for Mobile */}
            <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <MenuOutlined />
            </div>

            <div className={`header-right ${isMenuOpen ? "open" : ""}`}>
                <div className="divider-container">
                    <hr className="vertical-divider" />
                </div>
                <div className="user-menu">
                    <div className="user-dropdown">
                        <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    {authentication_user.isAuthenticated ? 
                                        <p className="user-name"style={{color:"light-blue"}}>{authentication_user.name}</p>
                                        :
                                        <p className="default-user " style={{color:"blue"}}>Admin</p>
                                    }
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHeader;
