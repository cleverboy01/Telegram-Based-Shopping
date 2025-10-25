import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Heart, 
  ShoppingCart, 
  User, 
  ShoppingBag, 
  Headphones,
  MapPin,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { getCartCount, getCartTotal } = useCart();
  const { wishlistCount } = useWishlist();
if (user?.role !== 'customer') {
    return <div className="p-8 text-center">⛔ این صفحه فقط برای مشتریان است</div>;
  }

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        
        {}
        <div className="mb-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">
            🛍️ سلام، {user?.name}!
          </h1>
          <p className="text-white/90 text-lg">
            داشبورد مشتری - خوش آمدید
          </p>
          <Badge className="mt-4 bg-white/20 text-white">مشتری</Badge>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {}
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">سفارشات من</p>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>

          {}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">سبد خرید</p>
              <p className="text-3xl font-bold">{cartCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {cartTotal.toLocaleString('fa-IR')} تومان
              </p>
            </CardContent>
          </Card>

          {}
          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">علاقه‌مندی‌ها</p>
              <p className="text-3xl font-bold">{wishlistCount}</p>
            </CardContent>
          </Card>
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle>🛒 دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {}
            <Link to="/products">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-all text-center">
                <ShoppingBag className="h-10 w-10 mx-auto mb-2" />
                <h3 className="font-bold">خرید</h3>
              </div>
            </Link>

            {}
            <Link to="/cart">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-all text-center">
                <ShoppingCart className="h-10 w-10 mx-auto mb-2" />
                <h3 className="font-bold">سبد خرید</h3>
              </div>
            </Link>

            {}
            <Link to="/wishlist">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-all text-center">
                <Heart className="h-10 w-10 mx-auto mb-2" />
                <h3 className="font-bold">علاقه‌مندی‌ها</h3>
              </div>
            </Link>

            {}
            <Link to="/orders">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-all text-center">
                <Package className="h-10 w-10 mx-auto mb-2" />
                <h3 className="font-bold">سفارشات</h3>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
