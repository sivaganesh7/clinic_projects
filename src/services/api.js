import axios from "axios";

/**
 * Centralized Axios instance for MediTrack-Lite
 * Automatically injects JWT Bearer tokens and handles response errors
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically inject doctor or patient token
api.interceptors.request.use(
  (config) => {
    const patientToken = localStorage.getItem("patientToken");
    const doctorToken = localStorage.getItem("token");
    const token = patientToken || doctorToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error logging / session handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔒 Unauthorized request - Session may have expired.");
    }
    return Promise.reject(error);
  }
);

export default api;
