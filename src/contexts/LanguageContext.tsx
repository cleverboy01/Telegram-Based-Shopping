import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fa' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations: Record<Language, Record<string, string>> = {
  fa: {
    'nav.home': 'خانه',
    'nav.products': 'محصولات',
    'nav.cart': 'سبد خرید',
    'nav.wishlist': 'لیست علاقه‌مندی',
    'nav.dashboard': 'داشبورد',
    'nav.login': 'ورود',
    'nav.logout': 'خروج',
    'nav.admin': 'مدیریت',
    
    'common.search': 'جستجو...',
    'common.addToCart': 'افزودن به سبد',
    'common.addToWishlist': 'افزودن به علاقه‌مندی',
    'common.price': 'قیمت',
    'common.discount': 'تخفیف',
    'common.stock': 'موجودی',
    'common.category': 'دسته‌بندی',
    'common.brand': 'برند',
    'common.description': 'توضیحات',
    'common.features': 'ویژگی‌ها',
    'common.reviews': 'نظرات',
    'common.submit': 'ارسال',
    'common.cancel': 'انصراف',
    'common.save': 'ذخیره',
    'common.edit': 'ویرایش',
    'common.delete': 'حذف',
    'common.view': 'مشاهده',
    
    'product.addedToCart': 'محصول به سبد خرید اضافه شد',
    'product.outOfStock': 'ناموجود',
    'product.available': 'موجود',
    'product.newProduct': 'جدید',
    'product.bestSeller': 'پرفروش',
    'product.featured': 'ویژه',
    
    'cart.title': 'سبد خرید',
    'cart.empty': 'سبد خرید شما خالی است',
    'cart.total': 'جمع کل',
    'cart.checkout': 'تسویه حساب',
    'cart.quantity': 'تعداد',
    
    'wishlist.title': 'لیست علاقه‌مندی',
    'wishlist.empty': 'لیست علاقه‌مندی شما خالی است',
    
    'dashboard.welcome': 'خوش آمدید',
    'dashboard.totalSpent': 'مجموع خرید',
    'dashboard.orders': 'سفارش‌ها',
    'dashboard.wishlist': 'علاقه‌مندی‌ها',
    'dashboard.profile': 'پروفایل',
    
    'admin.products': 'مدیریت محصولات',
    'admin.addProduct': 'افزودن محصول',
    'admin.editProduct': 'ویرایش محصول',
    'admin.productTitle': 'عنوان محصول',
    'admin.productTitleEn': 'عنوان انگلیسی',
    'admin.productDescription': 'توضیحات',
    'admin.productDescriptionEn': 'توضیحات انگلیسی',
    'admin.productImages': 'تصاویر محصول',
    'admin.productPrice': 'قیمت',
    'admin.productStock': 'موجودی',
    'admin.productCategory': 'دسته‌بندی',
    
    'auth.login': 'ورود',
    'auth.register': 'ثبت نام',
    'auth.email': 'ایمیل',
    'auth.password': 'رمز عبور',
    'auth.name': 'نام',
    'auth.mobile': 'موبایل',
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    
    'common.search': 'Search...',
    'common.addToCart': 'Add to Cart',
    'common.addToWishlist': 'Add to Wishlist',
    'common.price': 'Price',
    'common.discount': 'Discount',
    'common.stock': 'Stock',
    'common.category': 'Category',
    'common.brand': 'Brand',
    'common.description': 'Description',
    'common.features': 'Features',
    'common.reviews': 'Reviews',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    
    'product.addedToCart': 'Product added to cart',
    'product.outOfStock': 'Out of Stock',
    'product.available': 'Available',
    'product.newProduct': 'New',
    'product.bestSeller': 'Best Seller',
    'product.featured': 'Featured',
    
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.quantity': 'Quantity',
    
    'wishlist.title': 'Wishlist',
    'wishlist.empty': 'Your wishlist is empty',
    
    'dashboard.welcome': 'Welcome',
    'dashboard.totalSpent': 'Total Spent',
    'dashboard.orders': 'Orders',
    'dashboard.wishlist': 'Wishlist',
    'dashboard.profile': 'Profile',
    
    'admin.products': 'Product Management',
    'admin.addProduct': 'Add Product',
    'admin.editProduct': 'Edit Product',
    'admin.productTitle': 'Product Title',
    'admin.productTitleEn': 'English Title',
    'admin.productDescription': 'Description',
    'admin.productDescriptionEn': 'English Description',
    'admin.productImages': 'Product Images',
    'admin.productPrice': 'Price',
    'admin.productStock': 'Stock',
    'admin.productCategory': 'Category',
    
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.mobile': 'Mobile',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fa');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && (stored === 'fa' || stored === 'en')) {
      setLanguageState(stored);
    }
    
    document.documentElement.dir = stored === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = stored || 'fa';
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const newLang = language === 'fa' ? 'en' : 'fa';
    setLanguage(newLang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        setLanguage,
        t,
        isRTL: language === 'fa',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
