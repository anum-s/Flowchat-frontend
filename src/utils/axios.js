import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// for attach token to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("FlowChat");
  const token = stored ? JSON.parse(stored).token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
