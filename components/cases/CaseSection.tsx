"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CaseSectionProps {
  id: string;
  highlight: string;
  videoPath: string;
  locale: string;
  platform?: string;
  battery?: string;
  highlightLabel?: string;
}

// Define stats keys for each case (no duplicates with highlight)
const CASE_STATS: Record<string, string[]> = {
  "case-1": ["weight", "temperature"],
  "case-2": ["coldPerformance"],
  "case-3": ["flightTime", "temperature"],
  "case-4": ["endurance"],
};

export function CaseSection({
  id,
  highlight,
  videoPath,
  locale,
  platform,
  battery,
  highlightLabel,
}: CaseSectionProps) {
  const t = useTranslations("casesPage");
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Get case number from id (pad to 2 digits)
  const caseNum = id.replace("case-", "").padStart(2, "0");

  // Get translations for this case (CMS props override messages)
  const caseData = {
    caseNumber: t(`case${caseNum}.caseNumber`),
    platform: platform || t(`case${caseNum}.platform`),
    battery: battery || t(`case${caseNum}.battery`),
    highlightLabel: highlightLabel || t(`case${caseNum}.highlightLabel`),
  };

  // Get only the stats that exist for this case
  const statsKeys = CASE_STATS[id] || [];
  const statsList = statsKeys.map((key) => ({
    key,
    ...(t.raw(`case${caseNum}.stats.${key}`) as { value: string; label: string }),
  }));

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full bg-[#050505] text-[#F5F5F5] py-20 lg:py-28 px-6 md:px-16 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left: Video (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] aspect-video"
        >
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src={videoPath} type="video/mp4" />
          </video>
        </motion.div>

        {/* Right: Data & Text (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-5 flex flex-col justify-center space-y-8 min-w-0"
        >
          {/* Tag / Subtitle */}
          <div>
            <p className="text-xs font-mono tracking-widest text-[#8A8A8A] uppercase mb-2">
              {caseData.caseNumber} / {caseData.platform}
            </p>
          </div>

          {/* Main Highlight Data */}
          <div className="border-l-2 border-white/20 pl-6 py-2">
            <div className="text-6xl md:text-7xl font-extrabold tracking-tighter text-white">
              {highlight.includes('%') ? (
                <>
                  {highlight.replace('%', '')}
                  <span className="text-4xl font-normal text-white">%</span>
                </>
              ) : (
                highlight
              )}
            </div>
            <p className="text-sm font-medium text-[#8A8A8A] mt-1">
              {caseData.highlightLabel}
            </p>
          </div>

          {/* Secondary Stats Grid */}
          {statsList.length > 0 && (
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              {statsList.slice(0, 4).map((stat, index) => (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                >
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
              {/* Battery Architecture */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + statsList.length * 0.05 }}
              >
                <div className="text-2xl font-bold text-white tracking-tight">
                  {caseData.battery}
                </div>
                <div className="text-xs text-[#8A8A8A] mt-0.5">
                  {t("batteryArchitecture")}
                </div>
              </motion.div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium group"
            >
              {t("cta.primary")}
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
