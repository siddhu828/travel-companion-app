import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Divider,
  Chip
} from '@mui/material';

const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (!admin || !admin.token) {
      alert('Unauthorized access');
      navigate('/admin-login');
    } else {
      fetchUsers();
      fetchTrips();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/user/all');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await api.get('/api/trips');
      setTrips(res.data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await api.delete(`/api/user/${userId}`);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Delete this trip?')) {
      try {
        await api.delete(`/api/trips/${tripId}`);
        fetchTrips();
      } catch (err) {
        console.error('Error deleting trip:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleSearch = () => {
    const results = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(results);
  };

  const handleToggleBan = async (userId) => {
    try {
      await api.put(`/api/user/ban/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Error banning/unbanning user:", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1">Total Users: {users.length}</Typography>
      <Typography variant="subtitle1">Total Trips: {trips.length}</Typography>

      {/* USERS */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>All Users</Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outlined" onClick={handleSearch}>Search</Button>
        </Box>

        <Grid container spacing={2}>
          {filteredUsers.map(user => (
            <Grid item xs={12} md={6} key={user._id}>
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight="bold">
                  {user.name} ({user.email}) {user.isAdmin && <Chip label="Admin" color="info" size="small" sx={{ ml: 1 }} />}
                  {user.isBanned && <Chip label="BANNED" color="error" size="small" sx={{ ml: 1 }} />}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    size="small"
                    color={user.isBanned ? 'success' : 'warning'}
                    onClick={() => handleToggleBan(user._id)}
                    sx={{ mr: 1 }}
                  >
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* TRIPS */}
      <Box mt={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">All Trips</Typography>
          <Button
            variant="outlined"
            onClick={() =>
              setTrips([...trips].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)))
            }
          >
            Sort by Latest
          </Button>
        </Box>

        <Grid container spacing={2} mt={2}>
          {trips.map(trip => (
            <Grid item xs={12} md={6} key={trip._id}>
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight="bold">{toSentenceCase(trip.destination)}</Typography>
                <Typography variant="body2">
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2"><strong>Type:</strong> {trip.travelType}</Typography>
                <Typography  variant="body2"><strong>Created by: {toSentenceCase(trip.user?.name) || 'Unknown'}</strong></Typography>
                <Typography variant="body2">
                  <strong>Interests:</strong> {trip.interests?.join(', ')}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteTrip(trip._id)}
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;