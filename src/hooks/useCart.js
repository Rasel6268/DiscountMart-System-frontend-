// hooks/useCart.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: async (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.productId === product.productId);

        if (existingItem) {
         return { success: false, message: 'Product is already in the cart' };
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
        
        // Optional: Sync with backend
        try {
          await axios.post('/api/cart/add', product);
        } catch (error) {
          console.error('Failed to sync cart with backend', error);
        }
        
        return { success: true };
      },
      removeFromCart: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
        } else {
          set({
            items: get().items.map(item =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      isInCart: (productId) => get().items.some(item => item.productId === productId),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useCart = () => {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  } = useCartStore();

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  };
};