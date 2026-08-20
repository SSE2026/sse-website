"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Users, ArrowRight } from "lucide-react";

// Partner logo data
const partnerLogos = [
  { id: "p1", name: "Partner 1", imageUrl: "/images/partners/图片1.png", category: "low-altitude" },
  { id: "p2", name: "Partner 2", imageUrl: "/images/partners/图片2.png", category: "low-altitude" },
  { id: "p3", name: "Partner 3", imageUrl: "/images/partners/图片3.png", category: "embodied-ai" },
  { id: "p4", name: "Partner 4", imageUrl: "/images/partners/图片4.png", category: "embodied-ai" },
  { id: "p5", name: "Partner 5", imageUrl: "/images/partners/图片5.png", category: "underwater" },
  { id: "p6", name: "Partner 6", imageUrl: "/images/partners/图片6.png", category: "underwater" },
  { id: "p7", name: "Partner 7", imageUrl: "/images/partners/图片7.png", category: "legged-robots" },
  { id: "p8", name: "Partner 8", imageUrl: "/images/partners/图片8.png", category: "legged-robots" },
  { id: "p9", name: "Partner 9", imageUrl: "/images/partners/图片9.png", category: "special-equipment" },
  { id: "p10", name: "Partner 10", imageUrl: "/images/partners/图片10.png", category: "special-equipment" },
  { id: "p11", name: "Partner 11", imageUrl: "/images/partners/图片11.png", category: "research" },
];

interface PartnersProps {
  translations: {
    partners: {
      title: string;
      subtitle: string;
    };
  };
  locale: string;
}

export function Partners({ translations, locale }: PartnersProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isZh = locale === "zh";

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2563EB]/5 rounded-full blur-[150px]" />
      </div>

      <div className="container-padding mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-px bg-[#2563EB]" />
            <span className="text-sm font-semibold text-[#2563EB] uppercase tracking-wider">
              {translations.partners.title}
            </span>
            <div className="w-12 h-px bg-[#2563EB]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] mb-4"
          >
            {translations.partners.subtitle}
          </motion.h2>
        </motion.div>

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {partnerLogos.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.2 + index * 0.05,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group cursor-pointer"
            >
              <motion.div
                animate={{ y: hoveredIndex === index ? -4 : 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative rounded-2xl overflow-hidden",
                  "bg-[#FAFAFA] border border-[#E4E4E7]",
                  "transition-all duration-300",
                  "hover:border-[#D4D4D8] hover:shadow-lg",
                  hoveredIndex === index && "shadow-xl border-[#2563EB]/30"
                )}
              >
                {/* Logo Image */}
                <div className="aspect-square flex items-center justify-center p-4">
                  <Image
                    src={partner.imageUrl}
                    alt={partner.name}
                    width={80}
                    height={80}
                    className="object-contain transition-transform duration-300 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>

                {/* Hover glow effect */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-transparent pointer-events-none" />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white font-semibold rounded-lg hover:bg-[#18181B] transition-colors group">
            <Users className="w-5 h-5" />
            <span>{isZh ? "成为合作伙伴" : "Become a Partner"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="text-center mt-6 text-sm text-[#A1A1AA]"
        >
          {isZh ? "合作 Logo 持续更新中，欢迎联系我们洽谈合作" : "Logos coming soon. Contact us to explore partnerships"}
        </motion.p>
      </div>
    </section>
  );
}
