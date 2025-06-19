import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      alert("User Registered! Please login.");
      navigate('/login');
    } catch (err) {
      console.error("Register error:", err.response?.data?.msg || err.message);
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
        <button type="submit" className="btn btn-primary mt-2">Register</button>
      </form>

      <p className="mt-3">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;