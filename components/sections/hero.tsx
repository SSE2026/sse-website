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

const DRONE_IMAGE_SRC = "/images/scenes/drone-low-altitude.png";

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
  scene?: {
    number?: string;
    title?: string;
    titleEn?: string;
    caption?: string;
  };
  scenarios?: ScenarioItem[];
};

// Split title into [first, rest] for shimmer.
// Chinese (no space): first 2 chars get the shimmer.
// English (has space): first word gets the shimmer.
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

  const sceneNumber = tr.scene?.number ?? t("scene.number");
  const sceneTitle = tr.scene?.title ?? t("scene.title");
  const sceneTitleEn = tr.scene?.titleEn ?? t("scene.titleEn");
  const sceneCaption = tr.scene?.caption ?? t("scene.caption");

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
      <div className="relative z-[2] w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-20 md:pt-28 pb-12 md:pb-16">
        {/* Two-column main content. items-end aligns the right column with the
            bottom of the left column's CTAs. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* LEFT: text content */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Main title — first 2 chars / first word get the shimmer logo */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[36px] md:text-[52px] lg:text-[64px] font-bold leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              <span className="block">
                <span className="text-shimmer-logo">{line1First}</span>
                <span className="text-white">{line1Rest}</span>
              </span>
              <span className="block">
                <span className="text-shimmer-logo">{line2First}</span>
                <span className="text-white">{line2Rest}</span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="mt-8 md:mt-10 text-[16px] md:text-[17px] text-gray-300 leading-[1.7] max-w-[58ch]"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {subtitle}
            </motion.p>

            {/* Performance tags */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] md:text-[15px] text-gray-100"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {tagValues.map((label, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  {i > 0 && (
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                  )}
                  <span>{label}</span>
                </span>
              ))}
            </motion.div>

            {/* CTAs — bottom of this column is the alignment reference */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="mt-10 md:mt-14 flex flex-wrap gap-3 md:gap-4"
            >
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 bg-[#2563EB] text-white text-sm md:text-[15px] font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {ctaExplore}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 border border-white/30 text-white text-sm md:text-[15px] font-semibold rounded-lg hover:bg-white/5 transition-colors"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {ctaContact}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: drone image. items-end on the parent grid aligns this
              column's bottom with the CTAs' bottom on the left. */}
          <div className="lg:col-span-5 self-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="relative aspect-[5/4] w-full rounded-2xl overflow-hidden border border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DRONE_IMAGE_SRC}
                alt="Low-altitude aviation drone"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Scene info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                <div className="flex items-end gap-4">
                  <span
                    className="text-[48px] md:text-[64px] leading-none font-bold text-white/15"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {sceneNumber}
                  </span>
                  <div className="flex-1 pb-1">
                    <div
                      className="text-[15px] md:text-base font-semibold text-white"
                      style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                    >
                      {sceneTitle}
                    </div>
                    <div className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-gray-400 mt-1">
                      {sceneTitleEn}
                    </div>
                    <div className="text-[10px] md:text-[11px] text-gray-500 mt-2 leading-relaxed">
                      {sceneCaption}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom: 4 scenario cards → /contact */}
        <div className="mt-16 md:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
                className="group flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 p-5 md:p-6 transition-all duration-300"
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <span
                    className="text-[10px] md:text-[11px] font-mono text-gray-500 tracking-wider"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {scenario.number}
                  </span>
                  <div
                    className="text-[15px] md:text-base font-semibold text-white truncate"
                    style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                  >
                    {scenario.label}
                  </div>
                  <div
                    className="text-[12px] md:text-[13px] text-gray-400"
                    style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                  >
                    {scenario.subLabel}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0 mt-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}