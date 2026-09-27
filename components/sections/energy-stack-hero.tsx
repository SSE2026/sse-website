"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

// ============================================
// Video sources (verified 9:16 vertical)
// ============================================
const STACK_VIDEOS: { id: string; src: string }[] = [
  { id: "lowaltitude", src: "/videos/energy-01-lowaltitude.mp4" },
  { id: "embodied",    src: "/videos/energy-02-embodied.mp4" },
  { id: "deepsea",     src: "/videos/energy-03-deepsea.mp4" },
  { id: "special",     src: "/videos/energy-04-special.mp4" },
];

// Total cycle = 5s per scenario, matches the time-axis spec
const SCENARIO_DURATION_MS = 5000;

// Layer visual recipe — keep aligned with spec
type Layer = "active" | "second" | "third" | "fourth";
const LAYER_RECIPE: Record<Layer, { scale: number; opacity: number; z: number; offsetX: number; offsetY: number }> = {
  active: { scale: 1.00, opacity: 1.00, z: 4, offsetX:   0, offsetY:   0 },
  second: { scale: 0.88, opacity: 0.75, z: 3, offsetX:  -8, offsetY:  18 },
  third:  { scale: 0.76, opacity: 0.50, z: 2, offsetX: -14, offsetY:  34 },
  fourth: { scale: 0.64, opacity: 0.28, z: 1, offsetX: -18, offsetY:  48 },
};

