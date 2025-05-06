import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chat-app-22-z9h4.onrender.com/api", // Render URL + your API base path
  withCredentials: true, // Agar cookies/session use ho rahi ho
});

export default axiosInstance;
