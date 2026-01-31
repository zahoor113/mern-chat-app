const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app); // Create HTTP server
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your frontend
    methods: ['GET', 'POST']
  }
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  // Receive new message from sender
  socket.on('sendMessage', (data) => {
    console.log('Message received via socket:', data);

    // Emit message to the receiver
    if (data.receiverUsername) {
      io.emit(`privateMessage:${data.receiverUsername}`, data);
    } else {
      io.emit('broadcastMessage', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  })
  .catch(err => console.error('MongoDB connection failed:', err));