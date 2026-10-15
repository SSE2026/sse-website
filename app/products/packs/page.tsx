"use client";

import { useState } from "react";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";

const messages = { en, zh };

export default function PacksPage() {
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
      <main className="min-h-[60vh] bg-white">
        <section className="max-w-[1140px] mx-auto px-6 py-24 md:py-32 text-center">
          <div
            className="inline-block text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-6"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            {isZh ? "电池组" : "BATTERY PACKS"}
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#0A0A0F] mb-6"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {isZh ? "电池组" : "Battery Packs"}
          </h1>
          <p
            className="text-base md:text-lg text-[#3F3F46] max-w-[60ch] mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {isZh
              ? "电池组产品线整合电芯、BMS 与热管理,提供面向低空、深海与具身智能场景的整体电源解决方案。详细型号即将上线。"
              : "Our battery packs combine cells, BMS, and thermal management into turnkey power solutions for low-altitude, deep-sea, and embodied-AI applications. Detailed models coming soon."}
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0A0A0F] text-white text-sm font-semibold rounded-full hover:bg-[#1F1F2A] transition-colors"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {isZh ? "即刻咨询" : "Inquire Now"}
            </Link>
          </div>
        </section>
      </main>
      <Footer translations={currentMessages} locale={locale} />
    </NextIntlClientProvider>
  );
}