import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product/ProductCard";
import HeroSlider from "@/components/home/HeroSlider";
import {
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  ArrowLeft,
  TrendingUp,
  Star,
  Zap,
  Instagram,
  Send,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/types";

const API_URL = 'http://localhost:3000/api';

export default function HomePage() {
const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
setLoading(true);

        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const products: Product[] = await response.json();
const published = products.filter((p) => p.status === "published");
const featured = published.filter((p) => p.isFeatured).slice(0, 4);
        const newProds = published.filter((p) => p.isNew).slice(0, 4);
        const bestSell = published.filter((p) => p.isBestSeller).slice(0, 4);
console.log("🆕 New:", newProds.length);
setFeaturedProducts(featured);
        setNewProducts(newProds);
        setBestSellers(bestSell);

        localStorage.setItem("products", JSON.stringify(products));

      } catch (error) {
        console.error("❌ Error loading products from API:", error);

        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
          try {
            const products: Product[] = JSON.parse(savedProducts);
const published = products.filter((p) => p.status === "published");
            setFeaturedProducts(published.filter((p) => p.isFeatured).slice(0, 4));
            setNewProducts(published.filter((p) => p.isNew).slice(0, 4));
            setBestSellers(published.filter((p) => p.isBestSeller).slice(0, 4));
          } catch (parseError) {
            console.error("❌ Failed to parse localStorage:", parseError);
          }
        } else {
          console.warn("⚠️ No products in localStorage and API failed");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const features = [
    {
      icon: Truck,
      title: "ارسال رایگان",
      description: "برای خرید بالای 2 میلیون تومان",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      icon: Shield,
      title: "گارانتی اصالت",
      description: "100% اصل و اورجینال",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      icon: Headphones,
      title: "پشتیبانی 24/7",
      description: "پاسخگویی در تمام ساعات",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      icon: Zap,
      title: "تحویل سریع",
      description: "ارسال در کمتر از 2 روز",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
  ];
return (
    <div className="min-h-screen">
      {}
      <section className="container mx-auto px-4 py-8">
        <HeroSlider />
      </section>

      {}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className={`${feature.bgColor} p-3 rounded-lg`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {}
      {loading && (
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">در حال بارگذاری محصولات...</p>
          </div>
        </section>
      )}

      {}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">محصولات ویژه</h2>
              </div>
              <Link to="/products">
                <Button variant="outline" className="gap-2">
                  مشاهده همه
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {}
      {!loading && newProducts.length > 0 && (
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-green-600" />
                <h2 className="text-3xl font-bold">جدیدترین محصولات</h2>
              </div>
              <Link to="/products">
                <Button variant="outline" className="gap-2">
                  مشاهده همه
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {}
      {!loading && bestSellers.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h2 className="text-3xl font-bold">پرفروش‌ترین‌ها</h2>
              </div>
              <Link to="/products">
                <Button variant="outline" className="gap-2">
                  مشاهده همه
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {}
      {!loading && featuredProducts.length === 0 && newProducts.length === 0 && bestSellers.length === 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">هنوز محصولی اضافه نشده است</h3>
            <p className="text-muted-foreground mb-6">
              برای مشاهده محصولات، از پنل ادمین محصول جدید اضافه کنید
            </p>
            <Link to="/admin/products">
              <Button>رفتن به پنل ادمین</Button>
            </Link>
          </div>
        </section>
      )}

      {}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-4">
            به دنبال محصول خاصی هستید؟
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            با مجموعه کاملی از محصولات با کیفیت و قیمت مناسب، بهترین تجربه خرید
            را با ما داشته باشید
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              مشاهده تمام محصولات
            </Button>
          </Link>
        </div>
      </section>

      {}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                درباره من
              </h3>
              <p className="text-sm leading-relaxed">
                توسعه دهنده سایت و سازنده خلاق در زمینه های متعدد
              </p>
            </div>

            {}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                شبکه‌های اجتماعی
              </h3>
              <div className="space-y-3">
                <a
                  href="https://instagram.com/mrezakazemi_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors group"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">اینستاگرام</span>
                </a>

                <a
                  href="https://t.me/Mrezakazemix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors group"
                >
                  <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">تلگرام</span>
                </a>
              </div>
            </div>

            {}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                تماس با من
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>0913-764-4219</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>mkazemi.contact@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>همه جای ایران</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
