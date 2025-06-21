import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
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
      await API.post('/auth/register', formData);
      alert("User Registered! Please login.");
      navigate('/login');
    } catch (err) {
      console.error("Register error:", err.response?.data?.msg || err.message);
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            type="email"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            type="password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 'bold' }}>
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Register;