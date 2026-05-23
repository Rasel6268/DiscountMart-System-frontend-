"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productApi } from "@/services/productApi";

// ================== QUERIES ==================

// 🔹 Get all products with filters
export const useProducts = (filters = {}) => {
  // Remove undefined or empty values from filters
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => 
      value !== undefined && value !== null && value !== ''
    )
  );

  return useQuery({
    queryKey: ["products", cleanFilters],
    queryFn: async () => {
      const res = await productApi.getAllProducts(cleanFilters);
      // Handle different response structures
      if (res.data && res.pagination) {
        return {
          data: res.data,
          pagination: res.pagination,
          success: res.success
        };
      }
      return {
        data: res.data || [],
        pagination: res.pagination || { total: 0, page: 1, limit: 12, pages: 1 },
        success: res.success
      };
    },
    keepPreviousData: true,
    staleTime: 5000,
  });
};

// 🔹 Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await productApi.getProductById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

// 🔹 Get product colors
export const useProductColors = (productId) => {
  return useQuery({
    queryKey: ["product-colors", productId],
    queryFn: async () => {
      const res = await productApi.getProductColors(productId);
      return res.data;
    },
    enabled: !!productId,
  });
};

// 🔹 Get product sizes
export const useProductSizes = (productId) => {
  return useQuery({
    queryKey: ["product-sizes", productId],
    queryFn: async () => {
      const res = await productApi.getProductSizes(productId);
      return res.data;
    },
    enabled: !!productId,
  });
};

// ================== MUTATIONS ==================

// 🔹 Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.createProduct,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(res.message || res.data?.message || "Product created successfully!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to create product"
      );
    },
  });
};

// 🔹 Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productApi.updateProduct(id, data),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["product-colors", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["product-sizes", variables.id] });
      
      toast.success(res.message || res.data?.message || "Product updated successfully!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Update failed"
      );
    },
  });
};

// 🔹 Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteProduct,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(res.message || res.data?.message || "Product deleted successfully!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Delete failed"
      );
    },
  });
};

// ================== COLOR MUTATIONS ==================

// 🔹 Add color to product
export const useAddColorToProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, colorData }) => 
      productApi.addColorToProduct(productId, colorData),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product-colors", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      toast.success(res.message || "Color added successfully!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to add color"
      );
    },
  });
};

// 🔹 Update color quantity
export const useUpdateColorQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, colorId, quantity }) => 
      productApi.updateColorQuantity(productId, colorId, quantity),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product-colors", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      toast.success(res.message || "Color quantity updated!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to update color quantity"
      );
    },
  });
};

// 🔹 Remove color from product
export const useRemoveColorFromProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, colorId }) => 
      productApi.removeColorFromProduct(productId, colorId),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product-colors", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      toast.success(res.message || "Color removed successfully!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to remove color"
      );
    },
  });
};

// ================== SIZE MUTATIONS ==================

// 🔹 Add size to product
export const useAddSizeToProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, sizeData }) => 
      productApi.addSizeToProduct(productId, sizeData),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product-sizes", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      toast.success(res.message || "Size added successfully!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to add size"
      );
    },
  });
};

// 🔹 Update size quantity
export const useUpdateSizeQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, sizeName, quantity }) => 
      productApi.updateSizeQuantity(productId, sizeName, quantity),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product-sizes", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      toast.success(res.message || "Size quantity updated!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to update size quantity"
      );
    },
  });
};

// 🔹 Remove size from product
export const useRemoveSizeFromProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, sizeName }) => 
      productApi.removeSizeFromProduct(productId, sizeName),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product-sizes", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      toast.success(res.message || "Size removed successfully!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to remove size"
      );
    },
  });
};

// 🔹 Update stock (legacy)
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity, operation = 'set' }) => 
      productApi.updateStock(id, quantity, operation),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      toast.success(res.message || "Stock updated successfully!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to update stock"
      );
    },
  });
};