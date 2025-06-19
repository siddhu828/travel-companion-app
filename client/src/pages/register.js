import { useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      alert("User Registered!");
      console.log(res.data);
    } catch (err) {
      console.error("Register error:", err.response?.data?.msg || err.message);
  alert(err.response?.data?.msg || "Registration failed");
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" onChange={handleChange} placeholder="Name" />
        <input type="email" name="email" onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" onChange={handleChange} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </>
  );
}

export default Register;