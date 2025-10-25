import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Product } from '@/types';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3000/api';

interface FormData {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  brand: string;
  category: string;
  categoryEn: string;
  subCategory: string;
  subCategoryEn: string;
  price: string;
  discountPrice: string;
  stock: string;
  mainImage: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    shortDescription: '',
    shortDescriptionEn: '',
    brand: '',
    category: '',
    categoryEn: '',
    subCategory: '',
    subCategoryEn: '',
    price: '',
    discountPrice: '',
    stock: '',
    mainImage: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
} catch (error) {
      console.error('Error loading products:', error);
      toast.error('خطا در بارگذاری محصولات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        name: formData.name,
        nameEn: formData.nameEn || formData.name,
        description: formData.description,
        descriptionEn: formData.descriptionEn || formData.description,
        shortDescription: formData.shortDescription,
        shortDescriptionEn: formData.shortDescriptionEn || formData.shortDescription,
        brand: formData.brand,
        category: formData.category,
        categoryEn: formData.categoryEn || formData.category,
        subCategory: formData.subCategory,
        subCategoryEn: formData.subCategoryEn || formData.subCategory,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        images: [formData.mainImage || 'https://via.placeholder.com/400'],
        mainImage: formData.mainImage || 'https://via.placeholder.com/400',
      };

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('محصول با موفقیت اضافه شد');
        await loadProducts(); // بارگذاری مجدد لیست
        resetForm();
        setIsAddDialogOpen(false);
      } else {
        toast.error(result.error || 'خطا در افزودن محصول');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      setLoading(true);

      const productData = {
        name: formData.name,
        nameEn: formData.nameEn || formData.name,
        description: formData.description,
        descriptionEn: formData.descriptionEn || formData.description,
        shortDescription: formData.shortDescription,
        shortDescriptionEn: formData.shortDescriptionEn || formData.shortDescription,
        brand: formData.brand,
        category: formData.category,
        categoryEn: formData.categoryEn || formData.category,
        subCategory: formData.subCategory,
        subCategoryEn: formData.subCategoryEn || formData.subCategory,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        mainImage: formData.mainImage,
      };

      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('محصول با موفقیت ویرایش شد');
        await loadProducts();
        resetForm();
        setEditingProduct(null);
      } else {
        toast.error(result.error || 'خطا در ویرایش محصول');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('محصول با موفقیت حذف شد');
        await loadProducts();
      } else {
        toast.error(result.error || 'خطا در حذف محصول');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn || '',
      description: product.description || '',
      descriptionEn: product.descriptionEn || '',
      shortDescription: product.shortDescription || '',
      shortDescriptionEn: product.shortDescriptionEn || '',
      brand: product.brand || '',
      category: product.category || '',
      categoryEn: product.categoryEn || '',
      subCategory: product.subCategory || '',
      subCategoryEn: product.subCategoryEn || '',
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || '',
      stock: product.stock.toString(),
      mainImage: product.mainImage || '',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      shortDescription: '',
      shortDescriptionEn: '',
      brand: '',
      category: '',
      categoryEn: '',
      subCategory: '',
      subCategoryEn: '',
      price: '',
      discountPrice: '',
      stock: '',
      mainImage: '',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">مدیریت محصولات</h1>
          <p className="text-muted-foreground">افزودن، ویرایش و حذف محصولات</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={loading}>
              <Plus className="h-4 w-4" />
              افزودن محصول
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>افزودن محصول جدید</DialogTitle>
            </DialogHeader>
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddProduct}
              onCancel={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {}
      {loading && products.length === 0 ? (
        <div className="text-center py-8">
          <p>در حال بارگذاری...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">محصولی وجود ندارد</p>
                <p className="text-sm text-muted-foreground mt-2">
                  برای شروع، محصول جدیدی اضافه کنید
                </p>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(product)}
                                disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>ویرایش محصول</DialogTitle>
                              </DialogHeader>
                              <ProductForm
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={handleUpdateProduct}
                                onCancel={() => {
                                  setEditingProduct(null);
                                  resetForm();
                                }}
                                loading={loading}
                                isEdit
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center gap-4">
                        <div>
                          {product.discountPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600">
                                {formatPrice(product.discountPrice)}
                              </span>
                              <span className="text-sm line-through text-muted-foreground">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                          موجودی: {product.stock}
                        </Badge>
                        {product.status === 'published' && (
                          <Badge variant="outline">منتشر شده</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface ProductFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

function ProductForm({ formData, setFormData, onSubmit, onCancel, loading, isEdit }: ProductFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">نام محصول *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: لپ‌تاپ ایسوس"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="brand">برند</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="مثال: سامسونگ"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription">توضیحات کوتاه</Label>
        <Input
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          placeholder="توضیحات کوتاه محصول"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="description">توضیحات کامل</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="توضیحات کامل محصول"
          rows={3}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">دسته‌بندی</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="مثال: لوازم الکترونیکی"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="subCategory">زیر دسته</Label>
          <Input
            id="subCategory"
            value={formData.subCategory}
            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
            placeholder="مثال: لپ‌تاپ"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">قیمت (تومان) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="2500000"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="discountPrice">قیمت با تخفیف</Label>
          <Input
            id="discountPrice"
            type="number"
            value={formData.discountPrice}
            onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
            placeholder="2200000"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="stock">موجودی *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="10"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="mainImage">لینک تصویر</Label>
        <Input
          id="mainImage"
          value={formData.mainImage}
          onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
          placeholder="https://example.com/image.jpg"
          disabled={loading}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSubmit} className="flex-1" disabled={loading}>
          {loading ? 'در حال پردازش...' : (isEdit ? 'ویرایش محصول' : 'افزودن محصول')}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          لغو
        </Button>
      </div>
    </div>
  );
}
