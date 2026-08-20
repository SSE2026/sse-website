"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Zap, Battery, RefreshCw, Sparkles, Thermometer, Bolt, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoreAdvantagesProps {
  translations: {
    advantages: {
      title: string;
      subtitle: string;
      safety: { title: string; desc: string };
      energy: { title: string; desc: string };
      charging: { title: string; desc: string };
      lifecycle: { title: string; desc: string };
    };
    hero?: {
      stats?: {
        energyDensity?: string;
        cycleLife?: string;
        patents?: string;
      };
    };
  };
  locale?: string;
}

const advantages = [
  {
    key: "safety",
    icon: Shield,
    iconName: "安全",
    gradient: "from-[#2563EB]/10",
    iconBg: "bg-[#2563EB]/10",
    iconColor: "text-[#2563EB]",
    borderColor: "hover:border-[#2563EB]/30",
    stat: "0",
    statLabel: "热失控事件",
    statEnLabel: "Thermal Events",
  },
  {
    key: "energy",
    icon: Zap,
    iconName: "能量",
    gradient: "from-[#2563EB]/10",
    iconBg: "bg-[#2563EB]/10",
    iconColor: "text-[#2563EB]",
    borderColor: "hover:border-[#2563EB]/30",
    stat: "500+",
    statLabel: "Wh/kg",
    statEnLabel: "Energy Density",
  },
  {
    key: "charging",
    icon: Bolt,
    iconName: "快充",
    gradient: "from-[#2563EB]/10",
    iconBg: "bg-[#2563EB]/10",
    iconColor: "text-[#2563EB]",
    borderColor: "hover:border-[#2563EB]/30",
    stat: "10C",
    statLabel: "峰值放电",
    statEnLabel: "Peak Discharge",
  },
  {
    key: "lifecycle",
    icon: RefreshCw,
    iconName: "寿命",
    gradient: "from-[#2563EB]/10",
    iconBg: "bg-[#2563EB]/10",
    iconColor: "text-[#2563EB]",
    borderColor: "hover:border-[#2563EB]/30",
    stat: "500+",
    statLabel: "循环寿命",
    statEnLabel: "Cycle Life",
  },
];

export function CoreAdvantages({ translations, locale = "en" }: CoreAdvantagesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isZh = locale === "zh";

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-white overflow-hidden">
      {/* Section transition gradient - top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#FAFAFA] to-transparent pointer-events-none z-10" />
      {/* Section transition gradient - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none z-10" />
      {/* Background decorations */}
      <div className="absolute inset-0">
        {/* Subtle gradient orbs - breathing animation */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#2563EB]/5 to-transparent rounded-full blur-3xl bg-breathe-slow" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-[#2563EB]/5 to-transparent rounded-full blur-3xl bg-breathe" />
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="container-padding mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
              {translations.advantages.title}
            </span>
            <div className="w-12 h-px bg-[#2563EB]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] mb-4"
          >
            {translations.advantages.subtitle}
          </motion.h2>
        </motion.div>

        {/* Advantages Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => {
            const data = (translations.advantages as Record<string, {title?: string; desc?: string}>)[advantage.key];
            const Icon = advantage.icon;

            return (
              <motion.div
                key={advantage.key}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group"
              >
                <div
                  className={cn(
                    "relative h-full rounded-3xl overflow-hidden",
                    "bg-gradient-to-br from-white to-[#FAFAFA]",
                    "border border-[#E4E4E7]",
                    "transition-all duration-400",
                    advantage.borderColor,
                    "hover:shadow-2xl hover:border-[#D4D4D8]",
                    "p-8"
                  )}
                >
                  {/* Background gradient on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      "bg-gradient-to-br",
                      advantage.gradient,
                      "to-transparent"
                    )}
                  />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="mb-6">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                          advantage.iconBg,
                          "group-hover:scale-110 transition-transform duration-300"
                        )}
                      >
                        <Icon className={cn("w-8 h-8", advantage.iconColor)} />
                      </div>
                      <span className={cn("text-sm font-medium", advantage.iconColor)}>
                        {isZh ? advantage.iconName : advantage.key}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#0A0A0A] mb-3 group-hover:text-[#0A0A0A]">
                      {data.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#52525B] leading-relaxed mb-6">
                      {data.desc}
                    </p>

                    {/* Stat */}
                    <div className="flex items-baseline gap-2 pt-4 border-t border-[#E4E4E7]">
                      <span className={cn("text-3xl font-bold font-mono", advantage.iconColor)}>
                        {advantage.stat}
                      </span>
                      <span className="text-sm text-[#A1A1AA]">
                        {isZh ? advantage.statLabel : advantage.statEnLabel}
                      </span>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className={cn("absolute top-4 right-4 w-8 h-8 rounded-full", advantage.iconBg)} />
                    <div className={cn("absolute top-8 right-8 w-6 h-6 rounded-full", advantage.iconBg)} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom feature highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0A0A0A] to-[#18181B] text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">{isZh ? "为什么选择深安锂能？" : "Why Choose Shenan Lithium?"}</h4>
                <p className="text-sm text-white/60">{isZh ? "专业团队 · 创新技术 · 卓越品质" : "Professional Team · Innovative Technology · Excellent Quality"}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold font-mono">99.9%</div>
                <div className="text-xs text-white/40">{isZh ? "产品合格率" : "Quality Rate"}</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold font-mono">24/7</div>
                <div className="text-xs text-white/40">{isZh ? "技术支持" : "Tech Support"}</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold font-mono">5年</div>
                <div className="text-xs text-white/40">{isZh ? "质保服务" : "Warranty"}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
