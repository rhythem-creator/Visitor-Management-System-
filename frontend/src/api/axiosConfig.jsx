// frontend/src/api/axiosConfig.jsx
import axios from "axios";

const BASE = (process.env.REACT_APP_API_BASE || "/api/").replace(/\/?$/, "/");

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
