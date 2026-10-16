"use client";

import { useState, useMemo } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroCarousel, { type HeroSlide } from "@/components/ui/hero-carousel/HeroCarousel";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import {
  getProductsBySeries,
  seriesProfiles,
  SERIES_ORDER,
  type Product,
  type SeriesId,
} from "@/data/products";
import { resolveInitialLocale } from "@/lib/locale";

const messages = { en, zh };

/** 规格行:顺序与附件表格一致 */
function buildSpecItems(product: Product, isZh: boolean) {
  const s = product.spec;
  const items: { label: string; value: string }[] = [
    { label: isZh ? "外形尺寸" : "Dimensions", value: s.dimensions },
    { label: isZh ? "额定容量" : "Capacity", value: s.capacity },
    { label: isZh ? "标称电压" : "Nominal Voltage", value: s.voltage },
    { label: isZh ? "充放电区间" : "Voltage Range", value: `${s.voltageRange} V` },
    { label: isZh ? "重量" : "Weight", value: s.weight },
  ];

  if (product.series === "460x") {
    if (s.continuous) {
      items.push({
        label: isZh ? "最大持续放电倍率" : "Max Continuous Discharge",
        value: s.continuous,
      });
    }
    if (s.peak) {
      items.push({
        label: isZh ? "瞬时放电倍率" : "Peak Discharge",
        value: s.peak,
      });
    }
  } else if (s.chargeRate && s.dischargeRate) {
    items.push({
      label: isZh ? "最大持续充/放电倍率" : "Max Continuous Charge/Discharge",
      value: `${s.chargeRate} / ${s.dischargeRate}`,
    });
  }

  const loc = isZh ? "zh" : "en";

  items.push({
    label: isZh ? "循环寿命" : "Cycle Life",
    value: s.cycleLife[loc],
  });

  if (s.safety) {
    items.push({ label: isZh ? "安全性" : "Safety", value: s.safety[loc] });
  }

  return items;
}

/**
 * 把系列名拆成「型号」「类型」两段,供系列导航与 Hero 标题分行显示,例如
 *   "云驰 360-P 功率型"              → { model: "云驰 360-P",  type: "功率型" }
 *   "Aeroride 460-X Ultra-High Energy" → { model: "Aeroride 460-X", type: "Ultra-High Energy" }
 * 只做展示层拆分,不改动 data/products.ts 里的任何文案与数据。
 */
function splitSeriesName(label: string) {
  const m = label.match(/^(.+?\d{3}-[A-Z])\s*(.*)$/);
  return m ? { model: m[1], type: m[2] } : { model: label, type: "" };
}

