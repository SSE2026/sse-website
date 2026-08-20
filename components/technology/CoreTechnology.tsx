"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CoreTechItem {
  title: string;
  summary: string;
  details: string[];
}

interface CoreTechnologySectionProps {
  labels?: {
    label: string;
    title: string;
    subtitle: string;
  };
  items: CoreTechItem[];
}

export function CoreTechnologySection({ labels, items }: CoreTechnologySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-[#FAFBFC] py-12 md:py-16">
      {/* Top decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#2563EB]/20 via-[#2563EB]/40 to-[#2563EB]/20"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.3em] text-[#2563EB]/70 uppercase mb-3">
              {labels?.label || "CORE TECHNOLOGY"}
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium text-[#1a1a1a] tracking-tight leading-tight">
              {labels?.title || "Core Technologies"}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-[#64748b] max-w-xs"
          >
            {labels?.subtitle || "Focusing on key technological breakthroughs"}
          </motion.p>
        </div>

        {/* Technology list */}
        <div className="space-y-0">
          {items.map((tech, index) => (
            <TechRow
              key={index}
              technology={tech}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TechRowProps {
  technology: CoreTechItem;
  index: number;
  isInView: boolean;
}

function TechRow({ technology, index, isInView }: TechRowProps) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      className="group"
    >
      <div className="py-6 md:py-8 border-t border-[#E5E7EB]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
          {/* Number */}
          <div className="md:col-span-1">
            <span className="text-[clamp(2rem,4vw,3rem)] font-light text-[#E5E7EB] tabular-nums">
              {number}
            </span>
          </div>

          {/* Title & summary */}
          <div className="md:col-span-4 lg:col-span-5">
            <h3 className="text-lg md:text-xl font-medium text-[#1a1a1a] mb-1 group-hover:text-[#2563EB] transition-colors duration-300">
              {technology.title}
            </h3>
            <p className="text-sm text-[#6B7280]">
              {technology.summary}
            </p>
          </div>

          {/* Details */}
          <div className="md:col-span-6 lg:col-span-6 md:pl-6 md:border-l md:border-[#E5E7EB]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {technology.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]/50 mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-[#6B7280] leading-relaxed">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
