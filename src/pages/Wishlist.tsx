import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const allProducts: Product[] = JSON.parse(savedProducts);
        const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    }
  }, [wishlist]);

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error('محصول ناموجود است');
      return;
    }
    addToCart(product, 1);
    toast.success('محصول به سبد خرید اضافه شد');
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('محصول از علاقه‌مندی‌ها حذف شد');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full mx-4 p-12 text-center">
          <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">لیست علاقه‌مندی‌ها خالی است</h2>
          <p className="text-muted-foreground mb-6">
            هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید
          </p>
          <Link to="/products">
            <Button size="lg">مشاهده محصولات</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">علاقه‌مندی‌ها ({products.length})</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/products/${product.slug}`}>
                <div className="aspect-square relative bg-muted">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                    }}
                  />
                </div>
              </Link>

              <div className="p-4 space-y-3">
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.discountPrice)}
                      </span>
                      <span className="text-sm line-through text-muted-foreground">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.stock === 0 ? 'ناموجود' : 'افزودن'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