export default function SeriesDetailView({ seriesId }: { seriesId: SeriesId }) {
  const [locale, setLocale] = useState<"en" | "zh">(() => resolveInitialLocale());
  const currentMessages = messages[locale];
  const isZh = locale === "zh";

  const profile = seriesProfiles[seriesId];
  const seriesProducts = getProductsBySeries(seriesId);

  const slides: HeroSlide[] = useMemo(() => {
    // 型号一行、类型一行 —— 三个系列页 Hero 标题排版保持一致
    const { model, type } = splitSeriesName(profile.hero.title[locale]);
    return [
      {
        id: 1,
        // 每个系列用各自的产品大图(透明底),不再用统一的品牌视频
        image: profile.heroImage,
        imageAlt: profile.label.en,
        eyebrow: profile.hero.eyebrow[locale],
        title: model,
        titleLine2: type || undefined,
        description: profile.hero.description[locale],
        ctaText: isZh ? "即刻咨询" : "Inquire Now",
        ctaLink: "/contact",
      },
    ];
  }, [locale, isZh, profile]);

  return (
    <>
      <ScrollProgress color={profile.color} height="sm" />
      <CursorFollower color={`${profile.color}15`} size={500} />

      <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
          forceLightText={false}
        />

        <main>
          {/* Hero — series showcase */}
          <HeroCarousel slides={slides} autoPlayInterval={3000} />

          <section style={{ backgroundColor: "#f8fafc", paddingBottom: "100px" }}>
            {/* 产品系列导航 — 三个系列各自独立成页,这里做页面跳转 */}
            <div className="border-y border-[#E2E8F0] bg-white">
              <div className="max-w-[1140px] mx-auto px-6">
                <nav className="flex flex-wrap items-stretch justify-center gap-x-1 md:gap-x-2 gap-y-1 py-2 md:py-3">
                  {SERIES_ORDER.map((id) => {
                    const item = seriesProfiles[id];
                    const isActive = id === seriesId;
                    const { model, type } = splitSeriesName(item.label[locale]);

                    const cellClass =
                      "flex flex-col items-center px-4 md:px-7 pt-2.5 pb-2 rounded-t-md border-b-2 no-underline transition-colors duration-200";

                    const inner = (
                      <>
                        <span className="text-[15px] md:text-[16px] font-semibold leading-tight whitespace-nowrap">
                          {model}
                        </span>
                        {type ? (
                          <span className="text-[11px] md:text-[12px] leading-tight mt-0.5 whitespace-nowrap opacity-75">
                            {type}
                          </span>
                        ) : null}
                      </>
                    );

                    if (isActive) {
                      return (
                        <span
                          key={id}
                          aria-current="page"
                          className={cellClass}
                          style={{
                            color: item.color,
                            borderColor: item.color,
                            backgroundColor: `${item.color}0A`,
                          }}
                        >
                          {inner}
                        </span>
                      );
                    }

                    return (
                      <Link
                        key={id}
                        href={`/products/${item.slug}`}
                        className={`${cellClass} border-transparent text-[#52525B] hover:text-[#2563EB] hover:bg-[#F8FAFC]`}
                      >
                        {inner}
                      </Link>
                    );
                  })}

                  {/* 分隔线:右边是动作,不是产品系列 */}
                  <span aria-hidden className="hidden md:block w-px my-2 mx-1 bg-[#E2E8F0]" />

                  <Link
                    href="/contact"
                    className={`flex flex-col items-center justify-center px-4 md:px-7 py-2.5 rounded-t-md border-b-2 border-transparent no-underline text-[#52525B] hover:text-[#059669] hover:bg-[#ECFDF5] transition-colors duration-200`}
                  >
                    <span className="text-[15px] md:text-[16px] font-semibold leading-tight whitespace-nowrap">
                      {isZh ? "立即定制" : "Custom Now"}
                    </span>
                  </Link>
                </nav>
              </div>
            </div>

            <div className="max-w-[1140px] mx-auto px-6">
              {/* Series header */}
              <div className="pt-20">
                <div
                  className="mb-8 pl-4 border-l-4"
                  style={{ borderColor: profile.color }}
                >
                  <h2 className="text-3xl font-extrabold mb-1" style={{ color: "#0f172a" }}>
                    {profile.label[locale]}
                  </h2>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    {profile.subtitle[locale]}
                  </p>
                </div>

                {/* 产品列表 */}
                <div className="flex flex-col gap-4">
                  {seriesProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="group bg-white rounded-xl border p-5 md:p-6 transition-colors duration-200 border-[#E4E4E7] hover:border-[#BFDBFE] shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.25)]"
                    >
                      <div className="flex flex-col sm:flex-row gap-5 md:gap-7">
                        {/* 产品图片 — 尺寸与比例保持原样 */}
                        <div
                          className="w-full sm:w-32 h-56 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                          style={{ backgroundColor: "#f8fafc" }}
                        >
                          <img
                            src={product.image}
                            alt={product.sku}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>

                        {/* 产品主体 */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          {/* 型号 + 能量密度 */}
                          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                            <h3
                              className="text-[19px] md:text-[21px] font-bold tracking-tight"
                              style={{ color: "#0f172a" }}
                            >
                              {product.sku}
                            </h3>
                            <span
                              className="inline-flex items-center rounded-md px-2.5 py-1 text-[14px] md:text-[15px] font-bold whitespace-nowrap"
                              style={{
                                color: profile.color,
                                backgroundColor: `${profile.color}0F`,
                              }}
                            >
                              {product.energyDensity}
                            </span>
                          </div>

                          <div
                            className="mt-3.5 mb-4 h-px"
                            style={{ backgroundColor: "#EEF2F7" }}
                          />

                          {/* 参数网格 — 标签弱化、数值加强,长值在格内换行不错位 */}
                          <dl className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 xl:gap-x-8 gap-y-3.5">
                            {buildSpecItems(product, isZh).map((item) => (
                              <div key={item.label} className="min-w-0">
                                <dt
                                  className="text-[12px] leading-tight mb-1"
                                  style={{ color: "#94A3B8" }}
                                >
                                  {item.label}
                                </dt>
                                <dd
                                  className="text-[15px] font-bold leading-snug break-words"
                                  style={{ color: "#0A0A0F" }}
                                >
                                  {item.value}
                                </dd>
                              </div>
                            ))}
                          </dl>

                          {/* CTA — 低视觉权重,整卡 Hover 时点亮 */}
                          <div className="mt-auto pt-5 flex items-center justify-end">
                            <Link
                              href="/contact"
                              className="inline-flex items-center gap-1.5 text-[14px] font-semibold no-underline transition-colors duration-200 text-[#64748B] group-hover:text-[#2563EB]"
                            >
                              {isZh ? "即刻咨询" : "Inquire Now"}
                              <span
                                aria-hidden
                                className="transition-transform duration-200 group-hover:translate-x-1"
                              >
                                →
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Custom Block */}
              <div className="pt-20">
                <div className="w-full max-w-7xl mx-auto">
                  <div className="relative rounded-lg bg-[#0a0a0c] border border-neutral-800/80 p-8 md:p-10 transition-colors duration-300 hover:border-neutral-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-3 max-w-2xl">
                        <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-500">
                          {"// CUSTOM SPECIFICATIONS"}
                        </div>

                        <h3 className="text-xl md:text-2xl font-light text-white tracking-tight leading-snug">
                          {isZh ? "未找到合适规格？ " : "Can't find the right specs? "}
                          <span className="text-neutral-400">
                            {isZh ? "支持全栈式参数定制" : "Full Custom Solutions"}
                          </span>
                        </h3>

                        <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
                          {isZh
                            ? "提供容量、电压、尺寸及特殊倍率特性的定制化固态/半固态电池方案。"
                            : "Custom solid-state/semi-solid-state battery solutions for capacity, voltage, dimensions and special rate characteristics."}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <Link href="/contact">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              y: {
                                duration: 1.0,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                              },
                            }}
                            className="relative inline-flex items-center gap-3 px-10 py-5 rounded bg-white hover:bg-neutral-200 text-black text-sm font-mono tracking-wider uppercase font-semibold transition-all duration-200 group"
                            style={{
                              boxShadow:
                                "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)",
                            }}
                          >
                            <span>{isZh ? "立即定制" : "Custom Now"}</span>
                            <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                              ↗
                            </span>
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer translations={currentMessages} locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}
