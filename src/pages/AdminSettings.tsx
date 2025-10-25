import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Image, 
  LayoutGrid, 
  Truck,
  Save,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { settings, updateSettings, updateFooter } = useSettings();
  const [activeTab, setActiveTab] = useState('general');

  const [siteName, setSiteName] = useState(settings.siteName);
  const [logo, setLogo] = useState(settings.logo);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);

  const [footerAbout, setFooterAbout] = useState(settings.footer.aboutText);
  const [footerCopyright, setFooterCopyright] = useState(settings.footer.copyright);
  const [footerPhone, setFooterPhone] = useState(settings.footer.phone);
  const [footerEmail, setFooterEmail] = useState(settings.footer.email);
  const [footerAddress, setFooterAddress] = useState(settings.footer.address);
  const [instagram, setInstagram] = useState(settings.footer.socialLinks.instagram || '');
  const [telegram, setTelegram] = useState(settings.footer.socialLinks.telegram || '');
  const [whatsapp, setWhatsapp] = useState(settings.footer.socialLinks.whatsapp || '');

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.shipping.freeShippingThreshold);
  const [defaultShippingCost, setDefaultShippingCost] = useState(settings.shipping.defaultShippingCost);

  const handleSaveGeneral = () => {
    updateSettings({
      siteName,
      logo,
      primaryColor
    });
    toast.success('تنظیمات عمومی ذخیره شد');
  };

  const handleSaveFooter = () => {
    updateFooter({
      aboutText: footerAbout,
      copyright: footerCopyright,
      phone: footerPhone,
      email: footerEmail,
      address: footerAddress,
      socialLinks: {
        instagram,
        telegram,
        whatsapp
      }
    });
    toast.success('تنظیمات فوتر ذخیره شد');
  };

  const handleSaveShipping = () => {
    updateSettings({
      shipping: {
        freeShippingThreshold,
        defaultShippingCost
      }
    });
    toast.success('تنظیمات ارسال ذخیره شد');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        toast.success('لوگو آپلود شد');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            تنظیمات سیستم
          </h1>
          <p className="text-muted-foreground">مدیریت کامل تنظیمات فروشگاه</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              عمومی
            </TabsTrigger>
            <TabsTrigger value="footer" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              فوتر
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2">
              <Truck className="h-4 w-4" />
              ارسال
            </TabsTrigger>
          </TabsList>

          {}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات عمومی سایت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">نام سایت</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="فروشگاه من"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">لوگو سایت</Label>
                  <div className="flex items-center gap-4">
                    {logo && (
                      <img src={logo} alt="Logo" className="h-20 w-20 object-contain border rounded-lg p-2" />
                    )}
                    <div className="flex-1">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        فرمت‌های مجاز: JPG, PNG, SVG (حداکثر 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">رنگ اصلی سایت</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveGeneral} className="gap-2">
                  <Save className="h-4 w-4" />
                  ذخیره تنظیمات عمومی
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات فوتر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="footerAbout">متن درباره ما</Label>
                  <Textarea
                    id="footerAbout"
                    value={footerAbout}
                    onChange={(e) => setFooterAbout(e.target.value)}
                    rows={3}
                    placeholder="توضیحات کوتاه درباره فروشگاه..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerCopyright">متن کپی‌رایت</Label>
                  <Input
                    id="footerCopyright"
                    value={footerCopyright}
                    onChange={(e) => setFooterCopyright(e.target.value)}
                    placeholder="© 2025 تمام حقوق محفوظ است"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerPhone">تلفن</Label>
                    <Input
                      id="footerPhone"
                      value={footerPhone}
                      onChange={(e) => setFooterPhone(e.target.value)}
                      placeholder="021-12345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footerEmail">ایمیل</Label>
                    <Input
                      id="footerEmail"
                      type="email"
                      value={footerEmail}
                      onChange={(e) => setFooterEmail(e.target.value)}
                      placeholder="info@shop.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerAddress">آدرس</Label>
                  <Textarea
                    id="footerAddress"
                    value={footerAddress}
                    onChange={(e) => setFooterAddress(e.target.value)}
                    rows={2}
                    placeholder="تهران، خیابان ولیعصر"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">شبکه‌های اجتماعی</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagram">اینستاگرام</Label>
                    <Input
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/shop"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram">تلگرام</Label>
                    <Input
                      id="telegram"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="https://t.me/shop"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">واتساپ</Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="https://wa.me/989123456789"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveFooter} className="gap-2">
                  <Save className="h-4 w-4" />
                  ذخیره تنظیمات فوتر
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات ارسال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">حداقل خرید برای ارسال رایگان (تومان)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    placeholder="2000000"
                  />
                  <p className="text-xs text-muted-foreground">
                    برای خریدهای بالای این مبلغ، ارسال رایگان است
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultShippingCost">هزینه پیش‌فرض ارسال (تومان)</Label>
                  <Input
                    id="defaultShippingCost"
                    type="number"
                    value={defaultShippingCost}
                    onChange={(e) => setDefaultShippingCost(Number(e.target.value))}
                    placeholder="50000"
                  />
                </div>

                <Button onClick={handleSaveShipping} className="gap-2">
                  <Save className="h-4 w-4" />
                  ذخیره تنظیمات ارسال
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
