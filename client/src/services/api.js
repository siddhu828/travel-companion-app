import axios from 'axios';

const api = axios.create({
  baseURL: "https://travel-companion-app-1nns.onrender.com",
});

export default api;