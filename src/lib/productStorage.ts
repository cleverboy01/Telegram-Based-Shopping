import { Product } from '@/types';

const PRODUCTS_KEY = 'products';
const LAST_SYNC_KEY = 'products_last_sync';

export const productStorage = {
  getAll: (): Product[] => {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting products from localStorage:', error);
      return [];
    }
  },
  getPublished: (): Product[] => {
    const all = productStorage.getAll();
    return all.filter(p => p.status === 'published');
  },
  getById: (id: string): Product | null => {
    const products = productStorage.getAll();
    return products.find(p => p.id === id) || null;
  },
  getBySlug: (slug: string): Product | null => {
    const products = productStorage.getAll();
    return products.find(p => p.slug === slug) || null;
  },
  save: (product: Product): void => {
    try {
      const products = productStorage.getAll();
      const index = products.findIndex(p => p.id === product.id);
      
      if (index >= 0) {
        products[index] = product;
      } else {
        products.push(product);
      }
      
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      productStorage.updateLastSync();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  },
  saveAll: (products: Product[]): void => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      productStorage.updateLastSync();
    } catch (error) {
      console.error('Error saving products:', error);
    }
  },
  delete: (id: string): void => {
    try {
      const products = productStorage.getAll().filter(p => p.id !== id);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      productStorage.updateLastSync();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  },
  initialize: (initialProducts: Product[]): void => {
    const existing = localStorage.getItem(PRODUCTS_KEY);
    if (!existing) {
      productStorage.saveAll(initialProducts);
    }
  },
  clear: (): void => {
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  },
  updateLastSync: (): void => {
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  },
  getLastSync: (): Date | null => {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    return lastSync ? new Date(lastSync) : null;
  },
  needsSync: (maxAgeMinutes: number = 5): boolean => {
    const lastSync = productStorage.getLastSync();
    if (!lastSync) return true;
    
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    
    return diffMinutes > maxAgeMinutes;
  }
};
