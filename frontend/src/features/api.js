import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
console.log("API baseURL:", url);
const api = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Add request interceptor to include token from sessionStorage
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
