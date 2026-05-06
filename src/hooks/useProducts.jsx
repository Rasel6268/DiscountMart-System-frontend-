"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productApi } from "@/services/productApi";

// ================== QUERIES ==================

// 🔹 Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await productApi.getAllProducts();
      return res.data || [];
     
    },
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