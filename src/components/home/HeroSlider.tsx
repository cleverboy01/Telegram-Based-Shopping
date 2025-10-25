import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "",
    titleEn: "Summer Sale is Here!",
    subtitle: "",
    subtitleEn: "",
    cta: "خرید کنید",
    ctaEn: "Shop Now",
    link: "/products",
    bg: "from-primary/20 to-secondary/20",
    image:
      "https://apadanalight.ir/wp-content/uploads/2024/10/%D8%AA%D8%A7%D8%A8%D9%84%D9%88-%D9%85%D8%BA%D8%A7%D8%B2%D9%87-%D8%AC%D8%AF%DB%8C%D8%AF%D8%AA%D8%B1%DB%8C%D9%86-%D9%85%D8%AF%D9%84-%D8%AA%D8%A7%D8%A8%D9%84%D9%88-%D9%85%D8%BA%D8%A7%D8%B2%D9%87-%D9%82%DB%8C%D9%85%D8%AA-%D8%AA%D8%A7%D8%A8%D9%84%D9%88-%D9%85%D8%BA%D8%A7%D8%B2%D9%87-1403.jpg",
  },
  {
    id: 2,
    title: "محصولات جدید",
    titleEn: "New Arrivals",
    subtitle: "آخرین تکنولوژی، بهترین قیمت‌ها",
    subtitleEn: "Latest Technology, Best Prices",
    cta: "مشاهده مجموعه",
    ctaEn: "Explore Collection",
    link: "/products",
    bg: "from-secondary/20 to-primary/20",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "ارسال رایگان",
    titleEn: "Free Shipping",
    subtitle: "برای سفارش‌های بالای 2 میلیون تومان",
    subtitleEn: "On orders above $2,000",
    cta: "اطلاعات بیشتر",
    ctaEn: "Learn More",
    link: "/products",
    bg: "from-green-500/20 to-primary/20",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div
      className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
          }`}
        >
          {}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
          </div>

          {}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </p>
                <Link to={slide.link}>
                  <Button
                    size="lg"
                    className="gap-2 animate-fade-in-up animation-delay-400"
                  >
                    {slide.cta}
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-primary/30 w-2 hover:bg-primary/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
