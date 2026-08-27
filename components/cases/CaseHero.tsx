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
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black text-[#F5F5F5] overflow-hidden flex flex-col items-stretch justify-end">
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

      {/* Bottom darkening gradient so the stats stay legible */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Bottom stats — anchored to the very bottom of the viewport */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pb-6 md:pb-8 pt-8 border-t border-white/15 grid grid-cols-3 gap-8 text-center mt-auto"
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
    </section>
  );
}