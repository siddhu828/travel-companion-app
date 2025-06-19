import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Link } from 'react-router-dom';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log("Login successful!", res.data);
      localStorage.setItem('token', res.data.token);
      const fixedUser = { ...res.data.user, _id: res.data.user.id };
      localStorage.setItem('user', JSON.stringify(fixedUser));
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err.response?.data?.msg || err.message);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;