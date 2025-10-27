// AdminRegister.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AdminRegister() {
  const [formData, setFormData] = useState({ adminName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // *** MODIFIED AXIOS CALL: Use ENV variable ***
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/register`, formData);
      alert('Registration successful! Please login.');
      navigate('/admin/login');
    } catch (err) {
      console.error(err.response.data);
      alert('Registration failed. Please try again.');
    }
  };

  return (
// ... rest of the component
    <div className="container">
      <h2>New Admin Registration</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Admin Name field (kept but can be styled hidden or simplified) */}
        <div className="form-group"> 
          <label>Admin Name</label>
          <input
            type="text"
            name="adminName"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email ID</label>
          <input 
            type="email"
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/admin/login">Login here</Link>
      </p>
    </div>
  );
}

export default AdminRegister;