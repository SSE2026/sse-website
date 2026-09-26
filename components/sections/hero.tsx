"use client";

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

const HERO_BG_IMAGE_SRC = "/images/hero-product-panorama.png";

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
      {/* Full-bleed background image (panoramic product shot) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_BG_IMAGE_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay — stronger at left to keep title readable */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.4) 100%), linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-[2] w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-24 md:pt-36 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: dramatic oversized title + subtitle + tags + CTAs */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Main title — massive, two lines, "突破"/"重塑" get single-color
                shimmers (tech blue + amber) using logo colors */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[44px] md:text-[72px] lg:text-[104px] font-black leading-[1.02] tracking-[-0.02em]"
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

            {/* Subtitle — wider, more breathing */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="mt-10 md:mt-14 text-[18px] md:text-[20px] lg:text-[22px] text-gray-100 leading-[1.55] max-w-[36ch] font-light"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {subtitle}
            </motion.p>

            {/* Performance tags — larger, more spaced */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className="mt-10 md:mt-14 flex flex-wrap items-center gap-x-4 gap-y-3 text-[15px] md:text-[16px] text-white"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {tagValues.map((label, i) => (
                <span key={i} className="inline-flex items-center gap-4">
                  {i > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                  <span>{label}</span>
                </span>
              ))}
            </motion.div>

            {/* CTAs — bigger, more impact */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
              className="mt-12 md:mt-16 flex flex-wrap gap-4"
            >
              <Link
                href="/cases"
                className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-[#3B82F6] text-white text-base md:text-lg font-semibold rounded-xl hover:bg-[#2563EB] transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)]"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {ctaExplore}
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 border-2 border-white/40 text-white text-base md:text-lg font-semibold rounded-xl hover:bg-white/10 hover:border-white/70 transition-all"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {ctaContact}
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — intentionally empty so the panoramic image shows through */}
          <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />
        </div>

        {/* Bottom: 4 scenario cards → /contact */}
        <div className="mt-20 md:mt-32 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {scenarios.map((scenario, i) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.55 + i * 0.08,
                ease: "easeOut",
              }}
            >
              <Link
                href="/contact"
                className="group flex items-start justify-between gap-3 rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-sm hover:bg-white/[0.12] hover:border-white/30 p-5 md:p-6 transition-all duration-300"
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <span
                    className="text-[11px] md:text-xs font-mono text-white/60 tracking-wider"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {scenario.number}
                  </span>
                  <div
                    className="text-[16px] md:text-lg font-semibold text-white truncate"
                    style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                  >
                    {scenario.label}
                  </div>
                  <div
                    className="text-[12px] md:text-sm text-white/60"
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