"use client";

import { motion } from "framer-motion";

export interface ConfigResult {
  config: string;
  metric: string;
  note: string;
}

export interface CaseBlockItem {
  scene: string;
  applications: string;
  challenges: string[];
  configs: ConfigResult[];
  /** Optional hero shot — occupies the left column, filling the row height. */
  image?: string;
  /** Optional alt text for the case image. */
  imageAlt?: string;
}

interface CaseBlockProps {
  title?: string;
  cases: CaseBlockItem[];
}

/**
 * Each case is a two-column card:
 *   left  — scene image, full row height (object-cover), with the
 *           case number + scene title overlaid bottom-left
 *   right — applications, challenges and configs × results stacked
 *
 * Side-by-side (not stacked) so the image and the text read as one
 * unit and the card height is driven by the shorter of the two.
 */
export function CaseBlock({ title, cases }: CaseBlockProps) {
  return (
    <section className="bg-[#FAFAFC] py-12 md:py-16 lg:py-20 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        {title && (
          <div className="mb-8 md:mb-10 max-w-3xl">
            <div
              className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-3"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >{"// 05 CASES"}</div>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#0A0A0F] leading-tight"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {title}
            </h2>
          </div>
        )}

        <div className="space-y-6 lg:space-y-8">
          {cases.map((c, idx) => (
            <motion.article
              key={`${c.scene}-${idx}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-[#E4E4E7]/70 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* LEFT — scene image, fills the row height on lg.
                    On mobile it becomes a 16:9 banner above the text. */}
                <div className="lg:col-span-6 relative bg-[#F7F8FB] overflow-hidden min-h-[240px] lg:min-h-full">
                  {c.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.image}
                        alt={c.imageAlt ?? c.scene}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Readability gradient + overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute top-0 left-0 p-4 md:p-5">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-white/40 text-[11px] tracking-[0.24em] uppercase text-[#0A0A0F] font-mono font-medium shadow-[0_4px_12px_-4px_rgba(0,0,0,0.18)]"
                          style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                        >
                          Case {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                        <h3
                          className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                          style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                        >
                          {c.scene}
                        </h3>
                        <p
                          className="mt-1.5 text-[11px] md:text-[12px] text-white/80 leading-relaxed"
                          style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                        >
                          <span
                            className="text-white/55 mr-1.5 uppercase tracking-[0.18em] text-[10px]"
                            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                          >
                            应用场景
                          </span>
                          {c.applications}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end bg-[#F7F8FB]">
                      <span
                        className="text-[11px] tracking-[0.28em] uppercase text-[#2563EB] font-mono mb-2"
                        style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                      >
                        Case {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="text-lg md:text-xl font-bold text-[#0A0A0F] leading-tight"
                        style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                      >
                        {c.scene}
                      </h3>
                      <p
                        className="mt-2 text-[12px] text-[#3F3F46] leading-relaxed"
                        style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                      >
                        {c.applications}
                      </p>
                    </div>
                  )}
                </div>

                {/* RIGHT — challenges + configs, tight vertical rhythm */}
                <div className="lg:col-span-6 flex flex-col">
                  <div className="px-5 md:px-7 py-5 md:py-6 border-b border-[#E4E4E7]/60 bg-[#FAFAFC]">
                    <div
                      className="text-[11px] tracking-[0.28em] uppercase text-[#71717A] mb-3"
                      style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                    >
                      客户痛点
                    </div>
                    <ul
                      className="space-y-2 text-[13px] text-[#3F3F46] leading-[1.65]"
                      style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                    >
                      {c.challenges.map((ch, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[#A1A1AA] select-none shrink-0 font-mono text-[11px] pt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{ch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="px-5 md:px-7 py-5 md:py-6 flex-1">
                    <div
                      className="text-[11px] tracking-[0.28em] uppercase text-[#71717A] mb-3"
                      style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                    >
                      方案配置 × 关键结果
                    </div>
                    <div className="space-y-3">
                      {c.configs.map((cfg, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-[#E4E4E7]/70 p-4 bg-white"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <div
                                className="text-[13px] font-medium text-[#0A0A0F] leading-snug"
                                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                              >
                                {cfg.config}
                              </div>
                              <div
                                className="mt-2 text-[12.5px] text-[#3F3F46] leading-[1.65]"
                                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                              >
                                {cfg.note}
                              </div>
                            </div>
                            <div className="sm:w-36 mt-3 sm:mt-0 sm:text-right border-t sm:border-t-0 sm:border-l border-[#E4E4E7]/60 pt-3 sm:pt-0 sm:pl-4 flex-shrink-0">
                              <div
                                className="text-[10px] tracking-[0.28em] uppercase text-[#71717A] mb-0.5"
                                style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                              >
                                KEY METRIC
                              </div>
                              <div
                                className="text-[16px] md:text-[17px] font-bold text-[#2563EB] leading-tight"
                                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                              >
                                {cfg.metric}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}