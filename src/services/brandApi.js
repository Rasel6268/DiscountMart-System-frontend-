import api from "@/config/api";

export const brandApi = {
  // Create brand
  async createBrand(data) {
    const response = await api.post('/brands', data);
    return response.data;
  },

  // Get all brands
  async getAllBrands() {
    const response = await api.get('/brands');
    return response.data;
  },

  // Get brand by ID
  async getBrandById(id) {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  // Get brand by slug
  async getBrandBySlug(slug) {
    const response = await api.get(`/brands/slug/${slug}`);
    return response.data;
  },

  // Update brand
  async updateBrand(id, data) {
    const response = await api.put(`/brands/${id}`, data);
    return response.data;
  },

  // Delete brand
  async deleteBrand(id) {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  }
};