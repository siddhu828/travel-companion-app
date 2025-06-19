import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/admin-login', formData);

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
    <div className="container mt-4">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="mb-3">
            <input
                type="email"
                name="email"
                placeholder="Admin Email"
                className="form-control"
                onChange={handleChange}
            />
        </div>
        <div className="mb-3">
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control"
                onChange={handleChange}
            />
        </div>
        <button type="submit" className="btn btn-danger">Login as Admin</button>
       </form>
    </div>
  );
};

export default AdminLogin;