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
  /** 可选的标题第二行(如「功率型」这类产品类型名),与 title 固定分行显示 */
  titleLine2?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
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
}: {
  slide: HeroSlide;
  isActive: boolean;
  priority: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
      style={{ transition: "opacity 600ms ease-in-out" }}
    >
      {/* 桌面端右对齐、避开左侧文字区;手机端放到文字下方。
          右移量用图片自身的 mr 来给(xl 起 3%),不用容器的 pr —— pr 会同时
          压缩内容盒,把图片一起缩小;mr 只推位置,不改变尺寸。
          不能给更多:1280 下文字右边缘到图片左边缘只剩约 57px。 */}
      <div className="absolute inset-0 flex items-end justify-center pb-[4%] md:items-center md:justify-end md:pb-0 md:pr-[3%] bg-[#F7F8FB]">
        <div className="relative w-[84%] h-[32%] md:w-[30%] md:h-[62%] lg:w-[42%] lg:h-[70%] xl:w-[47%] xl:h-[72%] xl:mr-[3%]">
          <Image
            src={slide.image!}
            alt={slide.imageAlt}
            fill
            priority={priority}
            quality={IMAGE_CONFIG.quality}
            sizes="(max-width: 768px) 90vw, 50vw"
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
      <div className="absolute inset-0 flex items-end justify-end bg-[#F7F8FB]">
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
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              // 中文不在词组内部断行 —— 否则 48px 下 "云驰 460-X 超高能量型"
              // 会在 "超高能量" 和 "型" 之间断开,把 "型" 单独甩到第二行。
              // 英文标题不受影响(keep-all 只作用于 CJK 断行规则)。
              wordBreak: "keep-all",
            }}
          >
            {(() => {
              const t = slide.title;
              const cut = t.includes(" ") ? t.indexOf(" ") : 2;
              const first = t.slice(0, cut);
              const rest = t.slice(cut);
              return (
                <>
                  <span className="text-shimmer-logo">{first}</span>
                  {rest && <span className="text-[#0A0A0F]">{rest}</span>}
                </>
              );
            })()}
            {slide.titleLine2 && (
              <span className="block text-[#0A0A0F]">{slide.titleLine2}</span>
            )}
          </h1>

          {/* Description */}
          <p
            className="text-[13px] md:text-[14px] text-[#52525B] leading-relaxed mb-7 max-w-[380px]"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            {slide.description}
          </p>

          {/* CTA Button */}
          <Link href={slide.ctaLink}>
            <button className="inline-flex items-center gap-2 px-8 md:px-10 py-4 bg-[#0A0A0F] text-white font-semibold text-[16px] rounded-lg hover:bg-[#1F1F2A] transition-all cursor-pointer">
              {slide.ctaText}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
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
    return <section className="relative w-full h-[680px] md:h-[760px] bg-[#F7F8FB]" />;
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[calc(100vh-80px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] overflow-hidden bg-[#F7F8FB]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Soft studio highlight behind the subject — keeps the light
          panel from reading as flat grey. */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/70 rounded-full blur-[120px] pointer-events-none z-0" />

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
            />
          )}
        </div>
      ))}

      {/* 不加渐变蒙版 —— 产品图是透明底的大图,盖一层洗白会把产品压暗发灰。
          文字在左侧独立区域,不靠蒙版也读得清。 */}

      {/* Content Overlay */}
      <HeroContent slide={slides[currentIndex]} />
    </section>
  );
}
