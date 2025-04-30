const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport.js'); // Google Strategy config

// Import routes
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.router.js');
const messageRoutes = require('./routes/messageRoutes.js');
const UserRouters = require('./routes/User.router.js');

const app = express();
connectDB();

// ===================================
// 🔐 Session & Passport Configuration
// ===================================
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// ============================
// Middleware Setup
// ============================
app.use(cors());
app.use(express.json());

// Public folders
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', UserRouters);

// =====================
// Socket.IO Setup Logic
// =====================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

let users = [];

io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    const existingUser = users.find((u) => u.username === username);
    if (!existingUser) {
      users.push({ username, socketId: socket.id, isOnline: true });
    } else {
      existingUser.socketId = socket.id;
      existingUser.isOnline = true;
    }
    io.emit('users_list', users);
  });

  socket.on('send_message', (message) => {
    const recipient = users.find((u) => u.username === message.to);
    if (recipient) {
      io.to(recipient.socketId).emit('receive_message', message);
    }
  });

  socket.on('typing', (data) => {
    const recipient = users.find((u) => u.username === data.to);
    if (recipient) {
      io.to(recipient.socketId).emit('typing', { sender: data.sender });
    }
  });

  socket.on('seen_messages', ({ from, to }) => {
    const sender = users.find((u) => u.username === from);
    if (sender) {
      io.to(sender.socketId).emit('messages_seen', { from: to });
    }
  });

  socket.on('disconnect', () => {
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit('users_list', users);
    console.log('❌ A user disconnected:', socket.id);
  });

  socket.on('get_users', () => {
    io.emit('users_list', users);
  });
});

// ================
// Start the Server
// ================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
