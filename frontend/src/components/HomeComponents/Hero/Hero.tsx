import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Gift,
  Star,
  ChevronRight,
  ShoppingBag,
  Cake,
  Cookie,
  Apple,
  Nut,
  Coffee,
} from "lucide-react";
import styles from "./Hero.module.css";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Traditional Sweets & Confectionary",
      subtitle: "Since 1985 • Patna's Favorite",
      description:
        "Experience the authentic taste of Bikaner with our handcrafted sweets made from traditional recipes passed down through generations.",
      buttonText: "Shop Sweets",
      buttonLink: "/sweets",
      accentColor: "var(--primary-500)",
      icon: "🍬",
      category: "Sweets",
      stats: "500+ Varieties",
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1600&auto=format&fit=crop&q=80",
      gradient:
        "linear-gradient(135deg, rgba(229, 62, 62, 0.15), rgba(221, 107, 32, 0.15))",
    },
    {
      id: 2,
      title: "Artisanal Bakery & Cakes",
      subtitle: "Freshly Baked Daily",
      description:
        "From artisan breads to celebration cakes, our bakery creates magic with premium ingredients and master craftsmanship.",
      buttonText: "Explore Bakery",
      buttonLink: "/bakery",
      accentColor: "var(--secondary-500)",
      icon: "🥐",
      category: "Bakery",
      stats: "100+ Items",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop&q=80",
      gradient:
        "linear-gradient(135deg, rgba(221, 107, 32, 0.15), rgba(246, 173, 85, 0.15))",
    },
    {
      id: 3,
      title: "Premium Dry Fruits & Namkeen",
      subtitle: "100% Natural • Premium Quality",
      description:
        "Hand-selected dry fruits and savory namkeen that bring the rich flavors of Rajasthan to your table.",
      buttonText: "Shop Dry Fruits",
      buttonLink: "/dry-fruits",
      accentColor: "var(--accent-500)",
      icon: "🌰",
      category: "Dry Fruits",
      stats: "200+ Products",
      image:
        "https://images.unsplash.com/photo-1540914124281-342587941389?w=1600&auto=format&fit=crop&q=80",
      gradient:
        "linear-gradient(135deg, rgba(56, 161, 105, 0.15), rgba(72, 187, 120, 0.15))",
    },
    {
      id: 4,
      title: "Custom Celebration Cakes",
      subtitle: "Make Moments Memorable",
      description:
        "Bespoke cakes designed for birthdays, weddings, and celebrations. Your imagination, our creation.",
      buttonText: "View Cakes",
      buttonLink: "/cakes",
      accentColor: "var(--primary-400)",
      icon: "🎂",
      category: "Cakes",
      stats: "Custom Designs",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&auto=format&fit=crop&q=80",
      gradient:
        "linear-gradient(135deg, rgba(245, 101, 101, 0.15), rgba(229, 62, 62, 0.15))",
    },
  ];

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setIsTransitioning(false);
    }, 500);
  }, [slides.length]);

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isTransitioning, nextSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.radialGradient} />
        <div className={styles.gridPattern} />

        {/* Animated Shapes */}
        <div className={styles.animatedShapes}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={styles.shape}
              style={{
                animationDelay: `${i * 0.5}s`,
                background:
                  i % 2 === 0
                    ? `linear-gradient(135deg, ${currentSlideData.accentColor}20, transparent)`
                    : `linear-gradient(135deg, var(--accent-500)20, transparent)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Container */}
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent}>
          {/* Tagline */}
          <div className={styles.tagline}>
            <Sparkles className={styles.sparkleIcon} size={16} />
            <span className={styles.taglineText}>
              Patna's Premier Destination Since 1985
            </span>
            <Sparkles className={styles.sparkleIcon} size={16} />
          </div>

          {/* Main Title */}
          <h1 className={styles.mainTitle}>
            Experience the Taste of
            <span
              className={styles.titleHighlight}
              style={{ color: currentSlideData.accentColor }}
            >
              {currentSlideData.category}
            </span>
          </h1>

          {/* Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={styles.slideContent}
            >
              {/* Category Badge */}
              <div
                className={styles.categoryBadge}
                style={{
                  backgroundColor: currentSlideData.accentColor + "20",
                  color: currentSlideData.accentColor,
                }}
              >
                <span className={styles.badgeIcon}>
                  {currentSlideData.icon}
                </span>
                <span className={styles.categoryName}>
                  {currentSlideData.category}
                </span>
                <div className={styles.badgeStats}>
                  <Star size={12} />
                  <span>{currentSlideData.stats}</span>
                </div>
              </div>

              {/* Slide Title */}
              <h2 className={styles.slideTitle}>{currentSlideData.title}</h2>

              {/* Subtitle */}
              <div className={styles.subtitleWrapper}>
                <div
                  className={styles.subtitleLine}
                  style={{ backgroundColor: currentSlideData.accentColor }}
                />
                <p className={styles.subtitle}>{currentSlideData.subtitle}</p>
                <div
                  className={styles.subtitleLine}
                  style={{ backgroundColor: currentSlideData.accentColor }}
                />
              </div>

              {/* Description */}
              <p className={styles.description}>
                {currentSlideData.description}
              </p>

              {/* Call to Action */}
              <div className={styles.ctaWrapper}>
                <Link
                  to={currentSlideData.buttonLink}
                  className={styles.primaryButton}
                  style={
                    {
                      "--button-glow": currentSlideData.accentColor,
                    } as React.CSSProperties
                  }
                >
                  <Gift className={styles.buttonIcon} size={20} />
                  {currentSlideData.buttonText}
                  <ChevronRight className={styles.arrowIcon} size={18} />
                </Link>

                <Link to="/categories" className={styles.secondaryButton}>
                  <ShoppingBag size={18} />
                  Explore All Categories
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Category Quick Links */}
          <div className={styles.categoryLinks}>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                className={`${styles.categoryLink} ${
                  index === currentSlide ? styles.active : ""
                }`}
                onClick={() => goToSlide(index)}
                style={
                  {
                    "--category-color": slide.accentColor,
                  } as React.CSSProperties
                }
              >
                <span className={styles.linkIcon}>{slide.icon}</span>
                <span className={styles.linkText}>{slide.category}</span>
                <div className={styles.linkIndicator} />
              </button>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className={styles.heroImage}>
          <div className={styles.imageContainer}>
            {/* Background Image */}
            <div
              className={styles.slideImage}
              style={{
                backgroundImage: `url(${currentSlideData.image})`,
                background: `${currentSlideData.gradient}, url(${currentSlideData.image})`,
              }}
            >
              <div
                className={styles.imageOverlay}
                style={{ backgroundColor: currentSlideData.accentColor + "15" }}
              />
            </div>

            {/* Floating Elements */}
            <div className={styles.floatingElements}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={styles.floatingElement}
                  style={{
                    animationDelay: `${i * 0.8}s`,
                    background:
                      i === 0
                        ? `radial-gradient(circle at 30% 30%, ${currentSlideData.accentColor}40, transparent 70%)`
                        : i === 1
                        ? `radial-gradient(circle at 70% 70%, var(--secondary-500)30, transparent 70%)`
                        : `radial-gradient(circle at 50% 50%, var(--accent-500)30, transparent 70%)`,
                  }}
                />
              ))}
            </div>

            {/* Decorative Icons */}
            <div className={styles.decorativeIcons}>
              <div
                className={styles.decorativeIcon}
                style={{ color: currentSlideData.accentColor }}
              >
                <Cake size={32} />
              </div>
              <div
                className={styles.decorativeIcon}
                style={{ color: "var(--secondary-500)" }}
              >
                <Cookie size={28} />
              </div>
              <div
                className={styles.decorativeIcon}
                style={{ color: "var(--accent-500)" }}
              >
                <Apple size={24} />
              </div>
              <div
                className={styles.decorativeIcon}
                style={{ color: currentSlideData.accentColor }}
              >
                <Nut size={30} />
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className={styles.slideIndicators}>
            {slides.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  index === currentSlide ? styles.active : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                style={{
                  backgroundColor:
                    index === currentSlide
                      ? currentSlideData.accentColor
                      : "rgba(255, 255, 255, 0.3)",
                }}
              >
                <div className={styles.indicatorProgress} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div
        className={styles.bottomGradient}
        style={{
          background: `linear-gradient(to top, ${currentSlideData.accentColor}10, transparent)`,
        }}
      />
    </>
  );
};

export default Hero;
