"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Animated counter component
function AnimatedStat({ value, prefix = "", suffix = "", duration = 2 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const absValue = Math.abs(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const endTime = startTime + duration * 1000;

          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(absValue * eased));

            if (now < endTime) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [absValue, duration]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-white">
      {prefix}{value < 0 ? '-' : ''}{count}{suffix}
    </div>
  );
}

export function CaseHero() {
  const t = useTranslations("casesPage.hero");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays automatically (muted autoplay is allowed in all browsers)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black text-[#F5F5F5] overflow-hidden flex items-center justify-center">
      {/* Background Video - Full bleed */}
      <video
        ref={videoRef}
        src="/videos/cases-hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay on the whole hero for legibility */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Fan-shaped pure black overlay in the middle band of the hero */}
      <div className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center">
        <svg
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          className="w-full h-[42%] min-h-[260px]"
          aria-hidden="true"
        >
          {/* Fan/sector shape: left point -> top curve -> right point -> bottom curve -> close.
              Wider on the right edge, narrower on the left edge = classic fan/sector silhouette. */}
          <path
            d="M 60,150 Q 600,30 1180,150 Q 600,270 60,150 Z"
            fill="#000000"
          />
        </svg>
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pt-32 pb-20 flex flex-col min-h-screen">
        {/* TOP TEXT BLOCK — sits above the fan */}
        <div className="text-center">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block font-mono text-xs tracking-[0.3em] text-[#2563EB] uppercase mb-6"
          >
            {t("badge")}
          </motion.span>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">{t("title").split(' ')[0]} </span>
            <span className="text-shimmer">{t("title").split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          {/* Headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-[#F5F5F5] font-light mb-4"
          >
            {t("headline")}
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base text-[#C5C5C5] max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Spacer pushes the bottom stats down so the fan sits between the two text blocks */}
        <div className="flex-1 min-h-[80px]" />

        {/* BOTTOM TEXT BLOCK — sits below the fan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-white/15 grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <AnimatedStat value={-40} suffix="°C" duration={1.5} />
            <p className="text-xs text-[#C5C5C5] mt-2">{t("stats.coldResilient")}</p>
          </div>
          <div>
            <AnimatedStat value={150} suffix=" kg" duration={1.5} />
            <p className="text-xs text-[#C5C5C5] mt-2">{t("stats.maxPayload")}</p>
          </div>
          <div>
            <AnimatedStat value={63} prefix="+" suffix="%" duration={1.5} />
            <p className="text-xs text-[#C5C5C5] mt-2">{t("stats.flightTime")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}