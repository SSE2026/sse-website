"use client";

import { motion } from "framer-motion";

interface ChallengeItem {
  keyword: string;
  desc: string;
}

interface IndustryChallengeProps {
  title: string;
  items: ChallengeItem[];
}

/**
 * Pain points as a light hairline grid — no inverted band, no glass,
 * no glow. The section sits on white so the page keeps its existing
 * white / light-grey alternation, and is distinguished from the
 * capability module below by structure (four equal cells split by
 * hairlines) rather than by colour.
 */
export function IndustryChallenge({ title, items }: IndustryChallengeProps) {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24 px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 md:mb-16">
          <div
            className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-3"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            CHALLENGES
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight text-[#0A0A0F]"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden bg-[#E4E4E7] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="bg-white p-7 transition-colors duration-300 hover:bg-[#FAFAFC] lg:p-8"
            >
              <div
                className="text-[12px] font-medium tracking-[0.2em] text-[#A1A1AA]"
                style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <h3
                className="mt-8 text-[16px] font-semibold leading-snug text-[#0A0A0F]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                {it.keyword}
              </h3>
              <p
                className="mt-3 text-[13px] leading-[1.75] text-[#71717A]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                {it.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}