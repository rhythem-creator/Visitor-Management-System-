// frontend/src/api/axiosConfig.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "16.176.11.91:5001/api", // your backend base
  timeout: 10000,
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// if auth fails, you can redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
