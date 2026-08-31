"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// ============================================
// Types
// ============================================
export type MediaType = 'IMAGE' | 'VIDEO';

export interface HeroSlide {
  id: number;
  mediaType?: MediaType;
  image?: string;
  video?: string;
  videoUrl?: string;     // For IMAGE type, videoUrl is the video to play
  posterUrl?: string;    // Video poster/thumbnail
  mobileImage?: string;
  mobileVideoUrl?: string;
  loop?: boolean;
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
// Hero Slide Component (Videos)
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
  // Use videoUrl if provided, otherwise fall back to video
  const videoSrc = slide.videoUrl || slide.video;

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
      <div className="absolute inset-0 flex items-end justify-end bg-[#0a0a0a]">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={slide.posterUrl}
          className="absolute bottom-0 right-0 w-auto h-[88%] max-w-[60%] object-contain"
          muted
          playsInline
          loop={slide.loop}
          onEnded={slide.loop ? undefined : onVideoEnd}
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
}: {
  slide: HeroSlide;
}) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className="absolute inset-x-0 top-[25%] md:top-[28%] flex items-start md:justify-start gap-3 md:gap-5 px-6 md:pl-[17%] md:pr-[3%] pointer-events-auto">
        {/* Text Content - Left side */}
        <div className="max-w-[460px] flex-shrink-0">
          {/* Title */}
          <h1
            className="text-[28px] md:text-[40px] lg:text-[48px] font-extrabold leading-[1.1] mb-5"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            {(() => {
              const t = slide.title;
              const cut = t.includes(" ") ? t.indexOf(" ") : 2;
              const first = t.slice(0, cut);
              const rest = t.slice(cut);
              return (
                <>
                  <span className="text-shimmer-logo">{first}</span>
                  {rest && <span className="text-white">{rest}</span>}
                </>
              );
            })()}
          </h1>

          {/* Description */}
          <p
            className="text-[13px] md:text-[14px] text-gray-300 leading-relaxed mb-7 max-w-[380px]"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            {slide.description}
          </p>

          {/* CTA Button */}
          <Link href={slide.ctaLink}>
            <button className="inline-flex items-center gap-2 px-8 md:px-10 py-4 bg-white text-[#0a0a0a] font-semibold text-[16px] rounded-lg hover:bg-gray-200 transition-all cursor-pointer">
              {slide.ctaText}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          {/* Three Stats - Horizontal */}
          <div className="mt-10 flex gap-10">
            {slide.stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-white font-mono">
                  {stat.value}
                  {stat.unit && <span className="text-base text-blue-400 ml-1">{stat.unit}</span>}
                </div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
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
      className="relative w-full h-[calc(100vh-80px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] overflow-hidden bg-[#0a0a0a]"
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
          {slide.video || slide.videoUrl ? (
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
      <HeroContent slide={slides[currentIndex]} />
    </section>
  );
}
