import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Settings,
  Bell,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Product, Order } from '@/types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<number>(0);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('all_orders');
    const savedUsers = localStorage.getItem('users');
    
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    }
    
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to parse orders:', error);
      }
    }

    if (savedUsers) {
      try {
        const usersList = JSON.parse(savedUsers);
        setUsers(usersList.length);
      } catch (error) {
        console.error('Failed to parse users:', error);
      }
    }
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  const todayOrders = orders.filter(o => {
    const today = new Date().toDateString();
    const orderDate = new Date(o.createdAt).toDateString();
    return orderDate === today;
  }).length;
  
  const activeProducts = products.filter(p => p.status === 'published' && p.stock > 0).length;

  const growthRate = {
    orders: '+12.5%',
    revenue: '+8.2%',
    users: '+15.3%',
    products: '+5.1%'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        
        {}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
                  <Activity className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 hover:bg-white/30 border-white/30">
                  مدیر سیستم
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                پنل مدیریت فروشگاه
              </h1>
              <p className="text-white/80 text-lg">
                خوش آمدید {user?.name} - کنترل کامل سیستم
              </p>
            </div>
            
            {}
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                اعلان‌ها
              </Button>
              <Link to="/admin/settings">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  تنظیمات
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {}
          <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-100 dark:bg-green-950 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-950">
                  {growthRate.revenue}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">درآمد کل</p>
              <p className="text-3xl font-bold text-green-600">
                {(totalRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                رشد نسبت به ماه قبل
              </p>
            </CardContent>
          </Card>

          {}
          <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950">
                  {growthRate.orders}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">سفارشات</p>
              <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {todayOrders} سفارش امروز
              </p>
            </CardContent>
          </Card>

          {}
          <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-xl">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950">
                  {growthRate.products}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">محصولات</p>
              <p className="text-3xl font-bold text-purple-600">{products.length}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {activeProducts} محصول فعال
              </p>
            </CardContent>
          </Card>

          {}
          <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-orange-100 dark:bg-orange-950 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950">
                  {growthRate.users}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">کاربران</p>
              <p className="text-3xl font-bold text-orange-600">{users}</p>
              <p className="text-xs text-muted-foreground mt-2">
                کاربران ثبت‌نام شده
              </p>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                مدیریت فروشگاه
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                
                {}
                <Link to="/admin/products">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-lg">
                    <Package className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-1">محصولات</h3>
                    <p className="text-sm opacity-90">مدیریت کامل</p>
                    <ArrowUpRight className="h-4 w-4 mt-2" />
                  </div>
                </Link>

                {}
                <Link to="/admin/orders">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-lg">
                    <ShoppingBag className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-1">سفارشات</h3>
                    <p className="text-sm opacity-90">پیگیری و مدیریت</p>
                    <ArrowUpRight className="h-4 w-4 mt-2" />
                  </div>
                </Link>

                {}
                <Link to="/admin/users">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-lg">
                    <Users className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-1">کاربران</h3>
                    <p className="text-sm opacity-90">مدیریت دسترسی</p>
                    <ArrowUpRight className="h-4 w-4 mt-2" />
                  </div>
                </Link>

                {}
                <Link to="/admin/analytics">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-lg">
                    <PieChart className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-1">تحلیل‌ها</h3>
                    <p className="text-sm opacity-90">گزارشات جامع</p>
                    <ArrowUpRight className="h-4 w-4 mt-2" />
                  </div>
                </Link>

                {}
                <Link to="/admin/settings">
                  <div className="bg-gradient-to-br from-slate-500 to-slate-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-lg">
                    <Settings className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-1">تنظیمات</h3>
                    <p className="text-sm opacity-90">پیکربندی سیستم</p>
                    <ArrowUpRight className="h-4 w-4 mt-2" />
                  </div>
                </Link>

                {}
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-lg">
                  <Bell className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-1">اعلان‌ها</h3>
                  <p className="text-sm opacity-90">پیام‌های سیستم</p>
                  <Badge className="bg-white text-pink-600 mt-2">جدید</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                فعالیت‌های اخیر
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {}
                {orders.slice(0, 6).map((order, idx) => (
                  <div key={order.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className={`p-2 rounded-lg ${
                      idx % 3 === 0 ? 'bg-blue-100 dark:bg-blue-950' :
                      idx % 3 === 1 ? 'bg-green-100 dark:bg-green-950' :
                      'bg-purple-100 dark:bg-purple-950'
                    }`}>
                      <ShoppingBag className={`h-4 w-4 ${
                        idx % 3 === 0 ? 'text-blue-600' :
                        idx % 3 === 1 ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">سفارش #{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    {}
                    <Badge variant="outline" className="text-xs">
                      {(order.total / 1000).toFixed(0)}K
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
