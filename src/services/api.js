import axios from "axios";

// Backend URL from env (Vercel will inject this)
const API_URL = import.meta.env.VITE_API_BASE || "https://backend-env.up.railway.app" || "http://backend-production-10c3.up.railway.app";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required for cookies
  headers: { "Content-Type": "application/json" },
});

// Add JWT token from localStorage dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper for file uploads
const buildFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key].forEach((item) => formData.append(key, item));
    } else if (data[key] != null) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

// ---------- USER API ----------
export const userApi = {
  register: (data) => api.post("/api/auth/user/register", data),
  login: (data) => api.post("/api/auth/user/login", data),
  logout: () => api.post("/api/auth/logout"),
  profile: () => api.get("/api/auth/user/profile"),
  updateProfile: (data) => api.put("/api/auth/user/profile", data),
};

// ---------- RESTAURANT API ----------
export const restaurantApi = {
  register: (data) =>
    api.post("/api/restaurant/register", buildFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  login: (data) => api.post("/api/restaurant/login", data),
  logout: () => api.post("/api/auth/logout"),
  profile: () => api.get("/api/restaurant/profile"),
  updateProfile: (data) =>
    api.put("/api/restaurant/profile", buildFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  toggleStatus: () => api.patch("/api/restaurant/toggle-status"),
};

// ---------- ADMIN API ----------
export const adminApi = {
  register: (data) => api.post("/api/auth/admin/register", data),
  login: (data) => api.post("/api/auth/admin/login", data),
  logout: () => api.post("/api/auth/logout"),
  profile: () => api.get("/api/auth/admin/profile"),
  pendingRestaurants: () => api.get("/api/admin/restaurants/pending"),
  approve: (_id) => api.put(`/api/admin/restaurants/${_id}/approve`),
  reject: (_id) => api.put(`/api/admin/restaurants/${_id}/reject`),
};

// ---------- MENU ITEM API ----------
export const menuItemApi = {
  getAll: (restaurantId) =>
    restaurantId
      ? api.get(`/api/menu-items/restaurant/${restaurantId}`)
      : api.get("/api/menu-items"),
  getById: (id) => api.get(`/api/menu-items/${id}`),
  create: (data) => api.post("/api/menu-items", data),
  update: (id, data) => api.put(`/api/menu-items/${id}`, data),
  delete: (id) => api.delete(`/api/menu-items/${id}`),
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  },
};

// ---------- ORDER API ----------
export const orderApi = {
  create: (data) => api.post("/api/orders", data),
  getAll: () => api.get("/api/orders"),
  getById: (id) => api.get(`/api/orders/${id}`),
  update: (id, data) => api.put(`/api/orders/${id}`, data),
  delete: (id) => api.delete(`/api/orders/${id}`),
};

// ---------- HEALTH CHECK ----------
export const healthCheck = () => api.get("/api/health");

export default api;
