import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.discountstorebd.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;


export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getTree: () => api.get('/categories/tree'),
  getOne: (identifier) => api.get(`/categories/${identifier}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id, reassignTo) => api.delete(`/categories/${id}${reassignTo ? `?reassignTo=${reassignTo}` : ''}`),
  getBreadcrumb: (id) => api.get(`/categories/${id}/breadcrumb`),
  getDescendants: (id) => api.get(`/categories/${id}/descendants`),
};