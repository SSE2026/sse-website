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

interface HeroStats {
  value?: string;
  unit?: string;
  label?: string;
}

interface HeroContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  videoUrl?: string;
  posterUrl?: string;
  statsJson?: string;
  slidesJson?: string;
  stats?: HeroStats[];
}

// Build HeroSlide[] from CMS content (home.hero), falling back to defaults.
function buildSlidesFromCms(content: Record<string, unknown>, locale: string): HeroSlide[] {
  const hero = (content.hero ?? {}) as HeroContent & { slides?: HeroSlide[] };
  const defaults = locale === "zh" ? DEFAULT_SLIDES_ZH[0] : DEFAULT_SLIDES_EN[0];

  // Prefer slides array (migrated banners) or slidesJson, else single-field hero.
  const slidesFromJson = (() => {
    if (Array.isArray(hero.slides) && hero.slides.length > 0) return hero.slides;
    if (hero.slidesJson) {
      try {
        const parsed = JSON.parse(hero.slidesJson);
        if (Array.isArray(parsed)) return parsed as HeroSlide[];
      } catch {
        return undefined;
      }
    }
    return undefined;
  })();

  if (slidesFromJson && slidesFromJson.length > 0) {
    return slidesFromJson.map((s, i) => ({
      id: i + 1,
      mediaType: (s as { mediaType?: string }).mediaType === "VIDEO" ? "VIDEO" : undefined,
      image: (s as { image?: string }).image,
      videoUrl: (s as { videoUrl?: string }).videoUrl,
      posterUrl: (s as { posterUrl?: string }).posterUrl,
      mobileImage: (s as { mobileImage?: string }).mobileImage,
      loop: (s as { mediaType?: string }).mediaType === "VIDEO" ? true : undefined,
      imageAlt: (s as { title?: string }).title || "",
      eyebrow: defaults.eyebrow,
      title: (s as { title?: string }).title || defaults.title,
      description: (s as { subtitle?: string }).subtitle || defaults.description,
      ctaText: (s as { ctaText?: string }).ctaText || defaults.ctaText,
      ctaLink: (s as { ctaLink?: string }).ctaLink || defaults.ctaLink,
      stats: defaults.stats,
    }));
  }

  return [
    {
      id: 1,
      video: hero.videoUrl || defaults.video,
      loop: true,
      imageAlt: hero.title || defaults.imageAlt,
      eyebrow: hero.eyebrow || defaults.eyebrow,
      title: hero.title || defaults.title,
      description: hero.description || defaults.description,
      ctaText: hero.ctaText || defaults.ctaText,
      ctaLink: hero.ctaLink || defaults.ctaLink,
      stats: defaults.stats,
    },
  ];
}

interface HeroProps {
  translations?: unknown;
  locale: string;
}

export function Hero({ locale }: HeroProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(locale === "zh" ? DEFAULT_SLIDES_ZH : DEFAULT_SLIDES_EN);

  useEffect(() => {
    // Reset to defaults immediately on locale change, then try CMS.
    const defaults = locale === "zh" ? DEFAULT_SLIDES_ZH : DEFAULT_SLIDES_EN;
    setSlides(defaults);

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`/api/content/home?locale=${locale}`, {
          next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok || cancelled) return;

        const data = await response.json();
        const content = (data?.content ?? {}) as Record<string, unknown>;

        // Only override if the hero section actually has content.
        const hero = content.hero as Record<string, unknown> | undefined;
        if (hero && Object.keys(hero).length > 0) {
          setSlides(buildSlidesFromCms(content, locale));
        }
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return <HeroCarousel slides={slides} autoPlayInterval={3000} />;
}
