import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'customer' | 'warehouse')[];
}

export default function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user } = useAuth();

  console.log('🔐 RoleProtectedRoute check:', { 
    userRole: user?.role, 
    allowedRoles, 
    isAllowed: user ? allowedRoles.includes(user.role as 'admin' | 'customer' | 'warehouse') : false 
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as 'admin' | 'customer' | 'warehouse')) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'warehouse') {
      return <Navigate to="/warehouse/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
