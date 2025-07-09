import axios from "axios";

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL
});

// Handle request interceptor for authentication
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Check if the error is not from the login endpoint
      if (!error.config.url.includes('/auth/login')) {
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject({ message: 'Session expired. Please login again.' });
      }
    }
    return Promise.reject(error);
  }
);

const api = {
  // Load management
  getLoads: async () => {
    const res = await apiClient.get("/loads");
    return res.data;
  },
  createLoad: async (loadData) => {
    const res = await apiClient.post("/loads", loadData);
    return res.data;
  },
  updateLoad: async (id, loadData) => {
    const res = await apiClient.put(`/loads/${id}`, loadData);
    return res.data;
  },
  
  // Driver management
  getDrivers: async () => {
    const res = await apiClient.get("/drivers");
    return res.data;
  },
  createDriver: async (driverData) => {
    const res = await apiClient.post("/drivers", driverData);
    return res.data;
  },
  updateDriver: async (id, driverData) => {
    const res = await apiClient.put(`/drivers/${id}`, driverData);
    return res.data;
  },
  
  // Truck management
  getTrucks: async () => {
    const res = await apiClient.get("/trucks");
    return res.data;
  },
  createTruck: async (truckData) => {
    const res = await apiClient.post("/trucks", truckData);
    return res.data;
  },
  updateTruck: async (id, truckData) => {
    const res = await apiClient.put(`/trucks/${id}`, truckData);
    return res.data;
  },
  
  // Authentication
  login: async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await apiClient.post("/auth/register", userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },
  
  // Rate confirmation
  parseRateConfirmation: async (formData) => {
    const res = await apiClient.post("/rate-confirmation/upload", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  createLoadFromRateConfirmation: async (formData) => {
    const res = await apiClient.post("/rate-confirmation/create-load", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  
  // Invoice management
  generateInvoice: async (loadId) => {
    // This will return a PDF file, so we need to handle it differently
    window.open(`${API_URL}/invoices/${loadId}`, '_blank');
  },
  generateCustomInvoice: async (loadId, customData) => {
    // This will return a PDF file, so we need to handle it differently
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${API_URL}/invoices/${loadId}`;
    form.target = '_blank';
    
    // Add the token as a hidden field
    const tokenField = document.createElement('input');
    tokenField.type = 'hidden';
    tokenField.name = 'token';
    tokenField.value = localStorage.getItem('token');
    form.appendChild(tokenField);
    
    // Add the custom data as a hidden field
    const dataField = document.createElement('input');
    dataField.type = 'hidden';
    dataField.name = 'data';
    dataField.value = JSON.stringify(customData);
    form.appendChild(dataField);
    
    // Submit the form
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  },

  // Delete endpoints
  deleteLoad: async (id) => {
    const res = await apiClient.delete(`/loads/${id}`);
    return res.data;
  },
  deleteDriver: async (id) => {
    const res = await apiClient.delete(`/drivers/${id}`);
    return res.data;
  },
  deleteTruck: async (id) => {
    const res = await apiClient.delete(`/trucks/${id}`);
    return res.data;
  },
  
  // Document management
  uploadDocument: async (loadId, formData) => {
    const res = await apiClient.post(`/loads/${loadId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getLoadDocuments: async (loadId) => {
    const res = await apiClient.get(`/loads/${loadId}/documents`);
    return res.data;
  },
  deleteDocument: async (loadId, documentId) => {
    const res = await apiClient.delete(`/loads/${loadId}/documents/${documentId}`);
    return res.data;
  },
  
  // Broker portal
  getBrokerLoads: async () => {
    const res = await axios.get(`${API_URL}/broker/loads`);
    return res.data;
  },
  getBrokerLoad: async (id) => {
    const res = await axios.get(`${API_URL}/broker/loads/${id}`);
    return res.data;
  },
  requestLoadUpdate: async (id) => {
    const res = await axios.post(`${API_URL}/broker/loads/${id}/request-update`);
    return res.data;
  },
  
  // Delete operations
  deleteLoad: async (id) => {
    const res = await apiClient.delete(`/loads/${id}`);
    return res.data;
  },
  deleteDriver: async (id) => {
    const res = await apiClient.delete(`/drivers/${id}`);
    return res.data;
  },
  deleteTruck: async (id) => {
    const res = await apiClient.delete(`/trucks/${id}`);
    return res.data;
  },
  
  // ELD data
  getEldData: async () => {
    const res = await apiClient.get("/eld");
    return res.data;
  },
  
  // Helper methods
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }
};

export default api;
