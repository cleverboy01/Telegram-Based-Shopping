import React, { createContext, useContext, useEffect, useState } from 'react';

interface SiteSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  footer: {
    aboutText: string;
    copyright: string;
    phone: string;
    email: string;
    address: string;
    socialLinks: {
      instagram?: string;
      telegram?: string;
      whatsapp?: string;
    };
  };
  homepage: {
    sliders: Array<{
      id: string;
      image: string;
      title: string;
      subtitle: string;
      link: string;
    }>;
    banners: Array<{
      id: string;
      image: string;
      title: string;
      link: string;
    }>;
  };
  shipping: {
    freeShippingThreshold: number;
    defaultShippingCost: number;
  };
}

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  updateFooter: (footerData: Partial<SiteSettings['footer']>) => void;
  updateHomepage: (homepageData: Partial<SiteSettings['homepage']>) => void;
  isLoading: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: 'فروشگاه من',
  logo: '/logo.png',
  primaryColor: '#1e40af',
  footer: {
    aboutText: 'فروشگاه آنلاین محصولات با کیفیت',
    copyright: '© 2025 تمام حقوق محفوظ است',
    phone: '021-12345678',
    email: 'info@shop.com',
    address: 'تهران، خیابان ولیعصر',
    socialLinks: {
      instagram: 'https://instagram.com/shop',
      telegram: 'https://t.me/shop',
    }
  },
  homepage: {
    sliders: [],
    banners: []
  },
  shipping: {
    freeShippingThreshold: 2000000,
    defaultShippingCost: 50000
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (updates: Partial<SiteSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
  };

  const updateFooter = (footerData: Partial<SiteSettings['footer']>) => {
    const newSettings = {
      ...settings,
      footer: { ...settings.footer, ...footerData }
    };
    setSettings(newSettings);
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
  };

  const updateHomepage = (homepageData: Partial<SiteSettings['homepage']>) => {
    const newSettings = {
      ...settings,
      homepage: { ...settings.homepage, ...homepageData }
    };
    setSettings(newSettings);
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateFooter,
        updateHomepage,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
