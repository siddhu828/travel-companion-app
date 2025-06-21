import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper
} from '@mui/material';

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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Admin Email"
            name="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            Login as Admin
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;