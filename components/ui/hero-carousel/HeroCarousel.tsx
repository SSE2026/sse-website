"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// ============================================
// Types
// ============================================
export interface HeroSlide {
  id: number;
  image?: string;
  video?: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  stats: { value: string; unit: string; label: string }[];
  objectPosition?: string;
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

// ============================================
// Image Configuration
// ============================================
const IMAGE_CONFIG = {
  quality: 90,
  sizes: "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px",
};

// ============================================
// Hero Slide Component (Images)
// ============================================
function HeroSlideImage({
  slide,
  isActive,
  priority,
  index,
}: {
  slide: HeroSlide;
  isActive: boolean;
  priority: boolean;
  index: number;
}) {
  // Image positioning adjustments - all move right to avoid blocking text
  const getPositionClass = () => {
    if (index === 1) return "translate-x-[18%]"; // Second image moves right
    if (index === 2) return "translate-x-[22%]"; // Third image moves more right
    return "translate-x-[15%]"; // First image also moves right
  };

  return (
    <div
      className={`absolute inset-0 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
      style={{ transition: "opacity 600ms ease-in-out" }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
        <div
          className={`relative transition-transform duration-500 ${getPositionClass()}`}
          style={{
            width: "70%",
            height: "75%",
          }}
        >
          <Image
            src={slide.image!}
            alt={slide.imageAlt}
            fill
            priority={priority}
            quality={IMAGE_CONFIG.quality}
            sizes={IMAGE_CONFIG.sizes}
            className="object-contain"
            style={{
              objectPosition: slide.objectPosition || "center center",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Hero Slide Component (Videos - plays once)
// ============================================
function HeroSlideVideo({
  slide,
  isActive,
  onVideoEnd,
}: {
  slide: HeroSlide;
  isActive: boolean;
  onVideoEnd?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <div
      className={`absolute inset-0 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
      style={{ transition: "opacity 600ms ease-in-out" }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
        <video
          ref={videoRef}
          src={slide.video}
          className="w-[75%] h-[80%] object-contain translate-x-[25%]"
          muted
          playsInline
          onEnded={onVideoEnd}
        />
      </div>
    </div>
  );
}

// ============================================
// Hero Content Component
// ============================================
function HeroContent({
  slide,
  locale,
  slideIndex,
  totalSlides,
  progress,
  onPrev,
  onNext,
  onDotClick,
}: {
  slide: HeroSlide;
  locale: string;
  slideIndex: number;
  totalSlides: number;
  progress: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      {/* Main Content Container */}
      <div className="relative w-full h-full flex items-center">
        {/* Text Content - Center Left */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-[8%] max-w-[560px]">
          {/* Eyebrow */}
          <span className="text-xs font-mono tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block mb-4">
            {slide.eyebrow}
          </span>

          {/* Title */}
          <h1
            className="text-[28px] md:text-[42px] lg:text-[52px] font-extrabold leading-[1.1] mb-4"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            <span className="text-white">{slide.title.split(' ')[0]} </span>
            <span className="text-shimmer">{slide.title.split(' ').slice(1).join(' ')}</span>
          </h1>

          {/* Description */}
          <p
            className="text-[14px] md:text-[16px] text-gray-400 leading-relaxed mb-6 max-w-[480px]"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            {slide.description}
          </p>

          {/* CTA Button */}
          <Link href={slide.ctaLink}>
            <button className="inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-white text-[#0a0a0a] font-semibold text-[14px] rounded-lg hover:bg-gray-200 transition-all cursor-pointer">
              {slide.ctaText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          {/* Three Stats - Horizontal */}
          <div className="mt-8 pt-6 border-t border-white/10 flex gap-8">
            {slide.stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-white font-mono">
                  {stat.value}
                  {stat.unit && <span className="text-xs text-blue-400 ml-1">{stat.unit}</span>}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls - Bottom Right */}
      <div className="absolute bottom-6 md:bottom-10 right-6 md:right-[8%] flex items-center gap-6">
        {/* Navigation Arrows - Desktop Only */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onPrev}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/50 transition-all cursor-pointer"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNext}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/50 transition-all cursor-pointer"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide Counter & Progress */}
        <div className="flex flex-col items-end gap-2">
          {/* Counter */}
          <div className="flex items-center gap-3">
            <span
              className="text-[12px] md:text-[13px] text-white/60 font-medium tabular-nums"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {String(slideIndex + 1).padStart(2, "0")}
              <span className="mx-1">/</span>
              {String(totalSlides).padStart(2, "0")}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-[80px] md:w-[100px] h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dots */}
          <div className="flex items-center gap-2 mt-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => onDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === slideIndex
                    ? "bg-white w-4"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Hero Carousel Component
// ============================================
export default function HeroCarousel({
  slides,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const handleVideoEnd = useCallback(() => {
    goToNext();
  }, [goToNext]);

  const goToSlide = useCallback((index: number) => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  // Auto-play logic using refs to avoid closure issues
  useEffect(() => {
    if (!mounted || slides.length <= 1) return;

    const currentSlide = slides[currentIndex];

    // Don't start timer for video slides - video will auto-advance on end
    if (currentSlide?.video) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      elapsedRef.current = 0;
      setProgress(0);
      return;
    }

    if (isPaused) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    // Reset elapsed when starting on a new image slide
    elapsedRef.current = 0;

    autoPlayRef.current = setInterval(() => {
      elapsedRef.current += 50;
      const newProgress = (elapsedRef.current / autoPlayInterval) * 100;
      setProgress(newProgress);

      if (elapsedRef.current >= autoPlayInterval) {
        elapsedRef.current = 0;
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }
    }, 50);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [mounted, isPaused, slides.length, currentIndex, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) goToNext();
    else if (diff < -50) goToPrev();
  };

  if (!mounted) {
    return <section className="relative w-full h-[680px] md:h-[760px] bg-[#0a0a0a]" />;
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[580px] sm:h-[620px] md:h-[720px] lg:h-[760px] overflow-hidden bg-[#0a0a0a]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Slides */}
      {slides.map((slide, index) => (
        <div key={slide.id}>
          {slide.video ? (
            <HeroSlideVideo
              slide={slide}
              isActive={index === currentIndex}
              onVideoEnd={handleVideoEnd}
            />
          ) : (
            <HeroSlideImage
              slide={slide}
              isActive={index === currentIndex}
              priority={index === 0}
              index={index}
            />
          )}
        </div>
      ))}

      {/* Dark Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)",
        }}
      />

      {/* Content Overlay */}
      <HeroContent
        slide={slides[currentIndex]}
        locale="en"
        slideIndex={currentIndex}
        totalSlides={slides.length}
        progress={progress}
        onPrev={goToPrev}
        onNext={goToNext}
        onDotClick={goToSlide}
      />
    </section>
  );
}
