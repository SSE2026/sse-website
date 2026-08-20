"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Users, Award, Globe } from "lucide-react";
import Link from "next/link";

interface CompanyIntroProps {
  translations: {
    about: {
      companyTitle: string;
      companyDesc: string;
    };
    nav: {
      about: string;
    };
  };
  locale: string;
}

export function CompanyIntro({ translations, locale }: CompanyIntroProps) {
  const stats = [
    { icon: Building2, value: "2018", label: locale === "zh" ? "成立年份" : "Founded" },
    { icon: Users, value: "200+", label: locale === "zh" ? "研发人员" : "R&D Engineers" },
    { icon: Award, value: "50+", label: locale === "zh" ? "核心专利" : "Patents" },
    { icon: Globe, value: "20+", label: locale === "zh" ? "国家地区" : "Countries" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAFAFA]">
      {/* Section transition gradient - top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10" />
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        {/* Large gradient orbs - breathing animation */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#2563EB]/5 to-transparent rounded-full blur-3xl bg-breathe" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#2563EB]/5 to-transparent rounded-full blur-3xl bg-breathe-slow" />
      </div>

      <div className="container-padding mx-auto py-20 md:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-px bg-[#2563EB]" />
              <span className="text-sm font-semibold text-[#2563EB] uppercase tracking-wider">
                {locale === "zh" ? "关于我们" : "About Us"}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] leading-tight mb-8"
            >
              {translations.about.companyTitle}
            </motion.h2>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6 mb-10"
            >
              {translations.about.companyDesc.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base md:text-lg text-[#52525B] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* CTA Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-4 group"
              >
                <span className="text-base font-semibold text-[#2563EB]">
                  {locale === "zh" ? "了解更多" : "Learn More"}
                </span>
                <span className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center group-hover:bg-[#1D4ED8] transition-all duration-300 group-hover:scale-105">
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Image + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/about-company.png"
                alt="Company"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/20 to-transparent" />
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-8 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-[#E4E4E7]">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {stats.slice(0, 2).map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-[#0A0A0A] font-mono">{stat.value}</div>
                    <div className="text-xs text-[#A1A1AA]">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -right-4 md:-right-8 bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-[#E4E4E7]">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {stats.slice(2, 4).map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-[#0A0A0A] font-mono">{stat.value}</div>
                    <div className="text-xs text-[#A1A1AA]">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
