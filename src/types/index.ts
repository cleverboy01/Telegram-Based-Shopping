export type UserRole = 'customer' | 'admin' | 'warehouse';

export interface User {
  id: string;
  email: string;
  mobile: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  title: string;
  fullName: string;
  mobile: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  brand: string;
  category: string;
  categoryEn: string;
  subCategory: string;
  subCategoryEn: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  stock: number;
  images: string[];
  mainImage: string;
  features: Record<string, string>;
  featuresEn: Record<string, string>;
  colors?: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  discountPrice?: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  shippingAddress: Address;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  discountPrice?: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'preparing' 
  | 'shipped' 
  | 'in_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 'online' | 'cash_on_delivery' | 'wallet' | 'installment';
export type ShippingMethod = 'standard' | 'fast' | 'express';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}
