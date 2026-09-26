"use client";

import { useEffect, useRef, useState } from "react";
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
  "highSafety",
  "fastCharging",
] as const;

const VIDEO_SLIDE_DURATION_MS = 5000;

// Three product/hero videos to rotate through in the right-side card.
const CAROUSEL_VIDEOS = [
  { src: "/videos/homepage-hero-new.webm" },
  { src: "/videos/product-hero-new.mp4" },
  { src: "/videos/cases-hero.mp4" },
];

// ============================================
// Types
// ============================================
interface HeroProps {
  translations?: unknown;
  locale: string;
}

type ScenarioItem = {
  id: string;
  number: string;
  label: string;
  subLabel: string;
};

type HeroI18n = {
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  ctaExplore?: string;
  ctaContact?: string;
  tags?: Partial<Record<(typeof TAG_KEYS)[number], string>>;
  scenarios?: ScenarioItem[];
};

function splitTitle(title: string): { first: string; rest: string } {
  const idx = title.indexOf(" ");
  if (idx > 0) return { first: title.slice(0, idx), rest: title.slice(idx) };
  return { first: title.slice(0, 2), rest: title.slice(2) };
}

// ============================================
// Right-side video carousel card
// ============================================
function VideoCarouselCard() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto-rotate slides
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % CAROUSEL_VIDEOS.length);
    }, VIDEO_SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  // Play the active video, pause the others
  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active]);

  return (
    <div className="relative w-full aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
      {CAROUSEL_VIDEOS.map((slide, i) => (
        <video
          key={slide.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={slide.src}
          muted
          playsInline
          loop
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {CAROUSEL_VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Video ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-7 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Subtle vignette to add depth */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
}

// ============================================
// Hero Component
// ============================================
export function Hero({ translations }: HeroProps) {
  const t = useTranslations("hero");
  const tr = ((translations as { hero?: HeroI18n } | undefined)?.hero ??
    {}) as HeroI18n;

  const titleLine1 = tr.titleLine1 ?? t("titleLine1");
  const titleLine2 = tr.titleLine2 ?? t("titleLine2");
  const subtitle = tr.subtitle ?? t("subtitle");
  const ctaExplore = tr.ctaExplore ?? t("ctaExplore");
  const ctaContact = tr.ctaContact ?? t("ctaContact");

  const tagValues = TAG_KEYS.map(
    (key) => tr.tags?.[key] ?? t(`tags.${key}`),
  );

  const { first: line1First, rest: line1Rest } = splitTitle(titleLine1);
  const { first: line2First, rest: line2Rest } = splitTitle(titleLine2);

  const rawScenarios = (tr.scenarios ?? (t.raw("scenarios") as unknown)) as
    | ScenarioItem[]
    | undefined;
  const scenarios: ScenarioItem[] = Array.isArray(rawScenarios) &&
    rawScenarios.length > 0
    ? rawScenarios
    : [
        {
          id: "lowAltitude",
          number: "01",
          label: t("scenarios.0.label"),
          subLabel: t("scenarios.0.subLabel"),
        },
        {
          id: "embodiedAI",
          number: "02",
          label: t("scenarios.1.label"),
          subLabel: t("scenarios.1.subLabel"),
        },
        {
          id: "deepSpaceAndSea",
          number: "03",
          label: t("scenarios.2.label"),
          subLabel: t("scenarios.2.subLabel"),
        },
        {
          id: "specialEquipment",
          number: "04",
          label: t("scenarios.3.label"),
          subLabel: t("scenarios.3.subLabel"),
        },
      ];

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden bg-black text-white">
      {/* Content layer */}
      <div className="relative z-[2] w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          {/* LEFT: text content */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[36px] md:text-[52px] lg:text-[64px] font-bold leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              <span className="block">
                <span className="text-shimmer-blue">{line1First}</span>
                <span className="text-white">{line1Rest}</span>
              </span>
              <span className="block">
                <span className="text-shimmer-amber">{line2First}</span>
                <span className="text-white">{line2Rest}</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="mt-8 md:mt-10 text-[15px] md:text-[17px] text-gray-100 leading-[1.65] max-w-[58ch]"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-7 md:mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] md:text-[15px] text-white"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {tagValues.map((label, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  {i > 0 && (
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                  )}
                  <span>{label}</span>
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-4"
            >
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-[#3B82F6] text-white text-[14px] md:text-[15px] font-semibold rounded-lg hover:bg-[#2563EB] transition-colors shadow-[0_0_30px_-8px_rgba(59,130,246,0.5)]"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {ctaExplore}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 border border-white/30 text-white text-[14px] md:text-[15px] font-semibold rounded-lg hover:bg-white/5 transition-colors"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {ctaContact}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: video carousel card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <VideoCarouselCard />
            </motion.div>
          </div>
        </div>

        {/* Bottom: 4 scenario cards → /contact */}
        <div className="mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {scenarios.map((scenario, i) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + i * 0.08,
                ease: "easeOut",
              }}
            >
              <Link
                href="/contact"
                className="group flex items-start justify-between gap-3 rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-sm hover:bg-white/[0.12] hover:border-white/30 p-4 md:p-5 transition-all duration-300"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span
                    className="text-[10px] md:text-[11px] font-mono text-white/60 tracking-wider"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {scenario.number}
                  </span>
                  <div
                    className="text-[14px] md:text-base font-semibold text-white truncate"
                    style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                  >
                    {scenario.label}
                  </div>
                  <div
                    className="text-[11px] md:text-[12px] text-white/60"
                    style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                  >
                    {scenario.subLabel}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0 mt-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}