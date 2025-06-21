import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CreateTrip = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [tripData, setTripData] = useState({
    userId: user?.user?._id || user?.user?.id,  // safer fallback
    destination: '',
    startDate: '',
    endDate: '',
    interests: '',
    travelType: '',
    description: ''
  });

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...tripData,
        interests: tripData.interests.split(',').map((i) => i.trim())
      };
      const res = await api.post('/trips', payload);
      alert('🎉 Trip created successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Error creating trip');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Button component={Link} to="/dashboard" variant="outlined" sx={{ mb: 2 }}>
        ← Back to Dashboard
      </Button>
      <Typography variant="h4" gutterBottom>
        Create New Trip
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            name="destination"
            label="Destination"
            value={tripData.destination}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={tripData.startDate}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={tripData.endDate}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="interests"
            label="Interests (comma separated)"
            value={tripData.interests}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="travelType"
            label="Travel Type (e.g. Adventure, Leisure)"
            value={tripData.travelType}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="description"
            label="Trip Description"
            value={tripData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Save Trip
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default CreateTrip;