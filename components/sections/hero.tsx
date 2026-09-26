"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

// ============================================
// Constants
// ============================================
const TAG_KEYS = [
  "highEnergy",
  "highPower",
  "safety",
  "fastCharging",
  "allClimate",
] as const;

const SCENARIO_KEYS = [
  "lowAltitude",
  "embodiedAI",
  "deepSpaceAndSea",
  "specialEquipment",
] as const;

const HERO_VIDEO_SRC = "/videos/homepage-hero-new.webm";

// ============================================
// Types
// ============================================
interface HeroProps {
  translations?: unknown;
  locale: string;
}

type HeroI18n = {
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  ctaText?: string;
  tags?: Partial<Record<(typeof TAG_KEYS)[number], string>>;
  scenarios?: Partial<Record<(typeof SCENARIO_KEYS)[number], string>>;
};

// ============================================
// Hero Component
// ============================================
export function Hero({ translations }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Resolve i18n strings — prefer translations prop (covers SSR fallback), else useTranslations.
  const t = useTranslations("hero");
  const tr = ((translations as { hero?: HeroI18n } | undefined)?.hero ??
    {}) as HeroI18n;

  const titleLine1 = tr.titleLine1 ?? t("titleLine1");
  const titleLine2 = tr.titleLine2 ?? t("titleLine2");
  const subtitle = tr.subtitle ?? t("subtitle");

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden bg-black text-white">
      {/* Background video - full bleed */}
      <video
        ref={videoRef}
        src={HERO_VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Darkening gradient for legibility */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-[2] w-full max-w-7xl mx-auto px-5 md:px-10 lg:px-16 pt-24 md:pt-28 pb-10 md:pb-14 flex flex-col min-h-[calc(100vh-80px)]">
        {/* Top block: main title + subtitle + performance tags */}
        <div className="flex-1 flex flex-col justify-center max-w-5xl">
          {/* Main title — two lines, both shimmer-highlighted */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[34px] md:text-[56px] lg:text-[72px] font-extrabold leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            <span className="block text-shimmer-logo">{titleLine1}</span>
            <span className="block text-shimmer-logo">{titleLine2}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-6 md:mt-8 text-[15px] md:text-[17px] text-white/85 leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            {subtitle}
          </motion.p>

          {/* Performance tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
            className="mt-7 md:mt-9 flex flex-wrap gap-2.5"
          >
            {TAG_KEYS.map((key) => (
              <span
                key={key}
                className="px-4 py-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm text-[13px] md:text-sm text-white/90"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {tr.tags?.[key] ?? t(`tags.${key}`)}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom block: four scenario cards → /contact */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {SCENARIO_KEYS.map((key) => {
            const label = tr.scenarios?.[key] ?? t(`scenarios.${key}`);
            return (
              <Link
                key={key}
                href="/contact"
                className="group relative overflow-hidden rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-sm p-5 md:p-6 hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="text-[15px] md:text-base font-medium text-white/95 leading-snug"
                    style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                  >
                    {label}
                  </div>
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}