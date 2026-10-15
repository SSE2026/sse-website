"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CoreTechnology } from "@/data/technology";
import { PointLattice } from "./PointLattice";

interface HeroProps {
  badge: string;
  title: string;
  subtitle: string;
  stats: {
    patents: string;
    papers: string;
    production: string;
    samples: string;
  };
}

interface TechnologyHeroProps {
  hero: HeroProps;
  technologies?: CoreTechnology[];
}

function CountUp({
  end,
  suffix = "",
  duration = 2000,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  duration?: number;
  /** Decimal places to hold while counting — 0.5 GWh needs one. */
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Number((progress * end).toFixed(decimals)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration, decimals]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/**
 * R&D hero — silver-white and typographic. The five technologies get
 * their own carousel further down the page, so a hero photograph here
 * only competed with them; depth comes from a brand-blue precision
 * grid and a soft focal wash instead.
 */
export function TechnologyHero({ hero }: TechnologyHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex flex-col justify-between items-center overflow-hidden bg-[#F7F8FB] text-[#0A0A0F] font-sans select-none"
    >
      {/* Backdrop — silver-white, lit from above. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F7F8FB 46%, #EDF0F5 100%)",
        }}
      />

      {/* Icosahedral wireframe — the section's structure. Sits behind the
          headline so the type reads as hanging inside a lattice. */}
      <PointLattice className="absolute left-1/2 top-1/2 h-[min(80vh,70vw)] w-[min(80vh,70vw)] -translate-x-1/2 -translate-y-1/2" />

      {/* Focal wash behind the headline. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 44% 36% at 50% 45%, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0) 72%)",
        }}
      />

      {/* Centre block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-16 my-auto flex flex-col items-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8 text-[#0A0A0F]"
        >
          {(() => {
            // zh.json uses a full-width comma to mark the emphasised half;
            // en.json has no comma, so the whole title renders in ink.
            const [head, tail] = hero.title.split("，");
            if (!tail) return head;
            return (
              <>
                {head}，
                <span className="text-[#2563EB]">{tail}</span>
              </>
            );
          })()}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#52525B] text-base sm:text-lg max-w-2xl leading-relaxed mb-10 tracking-wide"
        >
          {hero.subtitle}
        </motion.p>
      </motion.div>

      {/* Stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-[#D4D4D8] text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0A0A0F]">
              <CountUp end={20} suffix="+" />
            </div>
            <div className="text-xs text-[#71717A] mt-1 tracking-wider uppercase">{hero.stats.patents}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0A0A0F]">
              <CountUp end={50} suffix="+" />
            </div>
            <div className="text-xs text-[#71717A] mt-1 tracking-wider uppercase">{hero.stats.papers}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0A0A0F]">
              <CountUp end={0.5} decimals={1} suffix=" GWh" />
            </div>
            <div className="text-xs text-[#71717A] mt-1 tracking-wider uppercase">{hero.stats.production}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0A0A0F]">
              <CountUp end={40000} suffix="㎡" />
            </div>
            <div className="text-xs text-[#71717A] mt-1 tracking-wider uppercase">{hero.stats.samples}</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}