import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Box
} from '@mui/material';

const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Explore = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    const id = stored?.user?._id || stored?.user?.id;
    if (id) {
      setCurrentUserId(id);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get(`/user/all?exclude=${currentUserId}`);
        setUsers(res.data);
      } catch (err) {
        console.error('❌ Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  return (
    <Box sx={{ p: 4 }}>
      <Box textAlign="center" mb={2}>
        <Button component={Link} to="/dashboard" variant="outlined">
          ← Back to Dashboard
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom textAlign="center">
        Explore Users
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {users.map((user) => (
          <Grid item key={user._id}>
            <Card
              sx={{
                height: 280,
                width: 240,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}
                  src={user.profilePicture}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant="h6" fontWeight="bold">
                  {toSentenceCase(user.name)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {user.bio || 'No bio yet'}
                </Typography>

                <Typography variant="body2">
                  <strong>Gender:</strong> {user.gender || 'N/A'}
                </Typography>

                <Typography variant="body2">
                  <strong>Age:</strong> {user.age || 'N/A'}
                </Typography>
              </CardContent>

              <Box textAlign="center">
                <Button
                  variant="contained"
                  size="small"
                  component={Link}
                  to={`/chat/${user._id}`}
                >
                  Chat
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Explore;