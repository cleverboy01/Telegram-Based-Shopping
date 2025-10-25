import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/services/api';
import { Product } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(data.filter(p => p.status === 'published'));
        console.log('✅ Home products loaded:', data.length);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              بهترین لوازم خانگی با
              <span className="text-primary"> قیمت مناسب</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              فروشگاه معتبر لوازم خانگی با گارانتی معتبر و ارسال سریع به سراسر کشور
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  مشاهده محصولات
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/offers">
                <Button size="lg" variant="outline">
                  پیشنهادات ویژه
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'ارسال سریع', desc: 'ارسال به سراسر کشور' },
              { title: 'گارانتی اصالت', desc: 'ضمانت اصل بودن کالا' },
              { title: 'پرداخت امن', desc: 'درگاه پرداخت معتبر' },
              { title: 'پشتیبانی 24/7', desc: 'پاسخگویی در تمام ساعات' },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">محصولات ویژه</h2>
            <Link to="/products">
              <Button variant="ghost" className="gap-2">
                مشاهده همه
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <Link to={`/products/${product.slug || product.id}`}>
                      <div className="aspect-square bg-muted rounded-lg mb-4 relative overflow-hidden">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                        {product.discountPercent && (
                          <Badge className="absolute top-2 left-2 bg-destructive">
                            {product.discountPercent}% تخفیف
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge className="absolute top-2 right-2 bg-success">
                            جدید
                          </Badge>
                        )}
                      </div>
                    </Link>

                    <div className="space-y-2">
                      <Link to={`/products/${product.slug || product.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {product.rating && product.rating > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-medium">{product.rating.toFixed(1)}</span>
                          {product.reviewCount && product.reviewCount > 0 && (
                            <span className="text-muted-foreground">
                              ({product.reviewCount})
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {product.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(product.discountPrice)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => addToCart(product, 1)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">هنوز محصول ویژه‌ای نداریم</h3>
              <p className="text-muted-foreground mb-4">
                محصولات ویژه به زودی اضافه خواهند شد
              </p>
              <Link to="/products">
                <Button variant="outline">
                  مشاهده تمام محصولات
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">دسته‌بندی محصولات</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'آشپزخانه', count: products.filter(p => p.category?.includes('آشپزخانه')).length },
              { name: 'صوتی و تصویری', count: products.filter(p => p.category?.includes('صوتی')).length },
              { name: 'سرمایشی و گرمایشی', count: products.filter(p => p.category?.includes('سرمایشی')).length },
              { name: 'لباسشویی', count: products.filter(p => p.category?.includes('لباسشویی')).length },
            ].map((category, index) => (
              <Link key={index} to={`/products?category=${encodeURIComponent(category.name)}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {category.count}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} محصول
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
