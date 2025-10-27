import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


const api = axios.create({
  baseURL: API_URL, // backend URL
  withCredentials: true, // keep cookies for restaurant login
  headers: {
    "Content-Type": "application/json", // required
  },
});




// Interceptor to add JWT token from localStorage dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to build FormData for file uploads
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

// ----- USER ROUTES -----
export const userApi = {
  register: (data) => api.post("/api/auth/user/register", data),
  login: (data) => api.post("/api/auth/user/login", data),
  logout: () => api.post("/api/auth/logout"),
  profile: () => api.get("/api/auth/user/profile"),
  updateProfile: (data) => api.put("/api/auth/user/profile", data),
};

// ----- RESTAURANT ROUTES -----
export const restaurantApi = {
  register: (data) => api.post("/api/restaurant/register", buildFormData(data), { headers: { "Content-Type": "multipart/form-data" } }),
  login: (data) => api.post("/api/restaurant/login", data),
  logout: () => api.post("/api/auth/logout"),
  profile: () => api.get("/api/restaurant/profile"), // token handled by interceptor
  updateProfile: (data) => api.put("/api/restaurant/profile", buildFormData(data), { headers: { "Content-Type": "multipart/form-data" } }),
  toggleStatus: () => api.patch("/api/restaurant/toggle-status"),
};


// ----- ADMIN ROUTES -----
export const adminApi = {
  register: (data) => api.post("/api/auth/admin/register", data),
  login: (data) => api.post("/api/auth/admin/login", data),
  logout: () => api.post("/api/auth/logout"),
  profile: () => api.get("/api/auth/admin/profile"),
  pendingRestaurants: () => api.get("/api/admin/restaurants/pending"),
  approve: (_id) => api.put(`/api/admin/restaurants/${_id}/approve`),
  reject: (_id) => api.put(`/api/admin/restaurants/${_id}/reject`),
};

// ----- MENU ITEM ROUTES -----
export const menuItemApi = {
  // 🔹 Fetch all items, or items of a specific restaurant
  getAll: (restaurantId) => {
    if (restaurantId) {
      return api.get(`/api/menu-items/restaurant/${restaurantId}`);
    }
    return api.get("/api/menu-items");
  },

  // 🔹 Fetch single menu item by ID
  getById: (id) => api.get(`/api/menu-items/${id}`),

  // 🔹 Create a new menu item
  create: (data) => api.post("/api/menu-items", data),

  // 🔹 Update a menu item
  update: (id, data) => api.put(`/api/menu-items/${id}`, data),

  // 🔹 Delete a menu item
  delete: (id) => api.delete(`/api/menu-items/${id}`),

  // ✅ NEW: Upload image to Cloudinary
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Backend should return { success: true, url: "cloudinary_url" }
    return res.data.url;
  },
};

// ----- ORDER ROUTES -----
export const orderApi = {
  create: (data) => api.post("/api/orders", data),
  getAll: () => api.get("/api/orders"),
  getById: (id) => api.get(`/api/orders/${id}`),
  update: (id, data) => api.put(`/api/orders/${id}`, data),
  delete: (id) => api.delete(`/api/orders/${id}`),
};

// ----- HEALTH CHECK -----
export const healthCheck = () => api.get("/api/health");

export default api;
