"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface BusinessCTAProps {
  title: string;
  desc: string;
  buttonLabel: string;
  /** Default href for the project-consultation button. */
  href?: string;
}

export function BusinessCTA({
  title,
  desc,
  buttonLabel,
  href = "/contact",
}: BusinessCTAProps) {
  return (
    <section className="relative bg-white py-20 lg:py-24 px-6 md:px-10 lg:px-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.06) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative max-w-[960px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-5"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            {"// 07 CTA"}
          </div>
          <h2
            className="text-3xl md:text-[40px] lg:text-[44px] font-bold text-[#0A0A0F] leading-[1.15] max-w-[24ch] mx-auto"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {title}
          </h2>
          <p
            className="mt-5 text-[15px] md:text-base text-[#3F3F46] leading-relaxed max-w-[52ch] mx-auto"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {desc}
          </p>
          <div className="mt-9">
            <Link
              href={href}
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#0A0A0F] text-white text-[14px] font-semibold rounded-full hover:bg-[#1F1F2A] transition-colors shadow-[0_10px_30px_-14px_rgba(10,10,15,0.6)]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {buttonLabel}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}