export function EnergyStackHero({
  translations,
}: {
  translations?: { hero?: Record<string, unknown> };
}) {
  const t = useTranslations("hero");
  const heroRaw = (translations?.hero ?? {}) as Record<string, unknown>;

  // ---- scenario data (4 fixed entries) ----
  const scenarios = useMemo(() => {
    const raw = heroRaw.energyStack as
      | { scenarios?: { id: string; index: string; indexLabel: string; title: string; subtitle: string }[] }
      | undefined;
    const list = raw?.scenarios ?? [];
    // fall back to a stable Chinese-only copy if i18n is missing
    const fallback = [
      { id: "lowaltitude", index: "01", indexLabel: "01 / LOW-ALTITUDE ENERGY", title: "低空能源", subtitle: "高比能动力，让飞行更远、更强、更自由" },
      { id: "embodied",    index: "02", indexLabel: "02 / EMBODIED INTELLIGENCE", title: "具身智能", subtitle: "为下一代智能移动装备提供高性能能源" },
      { id: "deepsea",     index: "03", indexLabel: "03 / DEEP-SEA SYSTEMS", title: "深海设备", subtitle: "面向极端环境的高安全、高可靠能源系统" },
      { id: "special",     index: "04", indexLabel: "04 / SPECIALIZED EQUIPMENT", title: "特种装备", subtitle: "为高负载、高机动装备提供持续动力" },
    ];
    const src = list.length === 4 ? list : fallback;
    return src.map((s, i) => ({
      ...s,
      videoSrc: STACK_VIDEOS[i].src,
      videoId: STACK_VIDEOS[i].id,
    }));
  }, [heroRaw]);

  // ---- active state machine ----
  // "phase" = what the timeline is currently doing; used to gate the
  // animation of the text and guide line so they move in sync with the
  // video rotation, not before / after.
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<"settle" | "guide-in" | "show" | "guide-out">("settle");

  // refs for the 4 video elements so we can play/pause based on demand
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Cycle: every SCENARIO_DURATION_MS, rotate the stack and reset the
  // phase timeline so the guide line + text sync to the new active.
  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const run = () => {
      if (cancelled) return;
      // phase timing — see spec section 十一
      setPhase("settle");      // 0.0s
      setTimeout(() => { if (!cancelled) setPhase("guide-in"); }, 200);    // 0.2s
      setTimeout(() => { if (!cancelled) setPhase("show");    }, 700);    // 0.7s
      setTimeout(() => { if (!cancelled) setPhase("guide-out"); }, 3500); // 3.5s
      setTimeout(() => {
        if (!cancelled) {
          setPhase("settle");
          setActiveIdx((i) => (i + 1) % scenarios.length);
        }
      }, 4400); // 4.4s — rotation happens, next cycle starts at 5.0s
    };

    run();
    intervalId = setInterval(run, SCENARIO_DURATION_MS);
    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [scenarios.length]);

  // play/pause each video based on whether it's the active one.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) {
        // restart from frame 0 each time it becomes active
        try { v.currentTime = 0; } catch { /* noop */ }
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIdx]);

  const active = scenarios[activeIdx];

  return (
    <section
      className="relative w-full overflow-hidden bg-black text-white"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div className="relative z-[2] h-full w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-16 md:pt-20 pb-12 md:pb-16">
        <div className="flex h-full min-h-[calc(100vh-80px-160px)] flex-col lg:flex-row items-center gap-8 lg:gap-14">
          {/* =========================================================
              LEFT — brand hero block
              ========================================================= */}
          <div className="flex-1 min-w-0 flex flex-col justify-center max-w-[560px]">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-white/35 mb-6 md:mb-8"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              {(heroRaw.eyebrow as string) ?? "SHEN'AN LITHIUM ENERGY"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
              className="text-[36px] md:text-[48px] lg:text-[60px] font-bold leading-[1.08] tracking-[-0.015em]"
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
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] md:text-[13px] text-white/55"
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
            </motion.div>
          </div>

          {/* =========================================================
              MIDDLE — fixed application text
              (sits between brand and the stack, fixed X, content swaps)
              ========================================================= */}
          <div className="w-full lg:w-[300px] xl:w-[340px] flex-shrink-0 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4 text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-white/35"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              {(heroRaw.energyStack as { eyebrowLine?: string } | undefined)?.eyebrowLine ?? "ENERGY STACK"}
            </motion.div>

            {/* Text swaps with the active video. The container itself
                stays put — only the inner content animates. */}
            <div className="relative min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: phase === "guide-out" ? 0 : 1,
                    y: phase === "guide-out" ? -8 : 0,
                  }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div
                    className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-white/45 mb-3"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {active.indexLabel}
                  </div>
                  <h2
                    className="text-[28px] md:text-[32px] lg:text-[38px] font-bold leading-[1.1] tracking-[-0.01em] mb-4"
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    {active.title}
                  </h2>
                  <p
                    className="text-[13px] md:text-[14px] text-white/55 leading-[1.85] max-w-[300px]"
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    {active.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* =========================================================
              RIGHT — Energy Stack
              Four 9:16 videos stacked, offset, scaled. The guide line
              runs from the active video's left edge to the text.
              ========================================================= */}
          <div className="relative w-[240px] md:w-[280px] lg:w-[300px] h-[580px] md:h-[660px] lg:h-[680px] flex-shrink-0">
            {/* Guide line (active only). Grows from the active video's
                left edge out to the text block, then collapses back. */}
            <GuideLine phase={phase} />

            <div className="relative w-full h-full">
              {scenarios.map((s, i) => {
                const layer = layerFor(i, activeIdx, scenarios.length);
                const recipe = LAYER_RECIPE[layer];
                const isActive = layer === "active";
                return (
                  <motion.div
                    key={s.id}
                    initial={false}
                    animate={{
                      scale: recipe.scale,
                      opacity: recipe.opacity,
                      x: recipe.offsetX,
                      y: recipe.offsetY,
                    }}
                    transition={{
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      zIndex: recipe.z,
                      // Anchor at top-left of the stack box; the
                      // translate(x, y) below positions relative to
                      // that, and aspect-ratio keeps a strict 9:16.
                      // Scaled layers are visually offset but their
                      // layout box stays inside the parent so they
                      // cannot trigger horizontal scroll.
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "auto",
                      aspectRatio: "9 / 16",
                      transformOrigin: "0 0",
                      translate: `${-recipe.offsetX}px ${-recipe.offsetY}px`,
                    }}
                    className="rounded-[6px] overflow-hidden border border-white/8"
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={s.videoSrc}
                      autoPlay
                      muted
                      playsInline
                      loop
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Active marker dot on the left edge of the
                        active video. */}
                    {isActive && <ActiveNode phase={phase} />}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Helpers
// ============================================
function layerFor(
  index: number,
  activeIdx: number,
  total: number,
): Layer {
  // After rotation, the ordering cycles. "active" is the current
  // activeIdx; "second" is the next one in the cycle; "third" the
  // one after; "fourth" wraps around to the one before.
  if (index === activeIdx) return "active";
  const ahead1 = (activeIdx + 1) % total;
  const ahead2 = (activeIdx + 2) % total;
  const ahead3 = (activeIdx + 3) % total;
  if (index === ahead1) return "second";
  if (index === ahead2) return "third";
  if (index === ahead3) return "fourth";
  return "fourth";
}

// ============================================
// Active node — small filled dot on the active video's left edge
// ============================================
function ActiveNode({ phase }: { phase: "settle" | "guide-in" | "show" | "guide-out" }) {
  return (
    <motion.span
      initial={false}
      animate={{
        opacity: phase === "settle" ? 0 : 1,
        scale: phase === "settle" ? 0.6 : 1,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute top-1/2 -left-[5px] -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#3B82F6] shadow-[0_0_18px_2px_rgba(59,130,246,0.55)]"
    />
  );
}

// ============================================
// Guide line — 1px white-with-alpha line that grows from the active
// node out to the left, and collapses back. Width is keyed off the
// phase, not the height, so it always reaches the same X target.
// ============================================
function GuideLine({ phase }: { phase: "settle" | "guide-in" | "show" | "guide-out" }) {
  // The line lives in the same coordinate space as the stack box.
  // We place its right edge at the active node (left edge of the
  // active video) and let it grow leftward. The X target is roughly
  // -120px from the right edge on desktop, less on mobile.
  const widthMap = {
    settle: 0,
    "guide-in": 140,
    show: 140,
    "guide-out": 0,
  };
  return (
    <motion.div
      initial={false}
      animate={{ width: widthMap[phase] }}
      transition={{ duration: phase === "guide-out" ? 0.5 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-[calc(100%-2px)] h-px bg-gradient-to-l from-white/40 to-transparent"
    />
  );
}