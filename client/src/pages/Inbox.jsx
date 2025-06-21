import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Stack,
  Divider
} from '@mui/material';

const Inbox = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentUser = storedUser?.user || storedUser; // support both structures

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchContacts = async () => {
      try {
        const res = await api.get(`/messages/contacts/${currentUser._id}`);
        setContacts(res.data);
      } catch (err) {
        console.error('❌ Error fetching chat contacts:', err);
      }
    };

    fetchContacts();
  }, [currentUser]);

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 600, px: 2 }}>
      <Box textAlign="center" mb={3}>
        <Button component={Link} to="/dashboard" variant="outlined">
          ← Back to Dashboard
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom textAlign="center">
        Your Chats
      </Typography>

      {contacts.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          You haven’t chatted with anyone yet.
        </Typography>
      ) : (
        <List>
          {contacts.map((user, index) => (
            <React.Fragment key={user._id}>
              <ListItem
                secondaryAction={
                  <Button
                    variant="contained"
                    size="small"
                    component={Link}
                    to={`/chat/${user._id}`}
                  >
                    Chat
                  </Button>
                }
              >
                <ListItemText
                  primary={user.name}
                  secondary={user.email || 'No email available'}
                />
              </ListItem>
              {index < contacts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Inbox;