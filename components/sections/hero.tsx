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
  sectionTitle?: string;
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
// Video carousel — fills whatever box it is given
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
    // The three source videos are 720x1280 (9:16 portrait), so the
    // container matches that ratio — otherwise object-cover crops the
    // top and bottom off each clip.
    <div className="relative h-[440px] md:h-[520px] aspect-[9/16] mx-auto lg:mx-0 overflow-hidden">
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
    </div>
  );
}

// ============================================
// Hero
// ============================================
export function Hero({ translations }: HeroProps) {
  const t = useTranslations("hero");
  const tr = ((translations as { hero?: HeroI18n } | undefined)?.hero ??
    {}) as HeroI18n;

  const titleLine1 = tr.titleLine1 ?? t("titleLine1");
  const titleLine2 = tr.titleLine2 ?? t("titleLine2");
  const sectionTitle = tr.sectionTitle ?? t("sectionTitle");
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
      {/* ============= Hero — owns the first viewport ============= */}
      <section className="relative w-full bg-black text-white lg:min-h-[calc(100vh-80px)] lg:flex lg:items-center">
        <div className="w-full max-w-6xl mx-auto px-8 md:px-14 lg:px-20 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* LEFT — title / subtitle / tags / CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              <h1
                className="text-[32px] md:text-[44px] lg:text-[56px] font-bold leading-[1.12] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                <span className="block">
                  <span className="text-shimmer-blue">{line1First}</span>
                  <span
                    aria-hidden="true"
                    className="mx-[0.12em] align-middle text-[0.18em] leading-none text-white/45"
                  >
                    ●
                  </span>
                  <span className="text-white">{line1Rest}</span>
                </span>
                <span className="block">
                  <span className="text-shimmer-amber">{line2First}</span>
                  <span
                    aria-hidden="true"
                    className="mx-[0.12em] align-middle text-[0.18em] leading-none text-white/45"
                  >
                    ●
                  </span>
                  <span className="text-white">{line2Rest}</span>
                </span>
              </h1>

              {/* Subtitle: smallest possible visual weight so the
                  headline stays the dominant element */}
              <p
                className="mt-7 md:mt-8 text-[11px] md:text-[12px] text-white/35 leading-[1.9] max-w-[48ch] tracking-[0.01em]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                {subtitle}
              </p>

              <div
                className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] md:text-[12px] text-white/55"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                {tagValues.map((label, i) => (
                  <span key={i} className="inline-flex items-center gap-3">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-white/30" />}
                    <span>{label}</span>
                  </span>
                ))}
              </div>

              {/* Extra space before the CTAs so the action reads as a
                  separate beat, not just another bullet */}
              <div className="mt-9 md:mt-11 flex flex-wrap gap-3">
                <Link
                  href="/cases"
                  className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 bg-[#3B82F6] text-white text-[13px] md:text-[14px] font-semibold rounded-lg hover:bg-[#2563EB] transition-colors shadow-[0_0_36px_-8px_rgba(59,130,246,0.55)]"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {ctaExplore}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 border border-white/30 text-white text-[13px] md:text-[14px] font-semibold rounded-lg hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {ctaContact}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* RIGHT — portrait 9:16 video, centered in its column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <VideoCarouselCard />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= Application scenarios ============= */}
      <section className="bg-black text-white border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="mb-8 md:mb-10 flex items-baseline justify-between">
            <h2
              className="text-[18px] md:text-[20px] font-semibold text-white"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {sectionTitle}
            </h2>
            <span
              className="text-[11px] md:text-[12px] tracking-[0.25em] uppercase text-white/40"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              04 Scenarios
            </span>
          </div>

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