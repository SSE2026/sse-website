"use client";

import { motion } from "framer-motion";

interface IndustryHighlightProps {
  title: string;
  items: string[];
  /** Optional small value line shown above the list (e.g. solution value summary). */
  intro?: string;
}

export function IndustryHighlight({ title, items, intro }: IndustryHighlightProps) {
  return (
    <section className="bg-[#F7F8FB] py-14 lg:py-20 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <div
            className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-4"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >{"// 02 DIFFERENTIATION"}</div>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0A0A0F] leading-tight"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {title}
          </h2>
          {intro && (
            <p
              className="mt-5 text-[15px] text-[#3F3F46] leading-relaxed"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {intro}
            </p>
          )}
        </div>

        <div className="lg:col-span-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            {items.map((it, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="bg-white rounded-xl border border-[#E4E4E7]/60 p-5 lg:p-6 flex gap-3 text-[14px] md:text-[15px] text-[#0A0A0F] leading-[1.7]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              >
                <span
                  className="text-[#2563EB] font-mono text-[12px] flex-shrink-0 mt-0.5"
                  style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                >
                  ✦
                </span>
                <span>{it}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}