import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack
} from '@mui/material';
 
const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/profile/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return <Typography m={4}>Loading...</Typography>;

  return (
    <Box sx={{ p: 4 }} display="flex" flexDirection="column" alignItems="center">
      <Button
        component={Link}
        to="/dashboard"
        variant="outlined"
        sx={{ mb: 2 }}
      >
        ← Back to Dashboard
      </Button>

      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Avatar
            src={user.profilePicture}
            alt="Profile"
            sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h5" gutterBottom>
            {toSentenceCase(user.name)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Age:</strong> {user.age || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Gender:</strong> {user.gender || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Bio:</strong> {user.bio || 'No bio'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Interests:</strong> {user.interests?.join(', ') || 'None'}
          </Typography>

          <Stack mt={3}>
            <Button
              component={Link}
              to={`/chat/${user._id}`}
              variant="contained"
              color="primary"
            >
              Start Chat
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;