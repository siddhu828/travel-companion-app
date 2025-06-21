import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Stack,
  Paper,
} from '@mui/material';

const socket = io("http://localhost:5050");

const Chat = ({ contactId }) => {
  const userRaw = JSON.parse(localStorage.getItem('user'));
  const currentUser = {
    ...userRaw,
    _id: userRaw?._id || userRaw?.user?._id || userRaw?.user?.id || userRaw?.id,
  };

  const isValidUser = contactId && currentUser && currentUser._id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!contactId || !currentUser || !currentUser._id) {
      console.error("❌ Missing user info:", { contactId, currentUser });
    }
  }, [contactId, currentUser]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/messages/${currentUser._id}/${contactId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };

    if (contactId) fetchChat();

    socket.on('receive_message', (data) => {
      const isMatch =
        (data.senderId === currentUser._id && data.receiverId === contactId) ||
        (data.senderId === contactId && data.receiverId === currentUser._id);

      if (isMatch) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [contactId, currentUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      senderId: currentUser._id,
      receiverId: contactId,
      message: text,
    };

    try {
      await api.post('/messages/send', newMsg);
      socket.emit('send_message', newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setText('');
    } catch (err) {
      console.error("❌ Error sending message:", err.response?.data || err.message);
    }
  };

  if (!isValidUser) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">❌ Missing user info — check console.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button component={Link} to="/dashboard" variant="outlined" sx={{ mb: 2 }}>
        ← Back to Dashboard
      </Button>

      <Typography variant="h5" gutterBottom>
        Chat
      </Typography>

      <Paper
        elevation={3}
        sx={{
          height: 320,
          overflowY: 'auto',
          p: 2,
          background: '#f5f5f5',
          mb: 2,
          borderRadius: 2,
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={msg.senderId === currentUser._id ? 'flex-end' : 'flex-start'}
            mb={1}
          >
            <Box
              px={2}
              py={1}
              borderRadius={2}
              maxWidth="75%"
              bgcolor={msg.senderId === currentUser._id ? 'primary.main' : 'grey.300'}
              color={msg.senderId === currentUser._id ? 'white' : 'black'}
            >
              {msg.message}
            </Box>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Paper>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" color="success" onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Container>
  );
};

export default Chat;