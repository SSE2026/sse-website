import type { HeroSlide } from "./HeroCarousel";

// Aeroride series brand showcase. Used by both the legacy home page
// second screen and the products page hero, so the data lives here
// rather than being duplicated.
export const AERORIDE_SLIDES_EN: HeroSlide[] = [
  {
    id: 1,
    video: "/videos/homepage-hero-new.webm",
    loop: true,
    imageAlt: "Aeroride Series Solid-State Battery",
    eyebrow: "Solid-State Battery Tech",
    title: "Aeroride Series",
    description:
      "Next-generation high energy density solid-state power solutions for low-altitude flight, embodied AI, and deep-sea equipment.",
    ctaText: "Customize Now",
    ctaLink: "/contact",
  },
];

export const AERORIDE_SLIDES_ZH: HeroSlide[] = [
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
  },
];