import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:5000/api", // Render URL + your API base path
  withCredentials: true, // Agar cookies/session use ho rahi ho
});

export default axiosInstance;
