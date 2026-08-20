"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

interface RDStrengthSectionProps {
  strengths?: any[];
  labels?: {
    label: string;
    title: string;
  };
}

export function RDStrengthSection({ labels }: RDStrengthSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const certifications = [
    { src: "/images/technology/资质/图片1.png", alt: "资质证书 1" },
    { src: "/images/technology/资质/图片2.png", alt: "资质证书 2" },
    { src: "/images/technology/资质/图片3.png", alt: "资质证书 3" },
    { src: "/images/technology/资质/图片4.png", alt: "资质证书 4" },
    { src: "/images/technology/资质/图片5.png", alt: "资质证书 5" },
    { src: "/images/technology/资质/图片6.png", alt: "资质证书 6" },
    { src: "/images/technology/资质/图片7.png", alt: "资质证书 7" },
  ];

  return (
    <section ref={ref} className="relative bg-white py-16 md:py-20 overflow-hidden">
      {/* Top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#2563EB]/20 via-[#2563EB]/40 to-[#2563EB]/20"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Section header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.3em] text-[#2563EB]/70 uppercase mb-3">
              {labels?.label || "R&D CAPABILITY"}
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium text-[#1a1a1a] tracking-tight leading-tight">
              {labels?.title || "全栈自主产权"}
            </h2>
          </motion.div>
        </div>

        {/* Coverflow Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CoverflowCarousel
            slides={certifications}
            showPagination
            showNavigation
            label="全栈自主产权证书展示"
            cardClassName="bg-white border border-[#E5E7EB]"
          />
        </motion.div>
      </div>
    </section>
  );
}
