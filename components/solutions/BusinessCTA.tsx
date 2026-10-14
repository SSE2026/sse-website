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

/**
 * Closing consultation block. Deliberately quiet — one headline, one
 * line of context, one action — with a wide surround and a hairline
 * rule tying it back to the page rhythm above.
 */
export function BusinessCTA({
  title,
  desc,
  buttonLabel,
  href = "/contact",
}: BusinessCTAProps) {
  return (
    <section className="bg-white px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start gap-9 border-t border-[#E4E4E7] pt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <div className="max-w-[46ch]">
            <h2
              className="text-[26px] font-bold leading-[1.25] text-[#0A0A0F] md:text-[32px]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {title}
            </h2>
            <p
              className="mt-5 text-[14px] leading-[1.8] text-[#71717A]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {desc}
            </p>
          </div>

          <Link
            href={href}
            className="group inline-flex flex-shrink-0 items-center gap-2.5 rounded-full bg-[#0A0A0F] px-8 py-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#1F1F2A]"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {buttonLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}