import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Warehouse, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Product } from '@/types';

export default function WarehouseDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const allProducts = JSON.parse(savedProducts);
        setProducts(allProducts);
        setLowStockProducts(allProducts.filter((p: Product) => p.stock < 10));
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    }
  }, []);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  
  const outOfStock = products.filter(p => p.stock === 0).length;

  const stats = [
    { 
      label: 'کل محصولات', 
      value: products.length.toString(), 
      icon: Package, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'موجودی کل', 
      value: totalStock.toString(), 
      icon: Warehouse, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-950'
    },
    { 
      label: 'موجودی کم', 
      value: lowStockProducts.length.toString(), 
      icon: AlertCircle, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-950'
    },
    { 
      label: 'ناموجود', 
      value: outOfStock.toString(), 
      icon: TrendingUp, 
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-950'
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        
        {}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">پنل انبار</h1>
            <p className="text-muted-foreground">
              خوش آمدید {user?.name}! مدیریت انبار
            </p>
          </div>
          <Badge variant="default" className="h-fit">
            مدیر انبار
          </Badge>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              محصولات با موجودی کم
            </CardTitle>
          </CardHeader>
          <CardContent>
            {}
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600 opacity-50" />
                <p>همه محصولات موجودی کافی دارند</p>
              </div>
            ) : (
              <div className="space-y-3">
                {}
                {lowStockProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {}
                      <img 
                        src={product.mainImage} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                        }}
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    {}
                    <Badge variant={product.stock === 0 ? 'destructive' : 'secondary'}>
                      {product.stock === 0 ? 'ناموجود' : `${product.stock} عدد`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
