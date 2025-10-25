import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ArrowRight, 
  Minus, 
  Plus,
  Check,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API_URL = 'http://localhost:3000/api';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
setLoading(true);

        if (!slug) {
          toast.error('آدرس محصول نامعتبر است');
          navigate('/products');
          return;
        }

        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const products: Product[] = await response.json();
const foundProduct = products.find(
          (p) => p.slug === slug && p.status === 'published'
        );

        if (foundProduct) {
setProduct(foundProduct);
          setSelectedImage(foundProduct.mainImage);
        } else {
console.log('Available slugs:', products.map(p => p.slug));
          toast.error('محصول یافت نشد');
          setTimeout(() => navigate('/products'), 2000);
        }
      } catch (error) {
        console.error('❌ Error loading product:', error);
        toast.error('خطا در بارگذاری محصول');
        setTimeout(() => navigate('/products'), 2000);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد شوید');
      navigate('/login');
      return;
    }
    if (product.stock === 0) {
      toast.error('محصول ناموجود است');
      return;
    }
    if (quantity > product.stock) {
      toast.error(`موجودی کافی نیست. حداکثر ${product.stock} عدد`);
      return;
    }
    addToCart(product, quantity);
    toast.success('محصول به سبد خرید اضافه شد');
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد شوید');
      navigate('/login');
      return;
    }
    toggleWishlist(product.id);
  };

  const allImages = [product.mainImage, ...(product.images || [])].filter(img => img);
  const isInWish = isAuthenticated && isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        
        {}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            خانه
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
            محصولات
          </Link>
          <span className="text-muted-foreground">/</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category}`} className="text-muted-foreground hover:text-primary transition-colors">
                {product.category}
              </Link>
              <span className="text-muted-foreground">/</span>
            </>
          )}
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-muted group">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600';
                    }}
                  />
                  
                  {}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.discountPercent && (
                      <Badge variant="destructive" className="text-lg py-2 px-3 shadow-lg">
                        {product.discountPercent}% تخفیف
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-green-600 hover:bg-green-700 py-2 px-3 shadow-lg">
                        جدید
                      </Badge>
                    )}
                    {product.isBestSeller && (
                      <Badge className="bg-blue-600 hover:bg-blue-700 py-2 px-3 shadow-lg">
                        پرفروش
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                      selectedImage === image
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-transparent hover:border-muted-foreground"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="space-y-6">
            {}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.category && (
                  <Badge variant="outline" className="text-sm">
                    {product.category}
                  </Badge>
                )}
                {product.brand && (
                  <Badge variant="secondary" className="text-sm">
                    {product.brand}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              {product.shortDescription && (
                <p className="text-muted-foreground text-lg">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount || 0} نظر)
                </span>
              </div>
            )}

            <Separator />

            {}
            <div>
              {product.discountPrice ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-green-600">
                      {formatPrice(product.discountPrice)}
                    </span>
                  </div>
                  <span className="text-lg line-through text-muted-foreground">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {}
            <div>
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    موجود ({product.stock} عدد)
                  </span>
                </div>
              ) : (
                <Badge variant="destructive" className="text-base">
                  ناموجود
                </Badge>
              )}
            </div>

            <Separator />

            {}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">تعداد:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    افزودن به سبد خرید
                  </Button>
                  <Button
                    onClick={handleToggleWishlist}
                    variant={isInWish ? 'default' : 'outline'}
                    size="lg"
                  >
                    <Heart
                      className={`h-5 w-5 ${isInWish ? 'fill-current' : ''}`}
                    />
                  </Button>
                </div>
              </div>
            )}

            {}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>ارسال رایگان برای خرید بالای 2 میلیون تومان</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>گارانتی اصالت کالا</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span>امکان بازگشت کالا تا 7 روز</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {}
        {product.description && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">توضیحات محصول</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
