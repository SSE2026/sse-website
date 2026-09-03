"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Zap, MessageCircle, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTAProps {
  translations: {
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  locale: string;
}

export function CTA({ translations, locale }: CTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const sectionInView = useInView(ref, { once: true, margin: "-100px" });
  const isZh = locale === "zh";

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden bg-[#FAFAFA]">
      {/* Section transition gradient - top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#18181B] to-[#0A0A0A]" />

      {/* Animated gradient orbs with breathing */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#2563EB]/20 rounded-full blur-[150px] bg-breathe"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#3B82F6]/15 rounded-full blur-[200px] bg-breathe-slow"
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-white/5 rounded-full opacity-30" />
      <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/5 rounded-full opacity-20" />
      <div className="absolute top-40 right-40 w-2 h-2 rounded-full bg-[#2563EB]/50" />
      <div className="absolute bottom-40 left-40 w-2 h-2 rounded-full bg-[#3B82F6]/50" />

      <div className="container-padding mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={sectionInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon with glow */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={sectionInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative inline-block mb-8"
          >
            {/* Glow rings */}
            <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-[#2563EB]/30 blur-xl" />
            <div className="absolute inset-2 w-16 h-16 rounded-xl bg-[#2563EB]/40 blur-lg" />
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6"
          >
            <Zap className="w-4 h-4 text-[#2563EB]" />
            {isZh ? "立即联系，开启合作" : "Start Your Partnership Today"}
          </motion.p>

          {/* Title - Large and impactful */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {translations.cta.title.split(" ").map((word, i, arr) => (
              <span key={i} className={cn(
                i === arr.length - 1 ? "text-[#2563EB]" : ""
              )}>
                {word}{" "}
              </span>
            ))}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto"
          >
            {translations.cta.subtitle}
          </motion.p>

          {/* CTA Buttons - Large and prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/contact">
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#2563EB]/30 hover:-translate-y-0.5">
                <MessageCircle className="w-5 h-5" />
                <span className="text-lg">{translations.cta.button}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/products/cloudchi-360-p">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <span className="text-lg">{isZh ? "探索产品" : "Explore Products"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>

          {/* Quick contact options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12"
          >
            <a
              href="mailto:changhao@ssebatt.com"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm text-white/80 group-hover:text-white">changhao@ssebatt.com</span>
            </a>
            <a
              href="tel:+8613651071130"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <Phone className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm text-white/80 group-hover:text-white">+86 13651071130</span>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={sectionInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm"
          >
            <span className="flex items-center gap-2 text-white/40">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              {isZh ? "24小时内响应" : "Response within 24h"}
            </span>
            <span className="flex items-center gap-2 text-white/40">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              {isZh ? "专业技术支持" : "Technical Support"}
            </span>
            <span className="flex items-center gap-2 text-white/40">
              <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
              {isZh ? "定制化方案" : "Custom Solutions"}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
    </section>
  );
}
