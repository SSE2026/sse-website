"use client";

import { motion } from "framer-motion";

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseComparisonRow {
  /** Optional grouping label (renders as a slim header row above). */
  group?: string;
  label: string;
  values: string[];
}

export interface CaseComparison {
  title: string;
  columns: string[];
  /** 0-based index of OUR column (gets the subtle highlight treatment). */
  highlightColumn: number;
  rows: CaseComparisonRow[];
}

export interface CaseBlockItem {
  scene: string;
  applications: string;
  /** One sentence — the headline benefit of this deployment. */
  value: string;
  /** Up to three headline metrics. */
  metrics: CaseMetric[];
  /** Optional competitor-vs-us table — verbatim from the spec doc. */
  comparison?: CaseComparison;
  /** Scene photo — carries the visual weight of the card. */
  image?: string;
  imageAlt?: string;
}

interface CaseBlockProps {
  title?: string;
  cases: CaseBlockItem[];
}

/**
 * Visual-first case card: image + content row, then an optional
 * comparison table directly below the card when present. The table
 * keeps the site’s hairline + light-grey language and emphasises our
 * column subtly without competing with the card.
 */
export function CaseBlock({ title, cases }: CaseBlockProps) {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        {title && (
          <div className="mb-10 md:mb-14">
            <div
              className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-3"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              CASES
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold leading-tight text-[#0A0A0F]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {title}
            </h2>
          </div>
        )}

        <div className="space-y-10 md:space-y-14">
          {cases.map((c, idx) => (
            <motion.article
              key={`${c.scene}-${idx}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="overflow-hidden rounded-2xl border border-[#E4E4E7]/70 bg-white"
            >
              {/* Image + content row */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative bg-[#F2F4F7] overflow-hidden min-h-[240px] sm:min-h-[320px] lg:min-h-[440px]">
                  {c.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.image}
                        alt={c.imageAlt ?? c.scene}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span
                        className="absolute left-5 top-5 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[#0A0A0F] backdrop-blur-md"
                        style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]"
                        style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center px-7 py-9 md:px-10 md:py-11">
                  <h3
                    className="text-xl md:text-[22px] font-bold leading-snug text-[#0A0A0F]"
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    {c.scene}
                  </h3>
                  <p
                    className="mt-2 text-[12.5px] leading-relaxed text-[#A1A1AA]"
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    {c.applications}
                  </p>

                  {c.metrics.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-x-9 gap-y-5">
                      {c.metrics.map((m, i) => (
                        <div key={i} className="min-w-[68px]">
                          <div
                            className="text-[24px] md:text-[28px] font-bold leading-none tracking-[-0.01em] text-[#0A0A0F]"
                            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                          >
                            {m.value}
                          </div>
                          <div
                            className="mt-2 text-[11px] leading-snug text-[#71717A]"
                            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                          >
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {c.value && (
                    <p
                      className="mt-8 border-t border-[#E4E4E7]/70 pt-6 text-[13.5px] leading-[1.75] text-[#71717A]"
                      style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                    >
                      {c.value}
                    </p>
                  )}
                </div>
              </div>

              {/* Comparison table — spans full card width, sits
                  beneath the image+content row. The row list supports
                  an optional `group` field, which renders as a slim
                  sub-header row (used in the competitor vs deep-anchor table). */}
              {c.comparison && <ComparisonTable comparison={c.comparison} />}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The competitor table, extracted so its prop is a definite
 * `CaseComparison` rather than a possibly-undefined field of the card.
 * Narrowing a property does not survive into the map/forEach callbacks
 * below, so keeping it inline forced the type checker to reject them.
 */
function ComparisonTable({ comparison }: { comparison: CaseComparison }) {
  const rows: {
    type: "row" | "group";
    group?: string;
    label: string;
    values: string[];
  }[] = [];

  comparison.rows.forEach((r) => {
    if (r.group) {
      rows.push({ type: "group", group: r.group, label: "", values: [] });
    }
    rows.push({ type: "row", label: r.label, values: r.values });
  });

  return (
    <div className="border-t border-[#E4E4E7] bg-[#FAFAFC] px-7 py-9 md:px-12 md:py-12">
      <h4
        className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#71717A] mb-6"
        style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
      >
        {comparison.title}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-[#0A0A0F]/15">
              <th
                className="py-3 pr-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#71717A] w-[34%]"
                style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
              />
              {comparison.columns.map((col, ci) => (
                <th
                  key={ci}
                  className={
                    "py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] " +
                    (ci === comparison.highlightColumn
                      ? "text-[#0A0A0F] bg-[#E4E4E7]/60"
                      : "text-[#71717A]")
                  }
                  style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              if (r.type === "group") {
                return (
                  <tr key={ri} className="bg-[#E4E4E7]/40">
                    <th
                      colSpan={comparison.columns.length + 1}
                      className="py-2 px-4 text-left text-[10px] font-medium uppercase tracking-[0.12em] text-[#71717A]"
                      style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                    >
                      {r.group}
                    </th>
                  </tr>
                );
              }
              return (
                <tr key={ri} className="border-b border-[#E4E4E7]/60 last:border-b-0">
                  <td
                    className="py-3 pr-4 text-[12.5px] text-[#3F3F46] align-top"
                    style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                  >
                    {r.label}
                  </td>
                  {r.values.map((v, ci) => (
                    <td
                      key={ci}
                      className={
                        "py-3 px-4 text-[12.5px] align-top " +
                        (ci === comparison.highlightColumn
                          ? "text-[#0A0A0F] font-semibold bg-[#E4E4E7]/40"
                          : "text-[#3F3F46]")
                      }
                      style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}