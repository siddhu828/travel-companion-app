import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Button,
  Paper,
  Stack,
  Divider
} from '@mui/material';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};

const Dashboard = () => {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('user'));
  const user = stored?.user || stored;
  const [trips, setTrips] = useState([]);

  const userId = user?._id || user?.id; // Fallback for id or _id
  console.log("👉 LocalStorage User:", user); // Debug log
  console.log("✅ User ID used for fetching trips:", userId);

  useEffect(() => {
    if (!userId) return; // ✅ Prevent call if ID not available

    const fetchTrips = async () => {
      try {
        const res = await api.get(`/trips/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error('Error fetching trips:', err);
      }
    };

    fetchTrips();
  }, [userId]); // ✅ Correct dependency

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 6 }}>
      <Grid item xs={11} sm={10} md={8}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            Welcome, {user?.name || 'User'}!
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} mb={4}>
          <Button variant="contained" onClick={() => navigate('/create-trip')}>
            Create Trip
          </Button>
          <Button variant="outlined" onClick={() => navigate('/explore')}>
            Explore
          </Button>
          <Button variant="outlined" color="success" onClick={() => navigate('/match')}>
            Find Matches
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/inbox')}>
            Inbox
          </Button>
        </Stack>

        <Typography variant="h5" gutterBottom>
          Your Trips
        </Typography>

        {trips.length === 0 ? (
          <Typography>No trips created yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {trips.map((trip) => (
              <Paper key={trip._id} elevation={2} sx={{ padding: 2 }}>
                <Typography variant="h6">{trip.destination}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
                </Typography>
                {trip.travelType && (
                  <Typography variant="body2" fontStyle="italic">
                    {trip.travelType}
                  </Typography>
                )}
                {trip.description && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography>{trip.description}</Typography>
                  </>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};

export default Dashboard;