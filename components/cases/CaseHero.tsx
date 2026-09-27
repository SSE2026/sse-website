"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function CaseHero({ title, subtitle }: { title?: string; subtitle?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black text-[#F5F5F5] overflow-hidden flex flex-col items-stretch">
      {/* Background Video - full bleed */}
      <video
        ref={videoRef}
        src="/videos/cases-hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Darkening gradient so text/stats stay legible */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Optional hero title/subtitle (CMS-editable) */}
      {(title || subtitle) && (
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pt-28 md:pt-36">
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-white tracking-tight"
            >
              {title}
            </motion.h1>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-3 text-base md:text-lg text-white/70 max-w-2xl"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      {/* Stats block (-40°C / 150 kg / +63%) removed per request — the
          hero now ends cleanly after the title/subtitle. */}
    </section>
  );
}