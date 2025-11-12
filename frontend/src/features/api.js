import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
console.log("API baseURL:", url);
const api = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
