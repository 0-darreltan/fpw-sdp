import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: url,
  //   withCredentials: true, // untuk nanti  mainan auth dengan httponly cookies
});

export default api;
