import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, mobile: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isWarehouse: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const API_URL = 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
if (response.ok && data.success) {
        const userWithoutPassword = data.user;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
return { success: true };
      }

      return { success: false, error: data.error || 'ایمیل یا رمز عبور اشتباه است' };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'خطا در اتصال به سرور' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    mobile: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((u: User) => u.email === email)) {
        return { success: false, error: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است' };
      }

      if (users.some((u: User) => u.mobile === mobile)) {
        return { success: false, error: 'کاربری با این شماره موبایل قبلاً ثبت‌نام کرده است' };
      }

      const newUser: User & { password: string } = {
        id: crypto.randomUUID(),
        email,
        password,
        name,
        mobile,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'خطا در ثبت‌نام' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User & { password?: string }) => 
      u.id === user.id ? { ...u, ...updates } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
};

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';
  const isWarehouse = user?.role === 'warehouse';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin,
        isCustomer,
        isWarehouse,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
