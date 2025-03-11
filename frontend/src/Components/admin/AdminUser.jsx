import React, { useState } from 'react';
import axios from 'axios';
import '../../Styles/Admin/AdminHome.css'

const CreateSuperUser = () => {
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/create-superuser/', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, // Include admin token
                },
            });
            setMessage('Superuser created successfully!');
            setFormData({ email: '', full_name: '', password: '' }); // Clear form
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create superuser');
        }
    };

    return (
        <div className="create-superuser-container">
            <h2>Create Superuser</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Create Superuser</button>
            </form>
        </div>
    );
};

export default CreateSuperUser;