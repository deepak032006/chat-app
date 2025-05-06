import { io } from "socket.io-client";

const socket = io("https://chat-app-22-z9h4.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: true,
});

export default socket;
