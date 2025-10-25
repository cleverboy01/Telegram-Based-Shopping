import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getProduct: (productId: string) => Product | null;
  getCartTotal: () => number;
  getCartCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    }
  }, []);

  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    const storedCart = localStorage.getItem(cartKey);
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart:', error);
      }
    }
  }, [user]);

  const saveCart = (cartItems: CartItem[]) => {
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    setItems(cartItems);
  };

  const getProduct = (productId: string): Product | null => {
    return products.find(p => p.id === productId) || null;
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) return;

    const existingItem = items.find(item => item.productId === product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        alert(`موجودی کافی نیست. حداکثر ${product.stock} عدد موجود است`);
        return;
      }
      const updatedItems = items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );
      saveCart(updatedItems);
    } else {
      if (quantity > product.stock) {
        alert(`موجودی کافی نیست. حداکثر ${product.stock} عدد موجود است`);
        return;
      }
      const newItem: CartItem = {
        productId: product.id,
        quantity,
        price: product.price,
        discountPrice: product.discountPrice,
      };
      saveCart([...items, newItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedItems = items.filter(item => item.productId !== productId);
    saveCart(updatedItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = getProduct(productId);
    if (product && quantity > product.stock) {
      alert(`موجودی کافی نیست. حداکثر ${product.stock} عدد موجود است`);
      return;
    }
    
    const updatedItems = items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getDiscount = () => {
    return items.reduce((total, item) => {
      if (item.discountPrice) {
        return total + (item.price - item.discountPrice) * item.quantity;
      }
      return total;
    }, 0);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getProduct,
        getCartTotal,
        getCartCount,
        getSubtotal,
        getDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
