import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Box,
  Stack
} from '@mui/material';

const Match = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage only once
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    const user = stored?.user;
    if (!user?._id) {
      console.warn("❌ User not found, redirecting...");
      navigate('/login');
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchMatches = async () => {
      try {
        const res = await api.get(`/user/matches/${currentUser._id}`);
        setMatches(res.data);
      } catch (err) {
        console.error('❌ Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [currentUser]);

  const handleLike = async () => {
    try {
      const targetId = matches[currentIndex]._id;
      await api.post('/user/like', {
        userId: currentUser._id,
        targetId,
      });
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error('❌ Error liking user:', err);
    }
  };

  const handleSkip = async () => {
    try {
      const targetId = matches[currentIndex]._id;
      await api.post('/user/skip', {
        userId: currentUser._id,
        targetId,
      });
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error('❌ Error skipping user:', err);
    }
  };

  if (loading) return <Typography m={4}>Loading...</Typography>;

  if (!currentUser) return null;

  if (matches.length === 0 || currentIndex >= matches.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Button component={Link} to="/dashboard" variant="outlined" sx={{ mb: 2 }}>
          ← Back to Dashboard
        </Button>
        <Typography variant="h6">No more matches.</Typography>
      </Box>
    );
  }

  const match = matches[currentIndex];

  return (
    <Box mt={4} display="flex" flexDirection="column" alignItems="center">
      <Button component={Link} to="/dashboard" variant="outlined" sx={{ mb: 2 }}>
        ← Back to Dashboard
      </Button>

      <Typography variant="h5" gutterBottom>
        Potential Match
      </Typography>

      <Card sx={{ width: 300, textAlign: 'center', p: 2 }}>
        <CardContent>
          <Avatar
            sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
            src={match.profilePicture}
          >
            {match.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h6">{match.name}</Typography>
          <Typography variant="body2" color="text.secondary">{match.bio || "No bio"}</Typography>
          <Typography><strong>Gender:</strong> {match.gender || "N/A"}</Typography>
          <Typography><strong>Interests:</strong> {match.interests?.join(", ") || "N/A"}</Typography>
        </CardContent>

        <Stack direction="row" spacing={2} justifyContent="center" mt={2} mb={1}>
          <Button variant="contained" color="success" onClick={handleLike}>❤️ Like</Button>
          <Button variant="contained" color="error" onClick={handleSkip}>❌ Skip</Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default Match;