"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface EngineeringProcessProps {
  title?: string;
  subtitle?: string;
  steps?: Array<{ title: string }>;
  keywords?: string[];
}

export function EngineeringProcess({ title, subtitle, steps, keywords }: EngineeringProcessProps) {
  const t = useTranslations("casesPage.workflow");
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const defaultSteps = [
    { key: "flightPlatform", title: t("steps.0.title") },
    { key: "missionRequirements", title: t("steps.1.title") },
    { key: "batteryArchitecture", title: t("steps.2.title") },
    { key: "systemOptimization", title: t("steps.3.title") },
    { key: "flightValidation", title: t("steps.4.title") },
  ];

  const defaultKeywords = [
    t("keywords.0"),
    t("keywords.1"),
    t("keywords.2"),
    t("keywords.3"),
    t("keywords.4"),
    t("keywords.5"),
    t("keywords.6"),
  ];

  // CMS overrides fall back to messages
  const finalSteps = (steps && steps.length > 0 ? steps : defaultSteps).map((s, i) => ({
    key: `step-${i}`,
    title: s.title,
  }));
  const finalKeywords = keywords && keywords.length > 0 ? keywords : defaultKeywords;
  const sectionTitle = title || t("title");
  const sectionSubtitle = subtitle || t("subtitle");

  return (
    <section
      ref={sectionRef}
      className="bg-white py-20 lg:py-28 px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a1a1a]">
            {sectionTitle}
          </h2>
          <p className="text-sm text-[#666666] max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute inset-x-0 top-6 hidden lg:block">
              <div className="mx-auto max-w-4xl">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 lg:gap-6">
              {finalSteps.map((step, index) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white">
                    <span className="font-mono text-sm font-bold text-[#2563EB]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="text-sm text-[#333333]">
                    {step.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {finalKeywords.map((keyword, index) => (
            <span
              key={index}
              className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-[#666666] hover:border-[#2563EB]/50 hover:text-[#2563EB] transition-colors"
            >
              {keyword}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
