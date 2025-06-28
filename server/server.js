const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'https://travel-companion-app-ten.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use('/api/messages', require('./routes/message'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection failed:', err));

const PORT = process.env.PORT || 5050;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const tripRoutes = require('./routes/trip');
app.use('/api/trips', tripRoutes);

const adminRoutes = require('./routes/adminR');
app.use('/api/admin', adminRoutes);

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend
    methods: ["GET", "POST"]
  }
});

// Real-time socket connections
io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.id);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data); // broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});