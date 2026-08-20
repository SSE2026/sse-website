"use client";

import HeroCarousel, { HeroSlide } from "@/components/ui/hero-carousel/HeroCarousel";

// Hero slides - Video 1 + Images 2, 3
const HERO_SLIDES_EN: HeroSlide[] = [
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

const HERO_SLIDES_ZH: HeroSlide[] = [
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

interface HeroProps {
  translations: any;
  locale: string;
}

export function Hero({ locale }: HeroProps) {
  const slides = locale === "zh" ? HERO_SLIDES_ZH : HERO_SLIDES_EN;

  return <HeroCarousel slides={slides} autoPlayInterval={3000} />;
}
