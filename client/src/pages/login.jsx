import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './authPages.css';
import API from '../services/api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify({
        token: res.data.token,
        user: res.data.user
      }));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed.");
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
            <h2 className="auth-title">LOGIN</h2>
            <form onSubmit={handleSubmit}>
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
              <button type="submit" className="submit-btn">Login</button>
            </form>
            <p className="auth-footer-link">
              Don’t have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
          <img src="/2p.svg" alt="right" className="auth-doodle right" />
        </div>

        <footer className="auth-footer">© 2025 TripSync. All rights reserved.</footer>
      </div>
    </div>
  );
}

export default Login;