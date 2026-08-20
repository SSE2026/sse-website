"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Animated counter component
function AnimatedStat({ value, prefix = "", suffix = "", duration = 2 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

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
            setCount(Math.round(value * eased));

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
  }, [value, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white">
      {prefix}{count}{suffix}
    </div>
  );
}

export function ProductsHero() {
  const t = useTranslations("productsPage.hero");

  return (
    <section className="relative w-full min-h-screen bg-[#050505] text-[#F5F5F5] pt-28 pb-20 px-6 md:px-16 overflow-hidden flex items-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto w-full">
        {/* Top Section - Badge, Title */}
        <div className="text-center mb-16">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">{t("title").split(' ').slice(1).join(' ')}</span>
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
            className="text-base text-[#8A8A8A] max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-8 border-t border-white/10 grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <AnimatedStat value={460} suffix="+ Wh/kg" duration={1.5} />
            <p className="text-xs text-[#8A8A8A] mt-1">{t("stats.energyDensity")}</p>
          </div>
          <div>
            <AnimatedStat value={10} suffix="C" duration={1.5} />
            <p className="text-xs text-[#8A8A8A] mt-1">{t("stats.peakDischarge")}</p>
          </div>
          <div>
            <AnimatedStat value={800} suffix="+" duration={1.5} />
            <p className="text-xs text-[#8A8A8A] mt-1">{t("stats.cycleLife")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
