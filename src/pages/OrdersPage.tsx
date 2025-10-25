import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Eye, Calendar } from 'lucide-react';
import { Order } from '@/types';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const savedOrders = localStorage.getItem(`orders_${user.id}`);
      if (savedOrders) {
        try {
          const ordersList = JSON.parse(savedOrders);
          ordersList.sort((a: Order, b: Order) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(ordersList);
        } catch (error) {
          console.error('Failed to parse orders:', error);
        }
      }
    }
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants: Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      paid: 'secondary',
      preparing: 'secondary',
      shipped: 'default',
      in_delivery: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    };
    return variants[status] || 'outline';
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels: Record<Order['status'], string> = {
      pending: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      preparing: 'در حال آماده‌سازی',
      shipped: 'ارسال شده',
      in_delivery: 'در حال تحویل',
      delivered: 'تحویل داده شده',
      cancelled: 'لغو شده',
    };
    return labels[status] || status;
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
            <p className="text-muted-foreground mb-6">
              برای مشاهده سفارشات، ابتدا خریدی انجام دهید
            </p>
            <Link to="/products">
              <Button>شروع خرید</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">سفارشات من ({orders.length})</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-muted/30 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg mb-1">
                      سفارش #{order.orderNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={getStatusBadge(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {order.items.length} محصول
                    </p>
                    <p className="text-lg font-bold">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="outline" className="gap-2">
                      <Eye className="h-4 w-4" />
                      جزئیات
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
