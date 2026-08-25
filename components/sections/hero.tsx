"use client";

import { useState, useEffect } from "react";
import HeroCarousel, { HeroSlide } from "@/components/ui/hero-carousel/HeroCarousel";

// Default hero slides - Single Video Loop
const DEFAULT_SLIDES_EN: HeroSlide[] = [
  {
    id: 1,
    video: "/videos/homepage-hero-new.webm",
    loop: true,
    imageAlt: "Aeroride Series Solid-State Battery",
    eyebrow: "Solid-State Battery Tech",
    title: "Aeroride Series",
    description: "Next-generation high energy density solid-state power solutions for low-altitude flight, embodied AI, and deep-sea equipment.",
    ctaText: "Customize Now",
    ctaLink: "/contact",
    stats: [
      { value: "500+", unit: "Wh/kg", label: "Energy Density" },
      { value: "10C+", unit: "", label: "Peak Discharge" },
      { value: "1000+", unit: "cycles", label: "Cycle Life" },
    ],
  },
];

const DEFAULT_SLIDES_ZH: HeroSlide[] = [
  {
    id: 1,
    video: "/videos/homepage-hero-new.webm",
    loop: true,
    imageAlt: "云驰系列固态电池",
    eyebrow: "固态电池技术",
    title: "云驰系列",
    description: "面向低空飞行、具身智能与深海装备的下一代高比能固态动力解决方案。",
    ctaText: "即刻定制",
    ctaLink: "/contact",
    stats: [
      { value: "500+", unit: "Wh/kg", label: "能量密度" },
      { value: "10C+", unit: "", label: "峰值放电" },
      { value: "1000+", unit: "次", label: "循环寿命" },
    ],
  },
];

// Transform banner data to HeroSlide format
interface Banner {
  id: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  title?: string;
  titleZh?: string;
  subtitle?: string;
  subtitleZh?: string;
  image?: string;
  mobileImage?: string;
  videoUrl?: string;
  posterUrl?: string;
  mobileVideoUrl?: string;
  link?: string;
  ctaText?: string;
  ctaTextZh?: string;
  sortOrder: number;
}

function transformBannersToSlides(banners: Banner[], locale: string): HeroSlide[] {
  return banners
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((banner, index) => {
      const isVideo = banner.mediaType === 'VIDEO' || !!banner.videoUrl;

      return {
        id: index + 1,
        mediaType: banner.mediaType || (isVideo ? 'VIDEO' : 'IMAGE'),
        image: banner.image,
        videoUrl: banner.videoUrl,
        posterUrl: banner.posterUrl,
        mobileImage: banner.mobileImage,
        mobileVideoUrl: banner.mobileVideoUrl,
        // If it's a video type, enable loop
        loop: banner.mediaType === 'VIDEO' ? true : undefined,
        imageAlt: locale === "zh" ? (banner.titleZh || banner.title || "") : (banner.title || ""),
        eyebrow: locale === "zh" ? "固态电池技术" : "Solid-State Battery Tech",
        title: locale === "zh"
          ? (banner.titleZh || banner.title || "Untitled")
          : (banner.title || "Untitled"),
        description: locale === "zh"
          ? (banner.subtitleZh || banner.subtitle || "")
          : (banner.subtitle || ""),
        ctaText: locale === "zh"
          ? (banner.ctaTextZh || banner.ctaText || "了解更多")
          : (banner.ctaText || "Learn More"),
        ctaLink: banner.link || "/",
        stats: DEFAULT_SLIDES_EN[0].stats,
      };
    });
}

interface HeroProps {
  translations?: unknown;
  locale: string;
}

export function Hero({ locale }: HeroProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(locale === "zh" ? DEFAULT_SLIDES_ZH : DEFAULT_SLIDES_EN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch("/api/banners", {
          next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
          console.error("Failed to fetch banners, using defaults");
          return;
        }

        const data = await response.json();
        const banners: Banner[] = data.items || [];

        // Only use banners if there are any active ones
        if (banners.length > 0) {
          const transformedSlides = transformBannersToSlides(banners, locale);
          setSlides(transformedSlides);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
  }, [locale]);

  // Update slides when locale changes (without refetching if we already have data)
  useEffect(() => {
    if (!loading) {
      setSlides(locale === "zh" ? DEFAULT_SLIDES_ZH : DEFAULT_SLIDES_EN);
    }
  }, [locale, loading]);

  return <HeroCarousel slides={slides} autoPlayInterval={3000} />;
}
