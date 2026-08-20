"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PIN_VH_MULTIPLE = 3.2;
const IMMERSE_OVERFILL = 1.04;
const ENTRY_DELAY = 0.2;
const CARD_START_SCALE_DESKTOP = 0.6;
const CARD_START_SCALE_MOBILE = 0.82;

export type HeroScrubProps = {
  images: string[];
  titleTop: string;
  titleBottom: string;
  bgClassName?: string;
  accentHex?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export function HeroScrub({
  images,
  titleTop,
  titleBottom,
  bgClassName = "bg-[#0A0A0A]",
  accentHex = "#2563EB",
}: HeroScrubProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnRef = useRef<number>(-1);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleTopRef = useRef<HTMLHeadingElement>(null);
  const titleBottomRef = useRef<HTMLHeadingElement>(null);

  const [ready, setReady] = useState(false);
  const [framesOk, setFramesOk] = useState(true);
  const [aspect, setAspect] = useState<number>(16 / 9);
  const reduced = usePrefersReducedMotion();
  const frameCount = images.length;

  // Load images
  useEffect(() => {
    if (reduced || !images.length) return;
    let cancelled = false;
    let errorCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const onFirstReady = (img: HTMLImageElement) => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (canvas && img.naturalWidth && img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        lastDrawnRef.current = 0;
        setAspect(img.naturalWidth / img.naturalHeight);
      }
      setReady(true);
    };

    images.forEach((src, i) => {
      const img = new window.Image();
      img.decoding = "async";
      if (i < 3) (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high";

      img.onload = () => {
        if (cancelled) return;
        loadedImages[i] = img;
        if (i === 0) onFirstReady(img);
      };

      img.onerror = () => {
        errorCount++;
        if (errorCount >= 3) setFramesOk(false);
      };

      img.src = src;
    });

    imagesRef.current = loadedImages;

    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled && !loadedImages[0]?.complete) setFramesOk(false);
    }, 5000);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [reduced, images]);

  // Entry animation
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: ENTRY_DELAY });
      tl.from(bgRef.current, { opacity: 0, duration: 1.4, ease: "power2.out" });
      tl.from(cardRef.current, { opacity: 0, scale: 0.8, duration: 1.1, ease: "power3.out" }, 0.35);
      tl.from(titleTopRef.current, { opacity: 0, y: 50, duration: 1, ease: "expo.out" }, 0.5);
      tl.from(titleBottomRef.current, { opacity: 0, y: -50, duration: 1, ease: "expo.out" }, 0.6);
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  // Scroll-driven animation
  useEffect(() => {
    if (reduced || !ready || !framesOk || frameCount === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const startScale = () =>
        window.innerWidth < 768 ? CARD_START_SCALE_MOBILE : CARD_START_SCALE_DESKTOP;

      const isLoaded = (i: number) => {
        const img = imagesRef.current[i];
        return !!img && img.complete && img.naturalWidth > 0;
      };

      const drawFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let useIdx = index;
        if (!isLoaded(useIdx)) {
          let found = -1;
          for (let d = 1; d < frameCount; d++) {
            if (useIdx - d >= 0 && isLoaded(useIdx - d)) { found = useIdx - d; break; }
            if (useIdx + d < frameCount && isLoaded(useIdx + d)) { found = useIdx + d; break; }
          }
          if (found === -1) return;
          useIdx = found;
        }
        if (lastDrawnRef.current === useIdx) return;
        const img = imagesRef.current[useIdx];
        const ctx2 = canvas.getContext("2d");
        if (!ctx2 || !img) return;
        ctx2.drawImage(img, 0, 0, canvas.width, canvas.height);
        lastDrawnRef.current = useIdx;
      };

      gsap.set(cardRef.current, { scale: startScale(), transformOrigin: "50% 50%" });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const mapped = gsap.utils.clamp(0, 1, (p - 0.1) / 0.8);
            const frameIdx = Math.min(frameCount - 1, Math.floor(mapped * frameCount));
            drawFrame(frameIdx);
          },
        },
      });

      // Phase 1: Scale up card, slide titles
      master.to(cardRef.current, { scale: 1, ease: "power2.out", duration: 0.15 }, 0);
      master.to(titleTopRef.current, {
        x: () => (window.innerWidth < 768 ? "-80vw" : "-65vw"),
        opacity: 0,
        ease: "power2.inOut",
        duration: 0.15,
      }, 0);
      master.to(titleBottomRef.current, {
        x: () => (window.innerWidth < 768 ? "80vw" : "65vw"),
        opacity: 0,
        ease: "power2.inOut",
        duration: 0.15,
      }, 0);

      // Phase 2: Immerse (full zoom)
      const immerseScale = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const baseW = Math.min(vw * 0.96, vh * 0.72 * aspect);
        const baseH = Math.min(vh * 0.72, (vw * 0.96) / aspect);
        if (baseW <= 0 || baseH <= 0) return 1.5;
        return Math.max(vw / baseW, vh / baseH) * IMMERSE_OVERFILL;
      };
      master.to(cardRef.current, { scale: immerseScale(), ease: "power2.in", duration: 0.65 }, 0.1);

      // Phase 3: Reset
      master.to(cardRef.current, { scale: startScale(), ease: "power3.inOut", duration: 0.2 }, 0.8);
      master.to(titleTopRef.current, {
        x: 0, opacity: 1, ease: "power2.inOut", duration: 0.2,
      }, 0.8);
      master.to(titleBottomRef.current, {
        x: 0, opacity: 1, ease: "power2.inOut", duration: 0.2,
      }, 0.8);

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, framesOk, reduced, aspect, frameCount]);

  const tallHeight = `${(PIN_VH_MULTIPLE + 1) * 100}vh`;

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-clip text-white ${bgClassName}`}
      style={{ height: tallHeight }}
      aria-label="Cinematic scroll-scrubbed hero"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div ref={bgRef} aria-hidden className="absolute inset-0 z-0" style={{ backgroundColor: accentHex }} />
        <div aria-hidden className="absolute inset-0 z-0 bg-black/30" />
        <div aria-hidden className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 50%)",
        }} />
        <div aria-hidden className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }} />

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 md:gap-6">
          <h2 ref={titleTopRef} aria-hidden className="font-black uppercase text-white" style={{
            fontSize: "clamp(2.5rem, 10vw, 9rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}>{titleTop}</h2>

          <div ref={cardRef} className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20 will-change-transform" style={{
            width: `min(92vw, calc(65svh * ${aspect}))`,
            height: `min(65svh, 92vw / ${aspect})`,
            aspectRatio: aspect,
          }}>
            <div aria-hidden className="pointer-events-none absolute inset-0 z-20" style={{
              boxShadow: "inset 0 0 100px rgba(0,0,0,0.4)",
            }} />
            {framesOk && (
              <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            )}
          </div>

          <h2 ref={titleBottomRef} aria-hidden className="font-black uppercase text-white" style={{
            fontSize: "clamp(2.5rem, 10vw, 9rem)", lineHeight: 0.9, letterSpacing: "-0.03em",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}>{titleBottom}</h2>
        </div>
      </div>
    </section>
  );
}
