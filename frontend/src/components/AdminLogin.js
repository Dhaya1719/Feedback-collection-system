// AdminLogin.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AdminLogin() {
  // State now tracks email and password
  const [formData, setFormData] = useState({ email: '', password: '' }); 
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // *** MODIFIED AXIOS CALL: Use ENV variable ***
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, formData); 
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert('Login failed. Invalid email or password.');
    }
  };

  return (
// ... rest of the component
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
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
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p>
        Don't have an admin account? <Link to="/admin/register">Register here</Link>
      </p>
    </div>
  );
}

export default AdminLogin;