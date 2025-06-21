import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Stack,
  Divider
} from '@mui/material';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};

const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const UserTrips = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get(`/trips/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error("❌ Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, [userId]);

  return (
    <Box sx={{ p: 4 }}>
      <Box textAlign="center" mb={3}>
        <Button component={Link} to="/dashboard" variant="outlined">
          ← Back to Dashboard
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom textAlign="center">
        User's Trips
      </Typography>

      {trips.length === 0 ? (
        <Typography align="center" mt={2}>
          No trips found for this user.
        </Typography>
      ) : (
        <Stack spacing={2} mt={3}>
          {trips.map((trip) => (
            <Card key={trip._id} elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {toSentenceCase(trip.destination)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  <strong>From:</strong> {formatDate(trip.startDate)} | <strong>To:</strong> {formatDate(trip.endDate)}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Travel Type:</strong> {trip.travelType || 'N/A'}
                </Typography>

                <Typography variant="body2">
                  <strong>Interests:</strong> {trip.interests.join(', ') || 'N/A'}
                </Typography>

                {trip.description && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography>{trip.description}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default UserTrips;