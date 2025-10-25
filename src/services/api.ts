import { Product, Order } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface CreateProductDto {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images?: string[];
  mainImage: string;
  features?: Record<string, string>;
  rating?: number;
  status?: 'published' | 'draft';
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  orderId?: string;
  data?: T;
}

interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

interface HealthCheckResponse {
  status: string;
  message: string;
}

interface StatsResponse {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders?: Order[];
  topProducts?: Product[];
}
async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries: number = 2
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${i + 1} failed:`, error);

      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  throw lastError || new Error('Failed to fetch');
}
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }

    const error: ApiError = {
      message: errorMessage,
      status: response.status,
    };
    
    throw error;
  }
  if (response.status === 204) {
    return {} as T;
  }
  try {
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return text as unknown as T;
    }
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error('Failed to parse response');
  }
}

export const api = {
  async getProducts(): Promise<Product[]> {
    try {
      console.log('🔄 Fetching products from:', `${API_URL}/products`);
      const response = await fetchWithRetry(`${API_URL}/products`);
      const data = await handleResponse<Product[]>(response);
      console.log('✅ Products fetched successfully:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      throw error;
    }
  },
  async getProduct(id: string): Promise<Product> {
    try {
      console.log('🔄 Fetching product:', id);
      const response = await fetchWithRetry(`${API_URL}/products/${id}`);
      const data = await handleResponse<Product>(response);
      console.log('✅ Product fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch product:', error);
      throw error;
    }
  },
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      console.log('🔄 Fetching product by slug:', slug);
      const response = await fetchWithRetry(`${API_URL}/products/slug/${slug}`);
      const data = await handleResponse<Product>(response);
      console.log('✅ Product fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch product by slug:', error);
      throw error;
    }
  },
  async createProduct(product: CreateProductDto): Promise<ApiResponse<Product>> {
    try {
      console.log('🔄 Creating product:', product);
      const response = await fetchWithRetry(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await handleResponse<ApiResponse<Product>>(response);
      console.log('✅ Product created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create product:', error);
      throw error;
    }
  },
  async updateProduct(id: string, product: Partial<CreateProductDto>): Promise<ApiResponse<Product>> {
    try {
      console.log('🔄 Updating product:', id, product);
      const response = await fetchWithRetry(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await handleResponse<ApiResponse<Product>>(response);
      console.log('✅ Product updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to update product:', error);
      throw error;
    }
  },
  async deleteProduct(id: string): Promise<ApiResponse> {
    try {
      console.log('🔄 Deleting product:', id);
      const response = await fetchWithRetry(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      const data = await handleResponse<ApiResponse>(response);
      console.log('✅ Product deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to delete product:', error);
      throw error;
    }
  },
  async createOrder(order: Order): Promise<ApiResponse<Order>> {
    try {
      console.log('🔄 Creating order:', order);
      const response = await fetchWithRetry(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await handleResponse<ApiResponse<Order>>(response);
      console.log('✅ Order created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      throw error;
    }
  },
  async getOrders(): Promise<Order[]> {
    try {
      console.log('🔄 Fetching orders');
      const response = await fetchWithRetry(`${API_URL}/orders`);
      const data = await handleResponse<Order[]>(response);
      console.log('✅ Orders fetched successfully:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error);
      throw error;
    }
  },
  async getOrder(id: string): Promise<Order> {
    try {
      console.log('🔄 Fetching order:', id);
      const response = await fetchWithRetry(`${API_URL}/orders/${id}`);
      const data = await handleResponse<Order>(response);
      console.log('✅ Order fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch order:', error);
      throw error;
    }
  },
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      console.log('🔄 Fetching user orders:', userId);
      const response = await fetchWithRetry(`${API_URL}/orders/user/${userId}`);
      const data = await handleResponse<Order[]>(response);
      console.log('✅ User orders fetched successfully:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch user orders:', error);
      throw error;
    }
  },
  async updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<ApiResponse<Order>> {
    try {
      console.log('🔄 Updating order status:', orderId, status);
      const response = await fetchWithRetry(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await handleResponse<ApiResponse<Order>>(response);
      console.log('✅ Order status updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
      throw error;
    }
  },
  async getStats(): Promise<StatsResponse> {
    try {
      console.log('🔄 Fetching stats');
      const response = await fetchWithRetry(`${API_URL}/stats`);
      const data = await handleResponse<StatsResponse>(response);
      console.log('✅ Stats fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch stats:', error);
      throw error;
    }
  },
  async searchProducts(query: string): Promise<Product[]> {
    try {
      console.log('🔄 Searching products:', query);
      const response = await fetchWithRetry(
        `${API_URL}/products/search?q=${encodeURIComponent(query)}`
      );
      const data = await handleResponse<Product[]>(response);
      console.log('✅ Search completed:', data.length, 'results');
      return data;
    } catch (error) {
      console.error('❌ Failed to search products:', error);
      throw error;
    }
  },
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('🔄 Fetching products by category:', category);
      const response = await fetchWithRetry(
        `${API_URL}/products/category/${encodeURIComponent(category)}`
      );
      const data = await handleResponse<Product[]>(response);
      console.log('✅ Products fetched successfully:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch products by category:', error);
      throw error;
    }
  },
  async testConnection(): Promise<HealthCheckResponse> {
    try {
      console.log('🔄 Testing API connection');
      const response = await fetchWithRetry(`${API_URL}/health`, {}, 1);
      const data = await handleResponse<HealthCheckResponse>(response);
      console.log('✅ API connection successful:', data);
      return data;
    } catch (error) {
      console.error('❌ API connection failed:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  },
};
export type { 
  CreateProductDto, 
  ApiResponse, 
  ApiError, 
  HealthCheckResponse,
  StatsResponse 
};
