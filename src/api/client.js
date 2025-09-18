import axios from "axios";
import { auth } from "../firebaseConfig";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting auth token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      auth.signOut();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API methods
export const apiClient = {
  // Auth endpoints
  auth: {
    verifyToken: () => api.get("/api/auth"),
  },

  // User endpoints
  users: {
    getAll: () => api.get("/api/users"),
    create: (userData) => api.post("/api/users", userData),
    getById: (id) => api.get(`/api/users/${id}`),
    update: (id, userData) => api.put(`/api/users/${id}`, userData),
    delete: (id) => api.delete(`/api/users/${id}`),
    checkProfileCompletion: (id) => api.get(`/api/users/${id}/profile-status`),
  },

  // Products endpoints
  products: {
    getAll: (params = {}) => api.get("/api/products", { params }),
    create: (productData) => api.post("/api/products", productData),
    getById: (id) => api.get(`/api/products/${id}`),
    update: (id, productData) => api.put(`/api/products/${id}`, productData),
    delete: (id) => api.delete(`/api/products/${id}`),
    search: (query, filters = {}) =>
      api.get("/api/products/search", {
        params: { q: query, ...filters },
      }),
  },

  // Orders endpoints
  orders: {
    getAll: (params = {}) => api.get("/api/orders", { params }),
    create: (orderData) => api.post("/api/orders", orderData),
    getById: (id) => api.get(`/api/orders/${id}`),
    update: (id, orderData) => api.put(`/api/orders/${id}`, orderData),
    cancel: (id) => api.delete(`/api/orders/${id}`),
  },
};

export default api;
