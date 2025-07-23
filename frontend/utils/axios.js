import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chat-app-25-m3vu.onrender.com/api", // Render URL + your API base path
  withCredentials: true, // Agar cookies/session use ho rahi ho
});

export default axiosInstance;
