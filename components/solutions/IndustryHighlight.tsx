"use client";

import { motion } from "framer-motion";

interface HighlightItem {
  label: string;
  desc: string;
}

interface IndustryHighlightProps {
  title: string;
  items: HighlightItem[];
  intro?: string;
}

/**
 * Core capability as an editorial two-column block: the heading and
 * intro hold the left rail (sticky on desktop), the capability points
 * run down the right. Labels sit on their own line so short specs
 * don't leave a hole next to them, and the only rules are the hairlines
 * separating points — no table header, no numbered index.
 *
 * Distinct from the challenge strip above: that one is a four-across
 * hairline grid on white, this is a stacked rail on light grey.
 */
export function IndustryHighlight({ title, items, intro }: IndustryHighlightProps) {
  return (
    <section className="bg-[#F7F8FB] py-16 md:py-20 lg:py-24 px-6 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Heading rail */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <div
            className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-3"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            CORE CAPABILITY
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight text-[#0A0A0F]"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {title}
          </h2>
          {intro && (
            <p
              className="mt-5 text-[14px] leading-[1.85] text-[#52525B]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {intro}
            </p>
          )}
        </div>

        {/* Capability rail */}
        <div className="lg:col-span-8">
          <dl className="border-t border-[#E4E4E7]">
            {items.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="border-b border-[#E4E4E7] py-7 lg:py-8"
              >
                <dt
                  className="text-[17px] font-semibold leading-snug text-[#0A0A0F] md:text-[18px]"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {it.label}
                </dt>
                <dd
                  className="mt-3 max-w-[62ch] text-[14px] leading-[1.8] text-[#71717A]"
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {it.desc}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}