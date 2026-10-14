"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NextIntlClientProvider } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";

const messages = { en, zh };

type CategoryCard = {
  href: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  metaZh: string;
  metaEn: string;
};

const CARDS: CategoryCard[] = [
  {
    href: "/products/cells/cloudchi",
    titleZh: "电芯 · 云驰系列",
    titleEn: "Cells · Cloudchi (Aeroride) Series",
    descZh: "高能量密度 + 高功率输出,3 个子型号(360-P / 400-E / 460-X),覆盖低空、深海与具身智能核心场景。",
    descEn: "High energy density + high power. Three sub-models (360-P / 400-E / 460-X) for low-altitude, deep-sea, and embodied-AI applications.",
    metaZh: "3 型号 / 360-460 Wh/kg",
    metaEn: "3 models / 360–460 Wh/kg",
  },
  {
    href: "/products/cells/panshi",
    titleZh: "电芯 · 磐石系列",
    titleEn: "Cells · Panshi Series",
    descZh: "面向工业级与高强度作业场景,聚焦超长循环寿命与极端工况下的高安全表现。",
    descEn: "Industrial-grade cells with ultra-long cycle life and high safety under extreme conditions.",
    metaZh: "即将上线",
    metaEn: "Coming soon",
  },
  {
    href: "/products/packs",
    titleZh: "电池组",
    titleEn: "Battery Packs",
    descZh: "整合电芯、BMS 与热管理,面向整机厂商的整体电源解决方案。",
    descEn: "Turnkey power solutions combining cells, BMS, and thermal management for system integrators.",
    metaZh: "即将上线",
    metaEn: "Coming soon",
  },
];

export default function ProductsIndexPage() {
  const [locale] = useState<"en" | "zh">(() => resolveInitialLocale());
  const isZh = locale === "zh";
  const currentMessages = messages[locale];

  return (
    <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={() => {}}
        forceLightText={false}
      />
      <main className="min-h-screen bg-white">
        <section className="max-w-[1140px] mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div
            className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-6"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            {isZh ? "产品中心 / PRODUCTS" : "PRODUCTS"}
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#0A0A0F] leading-tight max-w-[18ch]"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {isZh
              ? "电芯与电池组,覆盖边界场景。"
              : "Cells and battery packs for boundary applications."}
          </h1>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  href={card.href}
                  className="group block bg-white rounded-2xl border border-[#E4E4E7] p-7 md:p-8 hover:border-[#0A0A0F] hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div
                        className="text-[11px] tracking-[0.28em] uppercase text-[#71717A] mb-3"
                        style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
                      >
                        {isZh ? card.metaZh : card.metaEn}
                      </div>
                      <h2
                        className="text-2xl md:text-3xl font-bold text-[#0A0A0F] mb-3"
                        style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                      >
                        {isZh ? card.titleZh : card.titleEn}
                      </h2>
                      <p
                        className="text-[15px] text-[#3F3F46] leading-[1.7] max-w-[40ch]"
                        style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
                      >
                        {isZh ? card.descZh : card.descEn}
                      </p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0A0A0F] text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer translations={currentMessages} locale={locale} />
    </NextIntlClientProvider>
  );
}