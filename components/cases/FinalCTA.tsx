"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function FinalCTA() {
  const t = useTranslations("casesPage.cta");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0A0A0A] px-8 lg:px-24 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-md bg-[#F5F5F5] px-6 py-3 text-sm font-semibold text-[#050505] transition-colors hover:bg-white"
            >
              {t("primary")}
              <span>→</span>
            </Link>
            <Link
              href="/contact?type=sample"
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-md border border-[#27272A] bg-transparent px-6 py-3 text-sm font-semibold text-[#F5F5F5] transition-colors hover:bg-white/10"
            >
              {t("secondary")}
            </Link>
          </div>

          {/* Small Text */}
          <p className="mt-8 font-mono text-xs tracking-wider text-[#52525B]">
            {t("smallText")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
