"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/animated/fade-in";
import { ScaleIn } from "@/components/animated/scale-in";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";
import Image from "next/image";
import { ArrowRight, Battery, Zap, Shield, Clock, Check, Cpu, Cylinder, Box } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

const products = [
  {
    id: 1,
    key: "power",
    model: "CloudChi 360-P",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    badge: "高功率平台",
    badgeEn: "High Power",
    color: "#2F80FF",
    specs: [
      { icon: Zap, label: "能量密度", value: "360 Wh/kg", en: "Energy Density" },
      { icon: Cpu, label: "放电倍率", value: "5C", en: "Discharge Rate" },
      { icon: Shield, label: "安全性", value: "本质安全", en: "Safety" },
      { icon: Clock, label: "循环寿命", value: "500+次", en: "Cycle Life" },
    ],
  },
  {
    id: 2,
    key: "storage",
    model: "CloudChi 400-E",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    badge: "高能量平台",
    badgeEn: "High Energy",
    color: "#10B981",
    specs: [
      { icon: Zap, label: "能量密度", value: "400 Wh/kg", en: "Energy Density" },
      { icon: Cpu, label: "放电倍率", value: "3C", en: "Discharge Rate" },
      { icon: Shield, label: "安全性", value: "本质安全", en: "Safety" },
      { icon: Clock, label: "循环寿命", value: "800+次", en: "Cycle Life" },
    ],
  },
  {
    id: 3,
    key: "drone",
    model: "CloudChi 460-X",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    badge: "超高能量",
    badgeEn: "Ultra High Energy",
    color: "#A855F7",
    specs: [
      { icon: Zap, label: "能量密度", value: "460+ Wh/kg", en: "Energy Density" },
      { icon: Cpu, label: "放电倍率", value: "10C", en: "Discharge Rate" },
      { icon: Shield, label: "安全性", value: "本质安全", en: "Safety" },
      { icon: Clock, label: "循环寿命", value: "300+次", en: "Cycle Life" },
    ],
  },
  {
    id: 4,
    key: "consumer",
    model: "模组与系统",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80",
    badge: "系统集成",
    badgeEn: "System Integration",
    color: "#F97316",
    specs: [
      { icon: Box, label: "电压平台", value: "400-800V", en: "Voltage" },
      { icon: Cpu, label: "智能BMS", value: "标配", en: "Smart BMS" },
      { icon: Shield, label: "热管理", value: "液冷", en: "Thermal" },
      { icon: Clock, label: "设计寿命", value: "15年", en: "Design Life" },
    ],
  },
];

const comparisonData = [
  { feature: "能量密度 / Energy Density", liion: "250 Wh/kg", ss: "500+ Wh/kg" },
  { feature: "安全性 / Safety", liion: "有热失控风险", ss: "本质安全" },
  { feature: "循环寿命 / Cycle Life", liion: "500-1000次", ss: "800+次" },
  { feature: "充电时间 / Charge Time", liion: "30-60分钟", ss: "10-15分钟" },
  { feature: "工作温度 / Operating Temp", liion: "-20°C~50°C", ss: "-40°C~80°C" },
];

