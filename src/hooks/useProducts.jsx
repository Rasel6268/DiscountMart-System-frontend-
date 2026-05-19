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
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 5000, // Consider data fresh for 5 seconds
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

// ================== MUTATIONS ==================

// 🔹 Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.createProduct,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(res.data?.message || "Product created!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || "Failed to create product"
      );
    },
  });
};

// 🔹 Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      productApi.updateProduct(id, data),

    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // refresh single product
      queryClient.invalidateQueries({
        queryKey: ["product", variables.id],
      });

      toast.success(res.data?.message || "Product updated!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || "Update failed"
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

      toast.success(res.data?.message || "Product deleted!");
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || "Delete failed"
      );
    },
  });
};