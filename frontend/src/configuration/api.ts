// src/api/api.ts or wherever your api.ts is located
import axios from "axios";

const baseURL = import.meta.env.VITE_APP_API_HOST || "http://localhost:8080";
const apiVersion = import.meta.env.VITE_APP_API_VERSION || "1";

export const API_URL = `${baseURL}/api/v${apiVersion}`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
