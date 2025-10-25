import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingBag, CreditCard, Truck, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Order, Product } from '@/types';
import { api } from '@/services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    paymentMethod: 'online' as 'online' | 'cash_on_delivery',
    shippingMethod: 'standard' as 'standard' | 'fast' | 'express',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const total = getCartTotal();
  const shippingCosts = {
    standard: 0,
    fast: 50000,
    express: 100000,
  };
  const shippingCost = shippingCosts[formData.shippingMethod];
  const finalTotal = total + shippingCost;

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.mobile || !formData.city || !formData.address || !formData.postalCode) {
      toast.error('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = `ORD-${Date.now()}`;

      const savedProducts = localStorage.getItem('products');
      const products: Product[] = savedProducts ? JSON.parse(savedProducts) : [];
      
      const orderItems = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name || 'محصول حذف شده',
          productImage: product?.mainImage || 'https://via.placeholder.com/80',
          quantity: item.quantity,
          price: item.price,
          discountPrice: item.discountPrice,
        };
      });

      const newOrder: Order = {
        id: generateId(),
        userId: user!.id,
        orderNumber,
        items: orderItems,
        subtotal: total,
        discount: 0,
        shipping: shippingCost,
        tax: 0,
        total: finalTotal,
        status: formData.paymentMethod === 'online' ? 'paid' : 'pending',
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        shippingAddress: {
          id: generateId(),
          userId: user!.id,
          title: 'آدرس پیش‌فرض',
          fullName: formData.fullName,
          mobile: formData.mobile,
          province: formData.province || 'تهران',
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
          isDefault: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await api.createOrder(newOrder);
      
      if (result.success) {
        const userOrders = localStorage.getItem(`orders_${user!.id}`);
        const orders: Order[] = userOrders ? JSON.parse(userOrders) : [];
        orders.push(newOrder);
        localStorage.setItem(`orders_${user!.id}`, JSON.stringify(orders));

        products.forEach(product => {
          const orderItem = orderItems.find(item => item.productId === product.id);
          if (orderItem && product.stock >= orderItem.quantity) {
            product.stock -= orderItem.quantity;
          }
        });
        localStorage.setItem('products', JSON.stringify(products));

        clearCart();
        toast.success('سفارش شما با موفقیت ثبت شد');
        
        if (formData.paymentMethod === 'online') {
          setTimeout(() => {
            navigate(`/orders/${newOrder.id}`);
          }, 1000);
        } else {
          navigate(`/orders/${newOrder.id}`);
        }
      } else {
        toast.error('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">تسویه حساب</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    آدرس تحویل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">نام و نام خانوادگی *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="نام کامل خود را وارد کنید"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">شماره موبایل *</Label>
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="09123456789"
                        required
                        dir="ltr"
                        pattern="[0-9]{11}"
                        title="شماره موبایل باید 11 رقم باشد"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">استان *</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        placeholder="مثال: تهران"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">شهر *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="مثال: تهران"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">آدرس کامل *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="خیابان، کوچه، پلاک، واحد"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">کد پستی (10 رقم) *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="1234567890"
                      required
                      dir="ltr"
                      pattern="[0-9]{10}"
                      title="کد پستی باید 10 رقم باشد"
                      maxLength={10}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>روش ارسال</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.shippingMethod}
                    onValueChange={(value) => setFormData({ ...formData, shippingMethod: value as 'standard' | 'fast' | 'express' })}
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-2 gap-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <div>
                            <p className="font-medium">ارسال عادی</p>
                            <p className="text-sm text-muted-foreground">3-5 روز کاری</p>
                          </div>
                        </Label>
                      </div>
                      <span className="font-medium text-green-600">رایگان</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-2 gap-2">
                        <RadioGroupItem value="fast" id="fast" />
                        <Label htmlFor="fast" className="cursor-pointer">
                          <div>
                            <p className="font-medium">ارسال سریع</p>
                            <p className="text-sm text-muted-foreground">1-2 روز کاری</p>
                          </div>
                        </Label>
                      </div>
                      <span className="font-medium">{formatPrice(50000)}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-2 gap-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <div>
                            <p className="font-medium">ارسال فوری</p>
                            <p className="text-sm text-muted-foreground">همان روز</p>
                          </div>
                        </Label>
                      </div>
                      <span className="font-medium">{formatPrice(100000)}</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    روش پرداخت
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as 'online' | 'cash_on_delivery' })}
                  >
                    <div className="flex items-center space-x-2 gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="cursor-pointer flex-1">
                        <div>
                          <p className="font-medium">پرداخت آنلاین</p>
                          <p className="text-sm text-muted-foreground">پرداخت از طریق درگاه بانکی</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="cash_on_delivery" id="cash" />
                      <Label htmlFor="cash" className="cursor-pointer flex-1">
                        <div>
                          <p className="font-medium">پرداخت در محل</p>
                          <p className="text-sm text-muted-foreground">پرداخت هنگام تحویل کالا</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    خلاصه سفارش
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">جمع کل ({items.length} محصول):</span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">هزینه ارسال:</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? (
                          <span className="text-green-600">رایگان</span>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>مبلغ قابل پرداخت:</span>
                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        در حال پردازش...
                      </div>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        ثبت نهایی سفارش
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    با کلیک بر روی دکمه، شرایط و قوانین را می‌پذیرید
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
