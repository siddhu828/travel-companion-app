import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './authPages.css';
import API from '../services/api';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/auth/register', formData);
      alert("Registered successfully! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-outer-border">
        <div className="auth-header" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="TripSync" className="logo-img" />
          <span className="logo-text">TripSync</span>
        </div>

        <div className="auth-main">
          <img src="/1p.svg" alt="left" className="auth-doodle left" />
          <div className="auth-form-box">
            <h2 className="auth-title">REGISTER</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name*"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email*"
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
              <button type="submit" className="submit-btn">Register</button>
            </form>
            <p className="auth-footer-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
          <img src="/2p.svg" alt="right" className="auth-doodle right" />
        </div>

        <footer className="auth-footer">© 2025 TripSync. All rights reserved.</footer>
      </div>
    </div>
  );
}

export default Register;