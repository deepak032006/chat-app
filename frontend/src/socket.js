import { io } from "socket.io-client";

const socket = io("https://chat-app-25-m3vu.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});


setInterval(() => {
  if (socket.connected) {
    socket.emit('ping_server');
  }
}, 30000); 

export default socket;
