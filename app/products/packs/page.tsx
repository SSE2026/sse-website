"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";

const messages = { en, zh };

// 电池组只做定制,没有标准型号 —— 这里列的是两类成组形态。
// 两张图为透明底产品图,已裁掉四周透明边距;原始尺寸写出来给 next/image 预留空间(避免 CLS)。
const PACKS = [
  {
    key: "simple",
    image: "/images/pack-simple.png",
    width: 913,
    height: 745,
    nameZh: "简易电池组",
    nameEn: "Simple Battery Pack",
    descZh: "结构精简的基础成组方案,按项目需求定制容量、电压与外形尺寸。",
    descEn:
      "A streamlined pack, built to order around your required capacity, voltage and form factor.",
  },
  {
    key: "smart",
    image: "/images/pack-smart.png",
    width: 1368,
    height: 688,
    nameZh: "智能电池组",
    nameEn: "Smart Battery Pack",
    descZh: "集成 BMS 与热管理,按项目需求定制容量、电压与外形尺寸。",
    descEn:
      "Combines BMS and thermal management, built to order around your required capacity, voltage and form factor.",
  },
];

// 电池组 Hero 副标题 —— 两类定制能力
const HERO_POINTS = {
  zh: [
    "支持多种电压/容量组合,灵活适配不同设备需求",
    "支持 400-800V 高压电池系统在内的智能电池系统定制需求",
  ],
  en: [
    "Multiple voltage and capacity combinations, adapting flexibly to different device requirements",
    "Custom smart battery systems, including 400–800 V high-voltage battery systems",
  ],
};

export default function PacksPage() {
  const [locale, setLocale] = useState<"en" | "zh">(() => resolveInitialLocale());
  const isZh = locale === "zh";
  const currentMessages = messages[locale];

  return (
    <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        forceLightText={false}
      />
      <main className="min-h-[60vh]" style={{ backgroundColor: "#f8fafc" }}>
        <section className="max-w-[1140px] mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          {/* 标题区 */}
          <div className="pl-4 border-l-4" style={{ borderColor: "#2563EB" }}>
            <h1
              className="text-3xl md:text-4xl font-extrabold mb-3"
              style={{ color: "#0f172a", fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {isZh ? "电池组" : "Battery Packs"}
            </h1>
            <ul
              className="space-y-1.5 text-sm md:text-[15px] leading-relaxed"
              style={{ color: "#64748b", fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {(isZh ? HERO_POINTS.zh : HERO_POINTS.en).map((point) => (
                <li key={point} className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[0.62em] h-1 w-1 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: "#2563EB" }}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 两类成组形态 */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {PACKS.map((pack, i) => (
              <motion.div
                key={pack.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="group bg-white rounded-xl border p-5 md:p-6 transition-colors duration-200 border-[#E4E4E7] hover:border-[#BFDBFE] shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.25)]"
              >
                {/* 产品图 — 透明底,按比例完整显示,不裁切 */}
                <div
                  className="h-[220px] md:h-[260px] rounded-lg flex items-center justify-center p-6 mb-5"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <Image
                    src={pack.image}
                    alt={isZh ? pack.nameZh : pack.nameEn}
                    width={pack.width}
                    height={pack.height}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    // 两张图都是首屏主视觉,用 priority 立即加载,
                    // 不用 loading="lazy"(首屏懒加载会拖慢 LCP)。
                    priority
                    className="max-h-full max-w-full w-auto h-auto object-contain"
                  />
                </div>

                <h2
                  className="text-xl md:text-[22px] font-bold tracking-tight"
                  style={{ color: "#0A0A0F" }}
                >
                  {isZh ? pack.nameZh : pack.nameEn}
                </h2>
                <p
                  className="text-[14px] leading-relaxed mt-2"
                  style={{ color: "#64748B" }}
                >
                  {isZh ? pack.descZh : pack.descEn}
                </p>

                <div className="mt-5 flex items-center justify-end">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold no-underline transition-colors duration-200 text-[#64748B] group-hover:text-[#2563EB]"
                  >
                    {isZh ? "定制咨询" : "Request a Quote"}
                    <span
                      aria-hidden
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer translations={currentMessages} locale={locale} />
    </NextIntlClientProvider>
  );
}
