"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import GlobalBusinessMap from "@/components/about/GlobalBusinessMap/GlobalBusinessMap";
import MilestonesSection from "@/components/about/MilestonesSection";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

const ENGLISH_INTRO = `Swift Safe Energy (Shenzhen) Technology Co., Ltd. is a tech innovation enterprise dedicated to the R&D and industrialization of high-specific-energy and high-safety advanced batteries. The company was jointly founded by an academician-led university research team and seasoned industry experts.

Targeting emerging application scenarios—including the low-altitude economy, embodied intelligence, deep space and deep sea exploration, construction machinery, and specialized equipment—the company conducts full-chain technical innovation across material systems, cell design, advanced manufacturing, and intelligent battery systems for next-generation power batteries. It is committed to continuously pushing the performance and application boundaries of high-end equipment electrification with battery technologies featuring higher energy density, superior safety, and enhanced environmental adaptability.

The company has built a core technology architecture centered on high-silicon/all-silicon/self-generating anodes, high-safety solid-state electrolytes, advanced cell structures and manufacturing processes, physics-AI-driven battery design and smart manufacturing, and intelligent battery systems. This establishes comprehensive in-house R&D and engineering capabilities spanning key materials, cells, and full systems.

Swift Safe Energy has established a strategic product portfolio featuring the "Aeroride" series tailored for high-energy-density demands and the "Panshi" series designed for ultra-safe scenarios. Its products have completed multiple rounds of client testing and real-world operational validation in drones, eVTOLs, robotics, and construction machinery, with several projects advancing into mass delivery and industrial onboarding phases.

Looking to the future, Swift Safe Energy will remain focused on the performance boundary requirements of high-end applications. Guided by the core technical pillars of high energy density, high safety, and intelligence, the company will accelerate the transition of advanced battery technologies from laboratory innovations to large-scale products. It aims to progressively build an integrated "Advanced Cell – Intelligent System – Scenario-based Energy" technology and product platform, striving to become a leading provider of advanced energy solutions for next-generation aircraft, intelligent robotics, and high-end equipment.`;

const CHINESE_INTRO = `深安锂能（深圳）科技有限公司是一家专注于高比能、高安全先进电池研发与产业化的科技创新企业，由高校院士团队与资深产业化团队共同组建。公司面向低空经济、具身智能、深空深海、工程机械及特种装备等新兴应用场景，围绕下一代动力电池的材料体系、电芯设计、先进制造与智能电池系统开展全链条技术创新，致力于以更高能量密度、更高安全性和更强环境适应性的电池技术，持续拓展高端装备电动化的性能与应用边界。

公司围绕高硅/全硅/自生成负极、高安全固态电解质、先进电芯结构与制造工艺、物理AI驱动的电池设计与智能制造、智能电池系统等方向构建核心技术体系，形成从关键材料、电芯到系统的自主研发与工程化能力。公司已形成面向高比能需求的"云驰"系列和面向高安全场景的"磐石"系列产品布局，产品已在无人机、eVTOL、机器人及工程机械等领域完成多轮客户测试与真实工况验证，多个项目已进入批量交付与产业化导入阶段。

未来，深安锂能将持续聚焦高端应用对电池性能边界的需求，以高比能、高安全、智能化为技术主线，加速先进电池技术从实验室创新向规模化产品转化，逐步构建"先进电芯—智能系统—场景能源"一体化技术与产品平台，致力于成为面向下一代航空器、智能机器人及高端装备的先进能源解决方案提供商。`;

export default function AboutPage() {
  const [locale, setLocale] = useState<"en" | "zh">("zh");
  const currentMessages = messages[locale];
  const isZh = locale === "zh";

  return (
    <>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        forceLightText={true}
      />

      <main>
        {/* Hero - Full Screen Map */}
        <section className="relative h-screen bg-[#09090B] overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-[#2563EB]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/8 rounded-full blur-[100px]" />
          </div>

          {/* Map - 上移以避免被底部文字遮挡 */}
          <div className="absolute inset-0 z-10" style={{ transform: 'translateY(-10%)' }}>
            <GlobalBusinessMap locale={locale} />
          </div>

          {/* Text - 左边中间，无背景 */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Animated heading */}
              <motion.h1
                className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {isZh ? (
                  <>
                    <span className="text-shimmer-light">好产品，</span>
                    <span className="text-shimmer-light">要让世界知道</span>
                  </>
                ) : (
                  <span className="text-shimmer-light">Great products. Global impact.</span>
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                style={{ color: 'rgba(143, 155, 175, 0.85)' }}
              >
                {isZh ? "深安锂能 · 全球研发与产业布局" : "SHENAN ENERGY · GLOBAL R&D AND INDUSTRIAL NETWORK"}
              </motion.p>

              {/* Auxiliary text */}
              <motion.p
                className="text-xs md:text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                style={{ color: 'rgba(100, 113, 135, 0.75)' }}
              >
                {isZh ? "固态电池技术专家" : "Solid-State Battery Expert"}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Company Introduction */}
        <section className="py-12 md:py-16 bg-white text-[#18181B] relative">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />

          <div className="container-padding mx-auto relative max-w-4xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-px bg-[#2563EB]" />
                <span className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest">
                  {isZh ? "关于我们" : "About Us"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A]">
                {isZh ? "深安锂能" : "Swift Safe Energy"}
              </h2>
            </motion.div>

            {/* Introduction Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg prose-invert max-w-none"
            >
              {isZh ? (
                <div className="space-y-4 text-[#71717A] leading-relaxed text-sm md:text-base">
                  {CHINESE_INTRO.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-[#71717A] leading-relaxed text-sm md:text-base">
                  {ENGLISH_INTRO.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Milestones Section */}
        <MilestonesSection lang={locale === 'en' ? 'en' : 'zh'} />

        {/* CTA Section - Explore Products */}
        <section className="py-12 bg-gradient-to-b from-[#09090B] to-[#050505] relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2563EB]/10 rounded-full blur-[150px]" />
          </div>

          <div className="container-padding mx-auto relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {isZh ? "探索我们的产品" : "Explore Our Products"}
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                {isZh
                  ? "了解深安锂能如何通过创新电池技术改变世界"
                  : "Discover how Swift Safe Energy is transforming the world with innovative battery technology"}
              </p>
              <Link
                href="/products/cloudchi-360-p"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {isZh ? "查看产品中心" : "View Products"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer translations={currentMessages} locale={locale} />
    </>
  );
}
