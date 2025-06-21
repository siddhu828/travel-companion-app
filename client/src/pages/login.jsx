import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      console.log("✅ Login response:", res.data); 
      localStorage.setItem('user', JSON.stringify({
        token: res.data.token,
        user: res.data.user
      }));
      navigate('/dashboard'); 
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      style={{ minHeight: '100vh', paddingTop: '80px' }}
    >
      <Grid item xs={11} sm={8} md={5}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Dont have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;