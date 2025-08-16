// frontend/src/api/axiosConfig.jsx
import axios from "axios";

// Read base from env; always end with a trailing slash.
const BASE =
  (process.env.REACT_APP_API_BASE || "http://localhost:5001/api").replace(/\/?$/, "/");

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  withCredentials: true,
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → force login
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
