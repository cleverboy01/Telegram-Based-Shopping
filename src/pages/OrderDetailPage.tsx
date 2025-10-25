import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  Package, 
  MapPin, 
  User, 
  Phone, 
  Calendar,
  CreditCard,
  Truck
} from 'lucide-react';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user && id) {
      const savedOrders = localStorage.getItem(`orders_${user.id}`);
      if (savedOrders) {
        try {
          const ordersList: Order[] = JSON.parse(savedOrders);
          const foundOrder = ordersList.find(o => o.id === id);
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            navigate('/orders');
          }
        } catch (error) {
          console.error('Failed to parse orders:', error);
          navigate('/orders');
        }
      }
    }
  }, [user, id, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

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

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      online: 'پرداخت آنلاین',
      cash_on_delivery: 'پرداخت در محل',
      wallet: 'کیف پول',
      installment: 'اقساطی',
    };
    return labels[method] || method;
  };

  const getShippingMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      standard: 'عادی',
      fast: 'سریع',
      express: 'فوری',
    };
    return labels[method] || method;
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/orders')}
          className="mb-6 gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به سفارشات
        </Button>

        <Card className="mb-6">
          <CardHeader className="bg-muted/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">
                  سفارش #{order.orderNumber}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {order.trackingCode && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Truck className="h-4 w-4" />
                    <span>کد رهگیری: {order.trackingCode}</span>
                  </div>
                )}
              </div>
              <Badge variant={getStatusBadge(order.status)} className="text-base py-2 px-4">
                {getStatusLabel(order.status)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  محصولات سفارش
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        تعداد: {item.quantity}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.discountPrice ? (
                          <>
                            <span className="font-semibold text-green-600">
                              {formatPrice(item.discountPrice * item.quantity)}
                            </span>
                            <span className="text-sm line-through text-muted-foreground">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  آدرس تحویل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.shippingAddress.title && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">عنوان آدرس</p>
                        <p className="font-medium">{order.shippingAddress.title}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">گیرنده</p>
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">تلفن</p>
                      <p className="font-medium" dir="ltr">{order.shippingAddress.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">آدرس</p>
                      <p className="font-medium leading-relaxed">
                        {order.shippingAddress.address}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.shippingAddress.city}, {order.shippingAddress.province}
                        {' - کد پستی: '}
                        <span dir="ltr">{order.shippingAddress.postalCode}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">مجموع محصولات</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">هزینه ارسال</span>
                  <span className="font-medium">{formatPrice(order.shipping)}</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مالیات</span>
                    <span className="font-medium">{formatPrice(order.tax)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف</span>
                    <span className="font-medium">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">مجموع</span>
                  <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  اطلاعات پرداخت و ارسال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">روش پرداخت</p>
                  <p className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">نوع ارسال</p>
                  <p className="font-medium">{getShippingMethodLabel(order.shippingMethod)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
