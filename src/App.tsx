import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { SettingsProvider } from '@/contexts/SettingsContext'; // new context for site settings
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';

import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

import Dashboard from '@/pages/Dashboard';
import CartPage from '@/pages/CartPage';
import WishlistPage from '@/pages/Wishlist';
import OrdersPage from '@/pages/OrdersPage';
import CheckoutPage from '@/pages/CheckoutPage';

import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminOrders from '@/pages/AdminOrders';
import AdminUsers from '@/pages/AdminUsers';
import AdminSettings from '@/pages/AdminSettings'; // finally made this page lol

import WarehouseDashboard from '@/pages/WarehouseDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // annoying when it refetches on every tab switch
      retry: 1, // one retry is enough
      staleTime: 5 * 60 * 1000, // cache for 5 mins
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {}
      <SettingsProvider>
        {}
        <AuthProvider>
          {}
          <CartProvider>
            <WishlistProvider>
              <Router>
                <Routes>
                  {}
                  <Route path="/" element={<Layout />}>
                    
                    {}
                    <Route index element={<HomePage />} />
                    <Route path="products" element={<ProductsPage />} />
                    {}
                    <Route path="products/:slug" element={<ProductDetailPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />

                    {}
                    {}
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute>
                          <RoleProtectedRoute allowedRoles={['customer']}>
                            <Dashboard />
                          </RoleProtectedRoute>
                        </ProtectedRoute>
                      }
                    />
                    {}
                    <Route
                      path="cart"
                      element={
                        <ProtectedRoute>
                          <CartPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="wishlist"
                      element={
                        <ProtectedRoute>
                          <WishlistPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="orders"
                      element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />

                    {}
                    {}
                    <Route
                      path="admin/dashboard"
                      element={
                        <ProtectedRoute>
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </RoleProtectedRoute>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="admin/products"
                      element={
                        <ProtectedRoute>
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <AdminProducts />
                          </RoleProtectedRoute>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="admin/orders"
                      element={
                        <ProtectedRoute>
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <AdminOrders />
                          </RoleProtectedRoute>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="admin/users"
                      element={
                        <ProtectedRoute>
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <AdminUsers />
                          </RoleProtectedRoute>
                        </ProtectedRoute>
                      }
                    />
                    {}
                    <Route
                      path="admin/settings"
                      element={
                        <ProtectedRoute>
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <AdminSettings />
                          </RoleProtectedRoute>
                        </ProtectedRoute>
                      }
                    />

                    {}
                    {}
                    <Route
                      path="warehouse/dashboard"
                      element={
                        <ProtectedRoute>
                          <RoleProtectedRoute allowedRoles={['warehouse']}>
                            <WarehouseDashboard />
                          </RoleProtectedRoute>
                        </ProtectedRoute>
                      }
                    />

                    {}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </Router>
              {}
              <Toaster position="top-center" richColors />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
