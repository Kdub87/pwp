import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api"
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const api = {
  getLoads: async () => {
    const res = await apiClient.get("/loads");
    return res.data;
  },
  getDrivers: async () => {
    const res = await apiClient.get("/drivers");
    return res.data;
  },
  login: async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  }
};

export default api;
