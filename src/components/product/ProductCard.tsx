import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const inWishlist = isAuthenticated && isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('لطفاً ابتدا وارد شوید');
      return;
    }

    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-1">
          {}
          <div className="aspect-square relative overflow-hidden bg-muted">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
              }}
            />
            
            {}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              {product.discountPercent && (
                <Badge variant="destructive" className="shadow-lg">
                  {product.discountPercent}% تخفیف
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-green-600 hover:bg-green-700 shadow-lg">
                  جدید
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                  پرفروش
                </Badge>
              )}
            </div>

            {}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-3 left-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  inWishlist && "fill-current text-red-500"
                )}
              />
            </Button>

            {}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge 
                variant="secondary" 
                className="absolute bottom-3 right-3 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100 shadow-lg"
              >
                تنها {product.stock} عدد باقی مانده
              </Badge>
            )}

            {}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <Badge variant="destructive" className="text-lg py-2 px-4 shadow-lg">
                  ناموجود
                </Badge>
              </div>
            )}

            {}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full gap-2 backdrop-blur-sm bg-background/80"
                onClick={(e) => e.preventDefault()}
              >
                <Eye className="h-4 w-4" />
                مشاهده سریع
              </Button>
            </div>
          </div>

          {}
          <div className="p-4 space-y-3 flex-1 flex flex-col">
            {}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{product.category}</span>
              {product.brand && <span>{product.brand}</span>}
            </div>

            {}
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors">
                {product.name}
              </h3>
            </div>

            {}
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
            )}

            {}
            <div className="space-y-1">
              {product.discountPrice ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(product.discountPrice)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold block">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {}
            <Button
              className="w-full gap-2 mt-auto"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
