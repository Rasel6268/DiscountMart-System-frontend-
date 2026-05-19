import api from "@/config/api";

export const productApi = {
  // Create product
  async createProduct(data) {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Get all products with filters
  async getAllProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  async getProductBySlug(slug) {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Update product
  async updateProduct(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Update stock
  async updateStock(id, quantity, operation = 'set') {
    const response = await api.patch(`/products/${id}/stock`, { quantity, operation });
    return response.data;
  }
};