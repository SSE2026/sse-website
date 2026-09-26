"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";
import HeroCarousel, { HeroSlide } from "@/components/ui/hero-carousel/HeroCarousel";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";

const messages = { en, zh };

// Original homepage hero — kept here as the "second section" per request
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

export default function HomePage() {
  const [locale, setLocale] = useState<"en" | "zh">(() => resolveInitialLocale());
  const currentMessages = messages[locale];

  return (
    <>
      <ScrollProgress color="accent" height="sm" />
      <CursorFollower color="rgba(245, 158, 11, 0.08)" size={500} />

      <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
          forceLightText={true}
        />
        <main>
          {/* First section: editorial hero with panoramic bg, oversized title,
              subtitle + tags + 2 CTAs + bottom 4 scenario cards */}
          <Hero translations={currentMessages} locale={locale} />

          {/* Second section: original Aeroride hero (video + stats carousel) */}
          <HeroCarousel
            slides={locale === "zh" ? DEFAULT_SLIDES_ZH : DEFAULT_SLIDES_EN}
            autoPlayInterval={3000}
          />
        </main>
        <Footer translations={currentMessages} locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}