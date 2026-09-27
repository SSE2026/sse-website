"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plane, Bot, Compass, Truck } from "lucide-react";

// ============================================
// Video sources (verified 9:16 vertical)
// ============================================
const STACK_VIDEOS: { id: string; src: string }[] = [
  { id: "lowaltitude", src: "/videos/energy-01-lowaltitude.mp4" },
  { id: "embodied",    src: "/videos/energy-02-embodied.mp4" },
  { id: "deepsea",     src: "/videos/energy-03-deepsea.mp4" },
  { id: "special",     src: "/videos/energy-04-special.mp4" },
];

const ACTIVE_TAB_INDEX = 3; // 04 Mining Vehicles is the default selected
const CYCLE_DURATION_MS = 6000;

export function EnergyStackHero({
  translations,
}: {
  translations?: { hero?: Record<string, unknown> };
}) {
  const t = useTranslations("hero");
  const heroRaw = useMemo(
    () => (translations?.hero ?? {}) as Record<string, unknown>,
    [translations],
  );

  type StackScenario = {
    id: string;
    index: string;
    indexLabel: string;
    en: string;
    zh: string;
    captionZh: string;
    captionEn: string;
    videoSrc: string;
  };

  const scenarios = useMemo<StackScenario[]>(() => {
    const stackRaw = heroRaw.energyStack as
      | { scenarios?: Omit<StackScenario, "videoSrc">[]; captionPrefixZh?: string; captionPrefixEn?: string }
      | undefined;
    const list = stackRaw?.scenarios ?? [];
    const fallback: StackScenario[] = [
      { id: "lowaltitude", index: "01", indexLabel: "01 / DRONES", en: "Drones", zh: "低空经济", captionZh: "为低空飞行器提供高比能动力，让飞行更远、更强、更自由", captionEn: "High-energy-density propulsion for farther, stronger, freer flight.", videoSrc: STACK_VIDEOS[0].src },
      { id: "embodied",    index: "02", indexLabel: "02 / ROBOTICS", en: "Robotics", zh: "具身智能", captionZh: "为下一代智能移动装备提供高性能能源", captionEn: "High-performance energy for next-gen mobile intelligent platforms.", videoSrc: STACK_VIDEOS[1].src },
      { id: "deepsea",     index: "03", indexLabel: "03 / EXPLORATION", en: "Exploration", zh: "深空深海", captionZh: "面向极端环境的高安全、高可靠能源系统", captionEn: "High-safety, high-reliability energy for extreme environments.", videoSrc: STACK_VIDEOS[2].src },
      { id: "special",     index: "04", indexLabel: "04 / MINING VEHICLES", en: "Mining Vehicles", zh: "特种装备", captionZh: "为高负载、高机动装备提供持续动力", captionEn: "Providing continuous power for high-load, high-mobility vehicles.", videoSrc: STACK_VIDEOS[3].src },
    ];
    const src = list.length === 4 ? list : fallback;
    return src.map((s, i) => {
      const videoSrc = STACK_VIDEOS[i]?.src ?? "";
      return {
        id: s.id,
        index: s.index,
        indexLabel: s.indexLabel,
        en: s.en,
        zh: s.zh,
        captionZh: s.captionZh,
        captionEn: s.captionEn,
        videoSrc,
      } as StackScenario;
    });
  }, [heroRaw]);

  const captionPrefixZh = (heroRaw.energyStack as { captionPrefixZh?: string } | undefined)?.captionPrefixZh ?? "场景";
  const captionPrefixEn = (heroRaw.energyStack as { captionPrefixEn?: string } | undefined)?.captionPrefixEn ?? "Scenario";

  const [activeIdx, setActiveIdx] = useState(ACTIVE_TAB_INDEX);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iconFor = (id: string) => {
    if (id === "lowaltitude") return Plane;
    if (id === "embodied") return Bot;
    if (id === "deepsea") return Compass;
    return Truck;
  };

  // Auto-cycle: progress 0→100 over CYCLE_DURATION_MS, then advance.
  // The whole chain is in one timer so the previous cycle's timer
  // never races with the next one.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const start = Date.now();
    const tick = () => {
      if (cancelled) return;
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / CYCLE_DURATION_MS) * 100);
      setProgress(pct);
      if (elapsed >= CYCLE_DURATION_MS) {
        setActiveIdx((i) => (i + 1) % scenarios.length);
        return;
      }
      timer = setTimeout(tick, 50);
    };
    tick();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [activeIdx, scenarios.length]);

  // Play the active clip. Pause + rewind the rest on rotate.
  // No currentTime=0 right before play() (Chromium ignores play()
  // when a seek is still in flight).
  useEffect(() => {
    if (videoRef.current) {
      try { videoRef.current.currentTime = 0; } catch { /* noop */ }
      const p = videoRef.current.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }, [activeIdx]);

  // Chromium pauses video-only media in hidden tabs to save power;
  // resume playback when the page becomes visible again.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (!videoRef.current) return;
      const p = videoRef.current.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const active = scenarios[activeIdx];

  return (
    <section
      className="relative w-full overflow-hidden bg-black text-white"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      {/* Background video — full bleed, fills the whole section. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <video
        ref={videoRef}
        src={active.videoSrc}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Feather mask — pure black on the left, fading into transparent
          so the video bleeds seamlessly into the brand area. The brand
          copy lives inside the opaque band (~50% of the width). */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, #000 0%, #000 40%, rgba(0,0,0,0.6) 60%, transparent 75%)",
        }}
      />

      {/* Brand content — vertically centered on the left, kept inside
          the opaque band so white text stays readable. */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[620px] flex flex-col justify-center min-h-[calc(100vh-80px-200px)]"
        >
          <div
            className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-white/55 mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            {(heroRaw.eyebrow as string) ?? "SHEN'AN LITHIUM ENERGY"}
          </div>

          <h1
            className="text-[34px] md:text-[44px] lg:text-[56px] font-bold leading-[1.08] tracking-[-0.015em] mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            <span className="block">
              <span className="text-shimmer-blue">突破</span>
              <span aria-hidden="true" className="mx-[0.12em] align-middle text-[0.18em] leading-none text-white/45">●</span>
              <span className="text-white">能量极限</span>
            </span>
            <span className="block">
              <span className="text-shimmer-amber">重塑</span>
              <span aria-hidden="true" className="mx-[0.12em] align-middle text-[0.18em] leading-none text-white/45">●</span>
              <span className="text-white">电动边界</span>
            </span>
          </h1>

          <p
            className="text-[14px] md:text-[16px] text-white/80 leading-[1.6] mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {heroRaw.subtitle as string ?? "高性能固态电池 · 为下一程蓄能"}
          </p>

          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/70 mb-8 md:mb-10"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {(["highEnergy","highPower","highSafety","fastCharging"] as const).map(
              (k, i, arr) => (
                <span key={k} className="inline-flex items-center gap-3">
                  <span>{t(`tags.${k}`)}</span>
                  {i < arr.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                  )}
                </span>
              )
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 bg-[#3B82F6] text-white text-[14px] font-semibold rounded-lg hover:bg-[#2563EB] transition-colors shadow-[0_0_36px_-8px_rgba(59,130,246,0.55)]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {(heroRaw.ctaExplore as string) ?? "立即登能"}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 border border-white/30 text-white text-[14px] font-semibold rounded-lg hover:bg-white/5 transition-colors"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {(heroRaw.ctaContact as string) ?? "联系我们"}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar: tab switcher (left) + scenario caption (right). Caption
              is absolutely positioned so it does NOT compete with the
              tabs for flex space — tabs therefore get the full 1fr and
              never wrap on the desktop sizes. */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-10">
        <div className="relative mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16 flex items-end gap-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-2">
            {scenarios.map((s, i) => {
              const isActive = i === activeIdx;
              const Icon = iconFor(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveIdx(i)}
                  aria-pressed={isActive}
                  aria-label={`${s.index} ${s.en}`}
                  className={[
                    "relative group inline-flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2 rounded-full",
                    "text-left transition-colors backdrop-blur-sm",
                    isActive
                      ? "bg-white/8 border border-[#3B82F6] shadow-[0_0_18px_-4px_rgba(59,130,246,0.7)]"
                      : "bg-white/4 border border-white/12 hover:border-white/30 hover:bg-white/8",
                  ].join(" ")}
                >
                  <Icon
                    className={
                      "w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 " +
                      (isActive ? "text-[#3B82F6]" : "text-white/55 group-hover:text-white/80")
                    }
                  />
                  <span
                    className="text-[10px] md:text-[11px] font-mono tracking-wider text-white/55"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {s.index}
                  </span>
                  <span
                    className="text-[12px] md:text-[13px] font-medium leading-none"
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    {s.en}
                  </span>
                  <span
                    className={
                      "hidden xl:inline text-[11px] leading-none " +
                      (isActive ? "text-white/55" : "text-white/35")
                    }
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    · {s.zh}
                  </span>

                  {/* Active progress bar */}
                  {isActive && (
                    <span
                      className="absolute -bottom-px left-0 h-[2px] bg-[#3B82F6] rounded-full"
                      style={{ width: `${progress}%` }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scenario caption — absolute so tabs get the full row width. */}
          <div
            className="hidden lg:block absolute right-6 lg:right-10 bottom-0 max-w-[420px] text-right text-[10px] md:text-[11px] leading-[1.7] text-white/55"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            <div className="mb-1">
              {captionPrefixZh} {active.index}: {active.zh} - {active.captionZh}
            </div>
            <div className="text-white/40">
              {captionPrefixEn} {active.index}: {active.en} - {active.captionEn}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}