"use client";

import { motion } from "framer-motion";

export interface FlowStep {
  title: string;
  desc: string;
}

interface DevelopmentFlowProps {
  title: string;
  subtitle?: string;
  steps: FlowStep[];
  /** Optional fine-print note — e.g. "实际流程以商务协议为准". */
  footnote?: string;
}

/**
 * Horizontal five-stage timeline. The rail runs unbroken behind the
 * nodes; each node masks it with a solid fill so the line reads as
 * continuous rather than a series of dashes. One short line per
 * stage — no paragraphs.
 */
export function DevelopmentFlow({ title, subtitle, steps, footnote }: DevelopmentFlowProps) {
  return (
    <section className="bg-[#F7F8FB] py-16 md:py-20 lg:py-24 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div
            className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-3"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            PROCESS
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0A0A0F] leading-tight"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mt-5 text-[15px] leading-[1.8] text-[#3F3F46]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative">
          {/* Rail — sits behind the nodes, which mask it with a solid
              fill so the line appears to run straight through. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-[27px] hidden lg:block"
          >
            <div className="h-px w-full bg-[#D4D4D8]" />
          </div>

          <ol className="grid grid-cols-1 gap-y-9 lg:grid-cols-5 lg:gap-x-6">
            {steps.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="relative flex gap-5 lg:block"
              >
                <span
                  className="relative z-10 inline-flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-full bg-[#F7F8FB] text-[15px] font-bold text-[#0A0A0F] ring-1 ring-[#D4D4D8] lg:mb-6"
                  style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="pt-2 lg:pt-0">
                  <h3
                    className="text-[16px] md:text-[17px] font-semibold leading-snug text-[#0A0A0F]"
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-2.5 text-[13px] leading-[1.7] text-[#71717A] lg:pr-6"
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    {s.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {footnote && (
          <p
            className="mt-12 text-[12px] leading-relaxed text-[#A1A1AA]"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}