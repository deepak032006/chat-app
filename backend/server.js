// server.js (or index.js)
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const passport = require('passport');
const User = require('./modals/auth.modal.js');
require('dotenv').config();
require('./config/passport.js');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.router.js');
const messageRoutes = require('./routes/messageRoutes.js');
const UserRouters = require('./routes/User.router.js');

const app = express();
connectDB();

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', UserRouters);

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
  console.log('✅ User connected:', socket.id);

  
  socket.on('ping_server', () => {

  });

  socket.on('join', async (username) => {
    if (!username) return;

    socket.username = username;

    let user = await User.findOne({ username });
    if (!user) return;

    const existingUser = users.find((u) => u.username === username);

    const userInfo = {
      username,
      socketId: socket.id,
      isOnline: true,
      avatar: user.avatar,
    };

    if (!existingUser) {
      users.push(userInfo);
    } else {
      existingUser.socketId = socket.id;
      existingUser.isOnline = true;
      existingUser.avatar = user.avatar;
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

  socket.on('get_users', () => {
    io.emit('users_list', users);
  });

  
  socket.on('error', (err) => {
    console.error('⚠️ Socket error:', err);
  });

 
  socket.on('disconnect', () => {
    console.log('⚠️ Disconnect detected:', socket.id);

    setTimeout(() => {
      const stillDisconnected = !io.sockets.sockets.get(socket.id);
      if (stillDisconnected) {
        users = users.filter((u) => u.socketId !== socket.id);
        io.emit('users_list', users);
        console.log('❌ User removed after disconnect:', socket.id);
      }
    }, 5000);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
