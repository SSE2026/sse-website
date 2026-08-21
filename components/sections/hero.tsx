"use client";

import { useState, useEffect } from "react";
import HeroCarousel, { HeroSlide } from "@/components/ui/hero-carousel/HeroCarousel";

// Default hero slides - Video 1 + Images 2, 3 (fallback when API fails)
const DEFAULT_SLIDES_EN: HeroSlide[] = [
  {
    id: 1,
    video: "/1.mp4",
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
  {
    id: 2,
    image: "/2.png",
    imageAlt: "Aeroride Series Battery Technology",
    eyebrow: "High Energy Density",
    title: "Breaking Energy Limits",
    description: "Pushing the boundaries of energy density for drones, robotics, and industrial applications.",
    ctaText: "Explore Technology",
    ctaLink: "/technology",
    stats: [
      { value: "400", unit: "Wh/kg", label: "Energy Density" },
      { value: "3C", unit: "", label: "Discharge Rate" },
      { value: "800+", unit: "cycles", label: "Cycle Life" },
    ],
  },
  {
    id: 3,
    image: "/3.png",
    imageAlt: "Aeroride Series Performance",
    eyebrow: "Ultra Safe",
    title: "Reshaping Electric Boundaries",
    description: "From materials to systems, delivering industrial-grade high-safety energy cores.",
    ctaText: "View Products",
    ctaLink: "/products/cloudchi-360-p",
    stats: [
      { value: "460+", unit: "Wh/kg", label: "Energy Density" },
      { value: "10C", unit: "", label: "Peak Discharge" },
      { value: "300+", unit: "cycles", label: "Cycle Life" },
    ],
  },
];

const DEFAULT_SLIDES_ZH: HeroSlide[] = [
  {
    id: 1,
    video: "/1.mp4",
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
  {
    id: 2,
    image: "/2.png",
    imageAlt: "云驰系列电池技术",
    eyebrow: "高能量密度",
    title: "突破能量极限",
    description: "为无人机、机器人及工业应用突破能量密度边界。",
    ctaText: "探索技术",
    ctaLink: "/technology",
    stats: [
      { value: "400", unit: "Wh/kg", label: "能量密度" },
      { value: "3C", unit: "", label: "放电倍率" },
      { value: "800+", unit: "次", label: "循环寿命" },
    ],
  },
  {
    id: 3,
    image: "/3.png",
    imageAlt: "云驰系列性能",
    eyebrow: "极致安全",
    title: "重塑电动边界",
    description: "从材料到系统，打造工业级高安全能量核心。",
    ctaText: "查看产品",
    ctaLink: "/products/cloudchi-360-p",
    stats: [
      { value: "460+", unit: "Wh/kg", label: "能量密度" },
      { value: "10C", unit: "", label: "峰值放电" },
      { value: "300+", unit: "次", label: "循环寿命" },
    ],
  },
];

// Transform banner data to HeroSlide format
interface Banner {
  id: string;
  title?: string;
  titleZh?: string;
  subtitle?: string;
  subtitleZh?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  ctaText?: string;
  ctaTextZh?: string;
  sortOrder: number;
}

function transformBannersToSlides(banners: Banner[], locale: string): HeroSlide[] {
  return banners
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((banner, index) => ({
      id: index + 1,
      image: banner.image,
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
      stats: DEFAULT_SLIDES_EN[0].stats, // Use default stats for now
    }));
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
