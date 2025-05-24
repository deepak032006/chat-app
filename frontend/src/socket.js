import { io } from "socket.io-client";

const socket = io("https://chat-app-23-2tzv.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: true,
});

export default socket;
