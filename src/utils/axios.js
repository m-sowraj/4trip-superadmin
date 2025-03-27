import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://10.57.1.17:8000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token_superadmin");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token_superadmin");
      localStorage.removeItem("id_superadmin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
