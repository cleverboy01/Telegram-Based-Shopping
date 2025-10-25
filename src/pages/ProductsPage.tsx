import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Star, Search, Filter, X, Heart, ShoppingCart, RefreshCw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function ProductsPage() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000000000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const fetchProducts = async (showToast = false) => {
    try {
      if (showToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await api.getProducts();
      console.log('✅ محصولات دریافت شده از API:', data);
      const publishedProducts = data.filter((p: Product) => p.status === 'published');
      
      setProducts(publishedProducts);
      localStorage.setItem('products', JSON.stringify(data));
      localStorage.setItem('products_last_sync', new Date().toISOString());
      
      if (showToast) {
        toast.success(`${publishedProducts.length} محصول بارگذاری شد`);
      }
    } catch (error) {
      console.error('❌ خطا در دریافت محصولات از API:', error);
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        try {
          const allProducts = JSON.parse(savedProducts);
          const publishedProducts = allProducts.filter((p: Product) => p.status === 'published');
          setProducts(publishedProducts);
          console.log('📦 محصولات از localStorage بارگذاری شد');
          
          if (showToast) {
            toast.warning('از حافظه محلی بارگذاری شد');
          }
        } catch (e) {
          console.error('خطا در parse کردن products:', e);
          toast.error('خطا در بارگذاری محصولات');
        }
      } else {
        toast.error('خطا در دریافت محصولات');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleRefresh = () => {
    fetchProducts(true);
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered = filtered.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default: // newest
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد شوید');
      return;
    }
    if (product.stock === 0) {
      toast.error('محصول ناموجود است');
      return;
    }
    addToCart(product, 1);
    toast.success('محصول به سبد خرید اضافه شد');
  };

  const handleToggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد شوید');
      return;
    }
    toggleWishlist(productId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 100000000000]);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 100000000;

  const FiltersContent = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          {}
          <div>
            <Label className="mb-2 block">جستجو</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در محصولات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {}
          <div>
            <Label className="mb-2 block">دسته‌بندی</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌ها</SelectItem>
                {categories.filter(c => c !== 'all').map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {}
          <div>
            <Label className="mb-2 block">محدوده قیمت</Label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={100000000000}
              step={1000000}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>

          {}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full gap-2"
            >
              <X className="h-4 w-4" />
              پاک کردن فیلترها
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">محصولات</h1>
            <p className="text-muted-foreground">
              کاوش در مجموعه محصولات ما
            </p>
          </div>
          
          {}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            {refreshing ? 'در حال بروزرسانی...' : 'بروزرسانی'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {}
          <div className="hidden lg:block">
            <FiltersContent />
          </div>

          {}
          <div className="lg:col-span-3">
            {}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-card p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <Filter className="h-4 w-4" />
                      فیلترها
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>فیلترها</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-muted-foreground">
                  {filteredProducts.length} محصول
                </p>
              </div>

              {}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">جدیدترین</SelectItem>
                  <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                  <SelectItem value="price-desc">گران‌ترین</SelectItem>
                  <SelectItem value="rating">بیشترین امتیاز</SelectItem>
                  <SelectItem value="popular">محبوب‌ترین</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <Link to={`/products/${product.slug || product.id}`}>
                        {}
                        <div className="aspect-square bg-muted relative overflow-hidden">
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                            }}
                          />
                          
                          {}
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            {product.discountPercent && (
                              <Badge variant="destructive" className="shadow-lg">
                                {product.discountPercent}% تخفیف
                              </Badge>
                            )}
                            {product.discountPrice && !product.discountPercent && (
                              <Badge variant="destructive" className="shadow-lg">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% تخفیف
                              </Badge>
                            )}
                            {product.isNew && (
                              <Badge variant="secondary" className="shadow-lg">
                                جدید
                              </Badge>
                            )}
                            {product.isBestSeller && (
                              <Badge className="shadow-lg">
                                پرفروش
                              </Badge>
                            )}
                          </div>

                          {}
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-3 left-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleToggleWishlist(product.id, e)}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                isAuthenticated && isInWishlist(product.id) && "fill-current text-red-500"
                              )}
                            />
                          </Button>

                          {}
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="destructive" className="text-lg py-2 px-4">
                                ناموجود
                              </Badge>
                            </div>
                          )}
                        </div>
                      </Link>

                      {}
                      <div className="p-4 space-y-3">
                        <div>
                          {product.category && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {product.category}
                            </p>
                          )}
                          <Link to={`/products/${product.slug || product.id}`}>
                            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                        </div>

                        {}
                        {product.rating && product.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{product.rating.toFixed(1)}</span>
                            {product.reviewCount && (
                              <span className="text-muted-foreground">
                                ({product.reviewCount})
                              </span>
                            )}
                          </div>
                        )}

                        {}
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

                        {}
                        <Button
                          className="w-full gap-2"
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4" />
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
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">محصولی یافت نشد</h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters
                    ? 'با فیلترهای دیگری جستجو کنید یا فیلترها را پاک کنید'
                    : 'هنوز محصولی در فروشگاه موجود نیست'}
                </p>
                {hasActiveFilters ? (
                  <Button onClick={clearFilters} variant="outline">
                    پاک کردن فیلترها
                  </Button>
                ) : (
                  <Button onClick={handleRefresh} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    تلاش مجدد
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
