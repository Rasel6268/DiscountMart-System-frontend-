import api from "@/config/api";

export const categoryApi = {
  // Create main category
  async createMainCategory(data) {
    const response = await api.post(`/categories/main`, data);
    return response.data;
  },

  // Create subcategory
  async createSubCategory(parentId, data) {
    const response = await api.post(`/categories/sub/${parentId}`, data);
    return response.data;
  },

  // Get all categories
  async getAllCategories() {
    const response = await api.get(`/categories`);
    return response.data;
  },

  // Get single category
  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get main categories
  async getMainCategories() {
    const response = await api.get(`/categories/main`);
    return response.data;
  },

  // Update category
  async updateCategory(id, data) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};