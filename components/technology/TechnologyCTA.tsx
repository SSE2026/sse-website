"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface TechnologyCTAProps {
  cta: {
    title: string;
    titleEn: string;
    buttonText: string;
  };
}

export function TechnologyCTA({ cta }: TechnologyCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative bg-[#050508] py-16 md:py-20 overflow-hidden">
      {/* Subtle top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7DAEFF]/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Main title */}
          <h2 className="text-3xl md:text-4xl font-medium text-[#F2F5F8] tracking-tight mb-3">
            {cta.title}
          </h2>

          {/* English */}
          <p className="text-[11px] tracking-[0.15em] text-[#8995A6] uppercase mb-8">
            {cta.titleEn}
          </p>

          {/* CTA Button */}
          <motion.a
            href="/products/cloudchi-360-p"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#050508] text-[#e8eaed] font-medium text-sm rounded-md border border-[#6b7280]/30 hover:border-[#9ca3af]/50 transition-all shadow-[0_0_20px_rgba(200,200,205,0.15)]"
          >
            {cta.buttonText}
            <ArrowRight size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
