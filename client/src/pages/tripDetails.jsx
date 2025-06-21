import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Stack
} from '@mui/material';

const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};

const TripDetails = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get(`/trips/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error("❌ Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTrips();
  }, [userId]);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Loading trips...</Typography>
      </Box>
    );
  }

  if (trips.length === 0) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography>No trips found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={2}>
        <Button component={Link} to="/dashboard" variant="outlined">
          ← Back to Dashboard
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Trip Details
      </Typography>

      <Stack spacing={3}>
        {trips.map((trip) => (
          <Card key={trip._id} elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {toSentenceCase(trip.destination)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
              </Typography>

              {trip.travelType && (
                <Chip
                  label={trip.travelType}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}

              <Divider sx={{ my: 2 }} />

              {trip.description && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Description:</strong> {trip.description}
                </Typography>
              )}

              {trip.interests?.length > 0 && (
                <Typography variant="body2">
                  <strong>Interests:</strong>{' '}
                  {trip.interests.map((i, idx) => (
                    <Chip
                      key={idx}
                      label={i}
                      size="small"
                      sx={{ mr: 0.5, mt: 0.5 }}
                    />
                  ))}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default TripDetails;