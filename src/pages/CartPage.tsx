import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, getSubtotal, getDiscount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const allProducts: Product[] = JSON.parse(savedProducts);
        const productsMap: Record<string, Product> = {};
        allProducts.forEach(p => {
          productsMap[p.id] = p;
        });
        setProducts(productsMap);
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const product = products[productId];
    if (product && newQuantity > product.stock) {
      toast.error(`موجودی کافی نیست. حداکثر ${product.stock} عدد موجود است`);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast.success('محصول از سبد خرید حذف شد');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد شوید');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-12 text-center">
            <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">سبد خرید خالی است</h2>
            <p className="text-muted-foreground mb-6">
              هنوز محصولی به سبد خرید اضافه نکرده‌اید
            </p>
            <Link to="/products">
              <Button size="lg" className="gap-2">
                مشاهده محصولات
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getCartTotal();
  const shippingCost = total > 2000000 ? 0 : 50000; // TODO: move to settings
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        
        {}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">سبد خرید</h1>
            <p className="text-muted-foreground">
              {items.length} محصول در سبد خرید شما
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              بازگشت به فروشگاه
            </Button>
          </Link>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = products[item.productId];
              if (!product) return null; // skip if product not found

              const itemPrice = item.discountPrice || item.price;
              const itemTotal = itemPrice * item.quantity;

              return (
                <Card key={item.productId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      
                      {}
                      <Link 
                        to={`/products/${product.slug}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96';
                          }}
                        />
                      </Link>

                      {}
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/products/${product.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          <h3 className="font-semibold mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {}
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                          {product.brand && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">
                                {product.brand}
                              </p>
                            </>
                          )}
                        </div>

                        {}
                        <div className="flex items-center gap-2 mb-3">
                          {item.discountPrice ? (
                            <>
                              <span className="font-bold text-green-600">
                                {formatPrice(item.discountPrice)}
                              </span>
                              <span className="text-sm line-through text-muted-foreground">
                                {formatPrice(item.price)}
                              </span>
                              {product.discountPercent && (
                                <Badge variant="destructive" className="text-xs">
                                  {product.discountPercent}%
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="font-bold">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>

                        {}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {}
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-lg">
                              {formatPrice(itemTotal)}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemove(item.productId)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        {}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>تنها {product.stock} عدد در انبار باقی مانده</span>
                          </div>
                        )}

                        {product.stock === 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>ناموجود شده - لطفاً از سبد خرید حذف کنید</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">خلاصه سفارش</h2>

                {}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      جمع کل ({items.length} کالا):
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>تخفیف:</span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  {}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">هزینه ارسال:</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">رایگان</span>
                    ) : (
                      <span className="font-medium">{formatPrice(shippingCost)}</span>
                    )}
                  </div>

                  {}
                  {total < 2000000 && (
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                      با خرید {formatPrice(2000000 - total)} بیشتر، ارسال رایگان می‌شود
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {}
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>

                {}
                <Button 
                  size="lg" 
                  className="w-full gap-2 mb-3" 
                  onClick={handleCheckout}
                >
                  ادامه فرآیند خرید
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                {}
                <Link to="/products">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowRight className="h-4 w-4" />
                    ادامه خرید
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
