import { Order } from '@/types';

const ORDERS_KEY = 'ecommerce_orders';

export const orderStorage = {
  getAll: (): Order[] => {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getByUserId: (userId: string): Order[] => {
    return orderStorage.getAll().filter(order => order.userId === userId);
  },

  getById: (id: string): Order | null => {
    const orders = orderStorage.getAll();
    return orders.find(o => o.id === id) || null;
  },

  save: (order: Order): void => {
    const orders = orderStorage.getAll();
    const index = orders.findIndex(o => o.id === order.id);
    
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.push(order);
    }
    
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  getTotalSpent: (userId: string): number => {
    const orders = orderStorage.getByUserId(userId);
    return orders
      .filter(o => o.status === 'delivered' || o.status === 'paid')
      .reduce((total, order) => total + order.total, 0);
  },
};
