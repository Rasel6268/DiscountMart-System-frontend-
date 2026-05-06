// hooks/useWishlist.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      
      // Add to wishlist
      addToWishlist: async (product) => {
        const { items } = get();
        
        // Check if already in wishlist
        if (items.some(item => item.productId === product.productId)) {
          return { success: false, message: 'Product already in wishlist' };
        }
        
        // Add to local state
        const newItem = {
          productId: product.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString(),
        };
        
        set({ items: [...items, newItem] });
        
        // Optional: Sync with backend
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await axios.post(
              '/api/wishlist/add',
              { productId: product.productId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        } catch (error) {
          console.error('Failed to sync wishlist with backend', error);
        }
        
        toast.success(`${product.name} added to wishlist`);
        return { success: true };
      },
      
      // Remove from wishlist
      removeFromWishlist: async (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
        
        // Optional: Sync with backend
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await axios.delete(`/api/wishlist/remove/${productId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        } catch (error) {
          console.error('Failed to sync wishlist removal with backend', error);
        }
        
        toast.success('Removed from wishlist');
        return { success: true };
      },
      
      // Check if product is in wishlist
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
      
      // Get wishlist item by product ID
      getWishlistItem: (productId) => {
        return get().items.find(item => item.productId === productId);
      },
      
      // Clear entire wishlist
      clearWishlist: async () => {
        set({ items: [] });
        
        // Optional: Sync with backend
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await axios.delete('/api/wishlist/clear', {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        } catch (error) {
          console.error('Failed to clear wishlist on backend', error);
        }
      },
      
      // Get wishlist count
      getWishlistCount: () => {
        return get().items.length;
      },
      
      // Fetch wishlist from backend (when user logs in)
      fetchWishlist: async () => {
        set({ loading: true });
        
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await axios.get('/api/wishlist', {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
              set({ items: response.data.data });
            }
          }
        } catch (error) {
          console.error('Failed to fetch wishlist from backend', error);
        } finally {
          set({ loading: false });
        }
      },
      
      // Toggle wishlist (add if not exists, remove if exists)
      toggleWishlist: async (product) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();
        
        if (isInWishlist(product.productId)) {
          return await removeFromWishlist(product.productId);
        } else {
          return await addToWishlist(product);
        }
      },
    }),
    {
      name: 'wishlist-storage', // unique name for localStorage
      getStorage: () => localStorage, // use localStorage
    }
  )
);

// Custom hook for easy access
export const useWishlist = () => {
  const {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistItem,
    clearWishlist,
    getWishlistCount,
    fetchWishlist,
    toggleWishlist,
  } = useWishlistStore();

  return {
    wishlistItems: items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistItem,
    clearWishlist,
    getWishlistCount,
    fetchWishlist,
    toggleWishlist,
  };
};