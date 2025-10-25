import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
      aria-label="Toggle language"
    >
      <Languages className="h-5 w-5" />
      <span className="absolute -bottom-1 text-[10px] font-bold">
        {language.toUpperCase()}
      </span>
    </Button>
  );
};
