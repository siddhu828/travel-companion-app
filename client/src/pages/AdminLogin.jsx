import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminAuth.css'; 
import API from '../services/api';

function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/admin-login', formData);
      if (!res.data.isAdmin) {
        alert("Not authorized as admin.");
        return;
      }
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data));
      navigate('/admin');
    } catch (err) {
      alert("Admin login failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-outer-border">
        <div className="admin-auth-header" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="TripSync" className="logo-img" />
          <span className="admin-logo-text">TripSync</span>
        </div>

        <div className="admin-auth-main">
          <div className="admin-auth-form-box">
            <h2 className="admin-auth-title">ADMIN LOGIN</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Admin Email*"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password*"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="admin-submit-btn">Login</button>
            </form>
          </div>
        </div>

        <footer className="admin-auth-footer">© 2025 TripSync. All rights reserved.</footer>
      </div>
    </div>
  );
}

export default AdminLogin;