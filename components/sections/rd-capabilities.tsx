"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FlaskConical, Layers, FileText, Users, ArrowRight, Atom, Dna, Microscope, Cpu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RDCapabilitiesProps {
  translations: {
    technology: {
      title: string;
      subtitle: string;
      platform: string;
      platformDesc: string;
      materials: string;
      materialsDesc: string;
      patents: string;
      patentsDesc: string;
      team: string;
      teamDesc: string;
    };
    timeline: {
      title: string;
      subtitle: string;
      items: Record<string, string>;
      details?: Record<string, string>;
    };
  };
  locale: string;
}

const capabilities = [
  {
    key: "platform",
    icon: Layers,
    stats: "4",
    statsLabel: (locale: string) => locale === "zh" ? "材料体系" : "Material Systems",
    color: "#2563EB",
  },
  {
    key: "materials",
    icon: Microscope,
    stats: "50+",
    statsLabel: (locale: string) => locale === "zh" ? "学术论文" : "Papers",
    color: "#2563EB",
  },
  {
    key: "patents",
    icon: FileText,
    stats: "29+",
    statsLabel: (locale: string) => locale === "zh" ? "发明专利" : "Patents",
    color: "#2563EB",
  },
  {
    key: "team",
    icon: Users,
    stats: "1",
    statsLabel: (locale: string) => locale === "zh" ? "院士团队" : "Academician Team",
    color: "#2563EB",
  },
];

export function RDCapabilities({ translations, locale }: RDCapabilitiesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(containerRef, { once: true, margin: "-100px" });
  const isZh = locale === "zh";

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });

  const timelineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const timelineYears = Object.keys(translations.timeline.items);

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Section transition gradient - top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#FAFAFA] to-transparent pointer-events-none z-10" />
      {/* Section transition gradient - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none z-10" />
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/5 to-transparent rounded-full blur-3xl bg-breathe-slow" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-[#2563EB]/5 to-transparent rounded-full blur-3xl bg-breathe" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>

      <div className="container-padding mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-px bg-[#2563EB]" />
            <span className="text-sm font-semibold text-[#2563EB] uppercase tracking-wider">
              {isZh ? "研发实力" : "R&D Capabilities"}
            </span>
            <div className="w-12 h-px bg-[#2563EB]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] mb-4"
          >
            {translations.technology.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-lg text-[#52525B]"
          >
            {translations.technology.subtitle}
          </motion.p>
        </motion.div>

        {/* Capabilities Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {capabilities.map((cap, index) => {
            const data = translations.technology[cap.key as keyof typeof translations.technology];
            const Icon = cap.icon;

            return (
              <motion.div
                key={cap.key}
                initial={{ opacity: 0, y: 50 }}
                animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group"
              >
                <Link href="/technology">
                  <div
                    className={cn(
                      "relative rounded-3xl overflow-hidden",
                      "bg-gradient-to-br from-white to-[#FAFAFA]",
                      "border border-[#E4E4E7]",
                      "hover:border-[#D4D4D8] hover:shadow-2xl",
                      "p-8 h-full",
                      "transition-all duration-400"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${cap.color}15` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: cap.color }} />
                    </div>

                    {/* Stats */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold font-mono" style={{ color: cap.color }}>
                        {cap.stats}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">
                      {data}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#52525B] leading-relaxed mb-4">
                      {translations.technology[`${cap.key}Desc` as keyof typeof translations.technology]}
                    </p>

                    {/* Label */}
                    <span className="text-xs font-medium text-[#A1A1AA]">
                      {cap.statsLabel(locale)}
                    </span>

                    {/* Hover arrow */}
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#52525B]" />
                    </div>

                    {/* Decorative gradient */}
                    <div
                      className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full opacity-10"
                      style={{ background: `linear-gradient(to top left, ${cap.color}20, transparent)` }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Development Timeline */}
        <div ref={timelineRef} className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] mb-2">
              {translations.timeline.title}
            </h3>
            <p className="text-[#52525B]">
              {translations.timeline.subtitle}
            </p>
          </motion.div>

          {/* Timeline - 2 Rows Grid */}
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-[#E4E4E7]" />
            <motion.div
              className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"
              style={{ width: `${timelineProgress}%` }}
            />

            {/* Timeline items - 2 rows */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {timelineYears.map((year, index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.7 + index * 0.05,
                    duration: 0.5,
                  }}
                  className="relative text-center"
                >
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={sectionInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.8 + index * 0.05, type: "spring", stiffness: 200 }}
                    className="relative z-10 w-4 h-4 mx-auto mb-3 rounded-full bg-[#2563EB] shadow-lg shadow-[#2563EB]/30"
                  />

                  {/* Year */}
                  <div className="text-base md:text-lg font-bold text-[#0A0A0A] mb-1 font-mono">
                    {year}
                  </div>

                  {/* Title */}
                  <div className="text-xs text-[#52525B] leading-tight">
                    {translations.timeline.items[year]}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 p-8 md:p-12 rounded-3xl bg-[#0A0A0A] text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { value: "29", suffix: "+", label: isZh ? "发明专利" : "Invention Patents" },
              { value: "50", suffix: "+", label: isZh ? "学术论文" : "Research Papers" },
              { value: "500", suffix: "MWh", label: isZh ? "产能规模" : "Capacity" },
              { value: "20000", suffix: "+", label: isZh ? "平米中试线" : "Pilot Line (m²)" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={sectionInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.1 + index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold font-mono mb-2">
                  {stat.value}<span className="text-[#2563EB]">{stat.suffix}</span>
                </p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/technology"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors group"
          >
            <span>{isZh ? "了解更多研发实力" : "Learn More About R&D"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