export default function ProductsPage() {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const currentMessages = messages[locale];

  return (
    <>
      <ScrollProgress color="accent" height="sm" />
      <CursorFollower color="rgba(47, 128, 255, 0.08)" size={500} />

      <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="section-padding bg-primary relative overflow-hidden">
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute inset-0 grid-pattern-strong opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[150px]" />

            <div className="container-padding mx-auto relative">
              <FadeIn className="text-center max-w-4xl mx-auto">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6"
                >
                  <Battery className="w-4 h-4 text-accent" />
                  {locale === "zh" ? "产品中心" : "Products"}
                </motion.span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
                  {locale === "zh" ? "云驰系列" : "CloudChi Series"}
                </h1>
                <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
                  {locale === "zh"
                    ? "以任务属性定义产品，为边界场景提供差异化动力方案。覆盖无人机、具身智能、水下机器人等多领域应用。"
                    : "Mission-defined products for demanding boundary applications. Covering UAVs, embodied AI, underwater robots and more."}
                </p>
              </FadeIn>
            </div>
          </section>

          {/* Products Grid */}
          <section className="section-padding bg-secondary/[0.02]">
            <div className="container-padding mx-auto">
              <div className="space-y-16 md:space-y-24">
                {products.map((product, index) => {
                  const isEven = index % 2 === 0;

                  return (
                    <FadeIn key={product.id}>
                      <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                        {/* Image */}
                        <div className={`relative ${isEven ? '' : 'lg:order-2'}`}>
                          <ScaleIn>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="relative aspect-[4/3] rounded-3xl overflow-hidden"
                            >
                              <Image
                                src={product.image}
                                alt={product.model}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

                              {/* Badge */}
                              <div
                                className="absolute top-4 left-4 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
                                style={{ backgroundColor: `${product.color}20` }}
                              >
                                <span className="text-sm font-medium" style={{ color: product.color }}>
                                  {locale === "zh" ? product.badge : product.badgeEn}
                                </span>
                              </div>

                              {/* Model */}
                              <div className="absolute bottom-4 left-4">
                                <h3 className="text-2xl font-heading font-bold text-white">
                                  {product.model}
                                </h3>
                              </div>
                            </motion.div>
                          </ScaleIn>
                        </div>

                        {/* Content */}
                        <div className={isEven ? '' : 'lg:order-1'}>
                          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                            {(currentMessages.products as Record<string, {title?: string; desc?: string}>)[product.key]?.title}
                          </h2>
                          <p className="text-lg text-white/60 mb-8">
                            {(currentMessages.products as Record<string, {title?: string; desc?: string}>)[product.key]?.desc}
                          </p>

                          {/* Specs Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            {product.specs.map((spec, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 rounded-xl bg-white/[0.03] border border-white/5"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <spec.icon className="w-4 h-4" style={{ color: product.color }} />
                                  <span className="text-xs text-white/50">{spec.en}</span>
                                </div>
                                <p className="text-lg font-heading font-semibold text-white">{spec.value}</p>
                              </motion.div>
                            ))}
                          </div>

                          <Link href={`/${locale}/contact`}>
                            <Button className="group" style={{ backgroundColor: product.color }}>
                              {locale === "zh" ? "了解更多" : "Learn More"}
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="section-padding bg-primary">
            <div className="container-padding mx-auto">
              <FadeIn className="text-center max-w-2xl mx-auto mb-12">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-4 tracking-wider uppercase">
                  <Cylinder className="w-4 h-4" />
                  {locale === "zh" ? "技术对比" : "Comparison"}
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                  {locale === "zh" ? "为什么选择固态电池？" : "Why Solid-State?"}
                </h2>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-2xl overflow-hidden glass-card">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/50 font-medium">
                          {locale === "zh" ? "特性" : "Feature"}
                        </th>
                        <th className="text-center p-4 text-white/60 font-medium">
                          {locale === "zh" ? "液态锂电池" : "Liquid Li-ion"}
                        </th>
                        <th className="text-center p-4 text-white font-medium" style={{ backgroundColor: "rgba(47, 128, 255, 0.1)" }}>
                          {locale === "zh" ? "固态电池" : "Solid-State"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="p-4 text-white">{row.feature}</td>
                          <td className="p-4 text-center text-white/60">{row.liion}</td>
                          <td className="p-4 text-center text-accent font-medium" style={{ backgroundColor: "rgba(47, 128, 255, 0.05)" }}>{row.ss}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 bg-gradient-to-br from-accent/10 via-primary to-cyan/10 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px]" />

            <div className="container-padding mx-auto relative text-center">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                  {locale === "zh" ? "需要定制解决方案？" : "Need a Custom Solution?"}
                </h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  {locale === "zh"
                    ? "我们的工程团队可以根据您的具体需求提供定制化的固态电池解决方案。"
                    : "Our engineering team can provide customized solid-state battery solutions based on your requirements."}
                </p>
                <Link href={`/${locale}/contact`}>
                  <Button size="lg" className="group">
                    {locale === "zh" ? "联系我们" : "Contact Us"}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </FadeIn>
            </div>
          </section>
        </main>

        <Footer translations={currentMessages} locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}
