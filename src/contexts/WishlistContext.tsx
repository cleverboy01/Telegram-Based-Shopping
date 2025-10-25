import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const wishlistKey = `wishlist_${user.id}`;
      const stored = localStorage.getItem(wishlistKey);
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to parse wishlist:', error);
        }
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  const saveWishlist = (newWishlist: string[]) => {
    if (user) {
      const wishlistKey = `wishlist_${user.id}`;
      localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    }
  };

  const addToWishlist = (productId: string) => {
    if (!user) {
      toast.error('لطفاً ابتدا وارد شوید');
      return;
    }

    if (!wishlist.includes(productId)) {
      const newWishlist = [...wishlist, productId];
      saveWishlist(newWishlist);
      toast.success('به علاقه‌مندی‌ها اضافه شد');
    } else {
      toast.info('این محصول قبلاً به علاقه‌مندی‌ها اضافه شده است');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(id => id !== productId);
    saveWishlist(newWishlist);
    toast.success('از علاقه‌مندی‌ها حذف شد');
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    saveWishlist([]);
    toast.success('علاقه‌مندی‌ها پاک شد');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
