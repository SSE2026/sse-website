"use client";

import { motion } from "framer-motion";

interface DevelopmentFlowProps {
  title: string;
  subtitle?: string;
  steps: string[];
  /** Optional fine-print note — e.g. "实际流程以商务协议为准". */
  footnote?: string;
}

export function DevelopmentFlow({ title, subtitle, steps, footnote }: DevelopmentFlowProps) {
  return (
    <section className="bg-white py-14 lg:py-20 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-8 md:mb-10 max-w-3xl">
          <div
            className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-4"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            {"// 06 FLOW"}
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0A0A0F] leading-tight"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mt-4 text-[15px] md:text-base text-[#3F3F46] leading-relaxed"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E4E4E7] to-transparent" />

          <ol className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
            {steps.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative"
              >
                <div className="flex md:block items-center md:items-start gap-4 md:gap-0">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#0A0A0F] text-[#0A0A0F] font-mono text-[13px] font-semibold flex-shrink-0 md:mb-5 relative z-10"
                    style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div
                      className="text-[10px] tracking-[0.28em] uppercase text-[#71717A] mb-1 hidden md:block"
                      style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                    >
                      Step
                    </div>
                    <p
                      className="text-[14px] md:text-[15px] font-medium text-[#0A0A0F] leading-snug"
                      style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                    >
                      {s}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {footnote && (
          <p
            className="mt-10 text-[12px] text-[#71717A] leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}