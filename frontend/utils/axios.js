import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://chat-app-8-8zpp.onrender.com',
    withCredentials:true    
  });

  export default instance
