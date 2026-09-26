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
  eyebrow?: string;
  topRightTag?: string;
  topRightLink?: string;
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

// ============================================
// Hero Component
// ============================================
export function Hero({ translations }: HeroProps) {
  const t = useTranslations("hero");
  const tr = ((translations as { hero?: HeroI18n } | undefined)?.hero ??
    {}) as HeroI18n;

  const eyebrow = tr.eyebrow ?? t("eyebrow");
  const topRightTag = tr.topRightTag ?? t("topRightTag");
  const topRightLink = tr.topRightLink ?? t("topRightLink");
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

  // Resolve scenarios: prefer translations prop, fall back to useTranslations().raw
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
    <section className="relative w-full min-h-[calc(100vh-80px)] bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-24 md:pt-28 pb-10 md:pb-14">
        {/* Top bar: eyebrow (left) + brand mark + scenario link (right) */}
        <div className="flex items-center justify-between gap-4 mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm md:text-[15px] font-medium text-[#F59E0B]"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            {eyebrow}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden sm:flex items-center gap-6"
          >
            <span className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-gray-400">
              {topRightTag}
            </span>
            <Link
              href="#scenarios"
              className="text-sm md:text-[15px] text-gray-700 underline underline-offset-4 decoration-gray-400 hover:decoration-gray-700 transition-colors"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {topRightLink}
            </Link>
          </motion.div>
        </div>

        {/* Main content: two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT: text content */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Main title — two lines, second line in blue with underline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[40px] md:text-[56px] lg:text-[72px] font-extrabold leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              <span className="block text-[#0A0A0A]">{titleLine1}</span>
              <span className="block text-[#2563EB] underline underline-offset-[10px] decoration-[2.5px]">
                {titleLine2}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="mt-6 md:mt-8 text-[15px] md:text-[16px] text-gray-600 leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
            >
              {subtitle}
            </motion.p>

            {/* Performance tags (4 bullet-separated labels) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-7 md:mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] md:text-[15px] text-gray-800"
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

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-4"
            >
              <Link
                href="#scenarios"
                className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 bg-[#2563EB] text-white text-sm md:text-[15px] font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {ctaExplore}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 border border-[#2563EB] text-[#2563EB] text-sm md:text-[15px] font-semibold rounded-lg hover:bg-[#2563EB]/5 transition-colors"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {ctaContact}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: drone image with scene info overlay */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 to-sky-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DRONE_IMAGE_SRC}
                alt="Low-altitude aviation drone"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Scene info overlay (bottom) */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-white/95 via-white/70 to-transparent">
                <div className="flex items-end gap-4">
                  <span
                    className="text-[60px] md:text-[80px] leading-none font-extrabold text-gray-200"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {sceneNumber}
                  </span>
                  <div className="flex-1 pb-1">
                    <div
                      className="text-[15px] md:text-base font-semibold text-gray-900"
                      style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                    >
                      {sceneTitle}
                    </div>
                    <div className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-gray-500 mt-1">
                      {sceneTitleEn}
                    </div>
                    <div className="text-[10px] md:text-[11px] text-gray-400 mt-2 leading-relaxed">
                      {sceneCaption}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom: 4 scenario cards → /contact */}
        <div id="scenarios" className="mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
                className="group flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-100/80 hover:border-gray-200 p-5 md:p-6 transition-all duration-300"
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <span
                    className="text-[10px] md:text-[11px] font-mono text-gray-400 tracking-wider"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {scenario.number}
                  </span>
                  <div
                    className="text-[15px] md:text-base font-semibold text-gray-900 truncate"
                    style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                  >
                    {scenario.label}
                  </div>
                  <div
                    className="text-[12px] md:text-[13px] text-gray-500"
                    style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                  >
                    {scenario.subLabel}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0 mt-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}