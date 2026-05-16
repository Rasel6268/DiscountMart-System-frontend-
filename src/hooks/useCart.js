import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

// Helper function to generate unique key for cart items (handles sizes)
const getItemKey = (item) => {
  if (item.size) {
    return `${item.productId}_${item.size.name}_${item.size.type || ''}`;
  }
  return item.productId;
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: async (product) => {
        const currentItems = get().items;
        const itemKey = product.size ? 
          `${product.productId}_${product.size.name}_${product.size.type || ''}` : 
          product.productId;
        
        const existingItem = currentItems.find(item => getItemKey(item) === itemKey);

        if (existingItem) {
          // Update quantity if item already exists
          const newQuantity = existingItem.quantity + (product.quantity || 1);
          get().updateQuantity(existingItem.productId, newQuantity, product.size);
          return { success: true, message: 'Cart updated successfully' };
        } else {
          // Add new item with size information
          const newItem = { 
            ...product, 
            quantity: product.quantity || 1,
            addedAt: new Date().toISOString(),
            // Store size info separately for easy access
            size: product.size || null,
            sizeLabel: product.size ? `${product.size.name}${product.size.type ? ` (${product.size.type})` : ''}` : null
          };
          set({ items: [...currentItems, newItem] });
        }
        
        // Optional: Sync with backend
        try {
          await axios.post('/api/cart/add', {
            ...product,
            quantity: product.quantity || 1
          });
        } catch (error) {
          console.error('Failed to sync cart with backend', error);
        }
        
        return { success: true, message: 'Product added to cart' };
      },
      
      removeFromCart: (productId, size = null) => {
        if (size) {
          // Remove specific size variant
          set({ 
            items: get().items.filter(item => 
              !(item.productId === productId && 
                item.size?.name === size.name &&
                item.size?.type === size.type)
            ) 
          });
        } else {
          // Remove all variants of this product
          set({ items: get().items.filter(item => item.productId !== productId) });
        }
      },
      
      updateQuantity: (productId, quantity, size = null) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size);
        } else {
          set({
            items: get().items.map(item => {
              // Check if we're updating a specific size variant
              const matchesProduct = item.productId === productId;
              const matchesSize = !size || (
                item.size?.name === size.name &&
                item.size?.type === size.type
              );
              
              if (matchesProduct && matchesSize) {
                return { ...item, quantity };
              }
              return item;
            }),
          });
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      
      isInCart: (productId, size = null) => {
        if (size) {
          return get().items.some(item => 
            item.productId === productId && 
            item.size?.name === size.name &&
            item.size?.type === size.type
          );
        }
        return get().items.some(item => item.productId === productId);
      },
      
      getCartItemBySize: (productId, size) => {
        return get().items.find(item => 
          item.productId === productId && 
          item.size?.name === size.name &&
          item.size?.type === size.type
        );
      },
      
      getCartSummary: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Calculate shipping (example logic - can be customized)
        const shipping = subtotal > 500 ? 0 : 50;
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + shipping + tax;
        
        return {
          subtotal,
          shipping,
          tax,
          total,
          totalItems,
          itemCount: items.length
        };
      },
      
      // Group items by product (useful for display)
      getGroupedItems: () => {
        const items = get().items;
        const grouped = {};
        
        items.forEach(item => {
          if (!grouped[item.productId]) {
            grouped[item.productId] = {
              productId: item.productId,
              name: item.name,
              variants: [],
              totalQuantity: 0,
              totalPrice: 0
            };
          }
          
          grouped[item.productId].variants.push(item);
          grouped[item.productId].totalQuantity += item.quantity;
          grouped[item.productId].totalPrice += item.price * item.quantity;
        });
        
        return Object.values(grouped);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items.map(item => ({
          ...item,
          // Store only serializable data
          addedAt: item.addedAt,
          size: item.size // Size is serializable
        }))
      })
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
    getCartSummary,
    getGroupedItems,
    getCartItemBySize,
  } = useCartStore();

  // Helper function to get display name with size
  const getItemDisplayName = (item) => {
    if (item.size) {
      return `${item.name} (Size: ${item.size.name}${item.size.type ? ` - ${item.size.type}` : ''})`;
    }
    return item.name;
  };

  // Get all cart items with display names
  const getCartItemsWithDisplay = () => {
    return items.map(item => ({
      ...item,
      displayName: getItemDisplayName(item),
      sizeLabel: item.size ? `${item.size.name}${item.size.extraPrice > 0 ? ` (+${item.size.extraPrice})` : ''}` : null
    }));
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getCartSummary,
    getGroupedItems,
    getCartItemBySize,
    getItemDisplayName,
    getCartItemsWithDisplay,
  };
};