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

const CAROUSEL_VIDEOS = [
  { src: "/videos/vertical-takeoff.mp4" },
  { src: "/videos/deepsea-deepspace-exploration.mp4" },
  { src: "/videos/embodied-ai-robot-operation.mp4" },
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
// Edge-less 4:3 video card
// ============================================
function VideoCarouselCard() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % CAROUSEL_VIDEOS.length);
    }, VIDEO_SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

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
    <div className="relative w-full max-w-[320px] aspect-[4/3] overflow-hidden">
      {CAROUSEL_VIDEOS.map((slide, i) => (
        <video
          key={slide.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={slide.src}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
        {CAROUSEL_VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Video ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// Hero Component (calm 7/5 split)
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
    <>
      {/* ============= Hero (calm editorial) ============= */}
      <section className="relative w-full bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-10 md:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT: title + subtitle + tags + CTAs (7/12) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col"
            >
              <h1
                className="text-[30px] md:text-[40px] lg:text-[52px] font-bold leading-[1.1] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                <span className="block">
                  <span className="text-shimmer-blue">{line1First}</span>
                  <span className="text-white">{line1Rest}</span>
                </span>
                <span className="block">
                  <span className="text-shimmer-amber">{line2First}</span>
                  <span className="text-white">{line2Rest}</span>
                </span>
              </h1>

              <p
                className="mt-5 md:mt-6 text-[15px] md:text-[16px] text-gray-100 leading-[1.7] max-w-[54ch]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                {subtitle}
              </p>

              <div
                className="mt-5 md:mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-white"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                {tagValues.map((label, i) => (
                  <span key={i} className="inline-flex items-center gap-3">
                    {i > 0 && (
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                    )}
                    <span>{label}</span>
                  </span>
                ))}
              </div>

              <div className="mt-6 md:mt-7 flex flex-wrap gap-3">
                <Link
                  href="/cases"
                  className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#3B82F6] text-white text-[14px] font-semibold rounded-lg hover:bg-[#2563EB] transition-colors shadow-[0_0_30px_-8px_rgba(59,130,246,0.5)]"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {ctaExplore}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 border border-white/30 text-white text-[14px] font-semibold rounded-lg hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {ctaContact}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* RIGHT: video carousel (5/12) */}
            <div className="lg:col-span-5 flex items-start justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <VideoCarouselCard />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= 4 scenario cards (own section, border-top divider) ============= */}
      <section className="bg-black text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {scenarios.map((scenario, i) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + i * 0.06,
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
                      style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                    >
                      {scenario.label}
                    </div>
                    <div
                      className="text-[11px] md:text-[12px] text-white/60"
                      style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
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
    </>
  );
}