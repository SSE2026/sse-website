"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CoreTechSlide {
  title: string;
  summary: string;
  image: string;
  /** Confirmed advantages. Left empty until real material exists — no
   *  performance figures are invented here. */
  points?: string[];
}

interface CoreTechCarouselProps {
  label?: string;
  title?: string;
  slides: CoreTechSlide[];
  /** Milliseconds each slide holds before advancing. */
  interval?: number;
}

/**
 * Technology showcase — the picture fills the frame with the copy laid
 * over it: section header top-left, the technology bottom-left, and the
 * prev/next controls bottom-right.
 *
 * Cover fit, so the frame is always full edge to edge. The pictures are
 * authored 16:9 and a browser content box rarely is — 2.38 on a short,
 * wide window — so about a quarter comes off the top and bottom there.
 * That only costs something if the render carries detail to its edges or
 * puts its subject off-centre; a source with a generous margin survives
 * the crop intact.
 *
 * The copy sits straight on the picture in plain white — no scrim, no
 * panel, no shadow. These renders measure 164–222 luma where the text
 * sits, so white scores only about 1.3–3.9 against them, under the 4.5
 * that body text needs. That trade is deliberate. Legibility therefore
 * rides entirely on the artwork, which is why the two copy bands are
 * kept visually quiet in each render: 01 and 03 are clean, 02 and 05
 * still carry clutter in the lower band.
 */
export function CoreTechCarousel({
  label,
  title,
  slides,
  interval = 6000,
}: CoreTechCarouselProps) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const reducedMotion = useReducedMotion();
  const count = slides.length;

  const go = useCallback(
    (delta: number) => setIndex((current) => (current + delta + count) % count),
    [count],
  );

  // `index` is a dependency so the interval restarts on every change:
  // each slide gets a full interval, and stepping manually does not leave
  // a nearly-expired timer waiting to yank the slide away.
  useEffect(() => {
    if (reducedMotion || held || !inView || count < 2) return;
    const id = window.setInterval(() => go(1), interval);
    return () => window.clearInterval(id);
  }, [reducedMotion, held, inView, count, interval, go, index]);

  useEffect(() => {
    if (!inView || count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, count, go]);

  if (count === 0) return null;

  const active = slides[index];
  const points = active.points ?? [];

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={title || label || "Core technologies"}
      className="relative h-auto md:h-screen w-full select-none overflow-hidden bg-[#050B14] md:bg-[#F7F8FB] text-[#0A0A0F]"
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      {/* Full-bleed picture, cross-faded on opacity alone.
          手机上先占一块 16:9 画框、图片用 contain 完整显示(这几张原图比例
          从 1.78 到 2.37 不等,cover 在竖屏会裁掉七成以上);md 起恢复铺满整屏。 */}
      <div className="relative w-full aspect-[16/9] md:absolute md:inset-0 md:aspect-auto">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDuration: reducedMotion ? "0ms" : "900ms" }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-contain md:object-cover"
            />
          </div>
        ))}
      </div>

      {/* Local darkening behind the copy block. Light type needs a dark
          backdrop: at 4.5 contrast the surface under it has to come down
          to about 119 luma, and these renders sit at 164–222 where the
          text lands, so no light colour can work on its own. This is a
          soft radial pool over the top-left, not a full-width band — the
          rest of the frame is untouched and the edge is a fade, not a
          line. The ellipse is sized to the copy block (42% x 25% of the
          frame) and no larger, so the darkening stays off the picture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(86% 66% at 13% 25%, rgba(5,11,20,0.70) 0%, rgba(5,11,20,0.51) 40%, rgba(5,11,20,0) 74%)",
        }}
      />

      {/* Copy, laid over the picture. The section title and the technology
          it introduces are one block at the top-left: splitting them to
          opposite corners left 433px of dead space between them. */}
      <div className="relative z-10 flex flex-col px-8 pt-8 pb-8 md:h-full md:px-16 md:pt-24">
        <div className="max-w-3xl">
          {/* Section header — top-padded to clear the fixed nav. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 text-[10px] tracking-[0.3em] text-white uppercase">
              {label || "CORE TECHNOLOGY"}
            </p>
            <h2 className="text-[clamp(1.4rem,2.2vw,2rem)] font-medium leading-tight tracking-tight text-white">
              {title}
            </h2>
          </motion.div>

          <div aria-live="polite" className="mt-12">
            <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-tight text-white">
              {active.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-base">
              {active.summary}
            </p>

            {points.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E3380]" />
                    <span className="text-xs leading-relaxed text-white/85 md:text-sm">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Controls, pinned to the bottom. */}
        <div
          className="mt-auto flex items-center justify-center gap-2 pt-10"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous technology"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[#0A0A0F]/75 text-white transition-colors hover:bg-[#0A0A0F]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next technology"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[#0A0A0F]/75 text-white transition-colors hover:bg-[#0A0A0F]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
