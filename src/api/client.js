import axios from "axios";

import { auth } from "../firebaseConfig";
import { API_BASE_URL } from "../utils/helpers";
import Login from "../features/auth/pages/Login";
import Marketplace from "../features/dashboard/pages/Marketplace";

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
    login: (mobile) => api.post("/api/auth/otp/login-whatsapp", { mobile }),
    verifyOtp: (mobile, otp) =>
      api.post("/api/auth/otp/verify-otp", { mobile, code: otp }),
  },

  // User endpoints
  users: {
    getAll: () => api.get("/api/users"),
    create: (userData) => api.post("/api/users", userData),
    getById: (id) => api.get(`/api/users/${id}`),
    update: (id, userData) => api.put(`/api/users/${id}`, userData),
    delete: (id) => api.delete(`/api/users/${id}`),
    checkProfileCompletion: (id) => api.get(`/api/users/${id}/profile-status`),
    getProfileStats: (id) => api.get(`/api/users/${id}/profile-stats`),
    onboardingComplete: (userData) =>
      api.post("/api/users/onboarding-complete/onboarding-complete", userData),
  },

  // Products endpoints
  marketplace: {
    getProducts: (params = {}) =>
      api.get("/api/marketplace/products", { params }), // Alias for getAll
  },
  products: {
    getAll: (params = {}) => api.get("/api/products", { params }),
    getProducts: (params = {}) => api.get("/api/products", { params }), // Alias for getAll
    create: (productData) => api.post("/api/products/create", productData),
    getById: (id) => api.get(`/api/products/${id}`),
    update: (id, productData) => api.put(`/api/products/${id}`, productData),
    delete: (id) => api.delete(`/api/products/${id}`),
    search: (query, filters = {}) =>
      api.get("/api/products/search", {
        params: { q: query, ...filters },
      }),
    getByUser(userId) {
      return api.get(`/api/products/my-products`);
    },
    // Get user's own products
    getMyProducts: () => api.get("/api/products/my-products"),
    // Get auction products
    getAuctions: (status = null) => {
      const params = { auction_live: true };
      if (status) params.status = status;
      return api.get("/api/auctions", { params });
    },
    // Get marketplace products
    getMarketplace: () =>
      api.get("/api/products", { params: { auction_live: "false" } }),
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

export default apiClient;
