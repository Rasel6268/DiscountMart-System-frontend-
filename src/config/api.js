import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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