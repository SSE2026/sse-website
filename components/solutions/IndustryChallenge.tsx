"use client";

import { motion } from "framer-motion";

interface IndustryChallengeProps {
  title: string;
  items: string[];
}

export function IndustryChallenge({ title, items }: IndustryChallengeProps) {
  return (
    <section className="bg-white py-14 lg:py-20 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <div
            className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-4"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >{"// 01 CHALLENGES"}</div>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0A0A0F] leading-tight"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {title}
          </h2>
          <div className="mt-6 h-px w-12 bg-[#0A0A0F]" />
        </div>

        <ul className="lg:col-span-8 space-y-5">
          {items.map((it, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex gap-4 text-[15px] md:text-[16px] text-[#0A0A0F] leading-[1.8]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              <span
                className="text-[#A1A1AA] font-mono text-[12px] tracking-wider mt-1 flex-shrink-0"
                style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{it}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}