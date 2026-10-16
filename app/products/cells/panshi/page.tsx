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

export default function CellsPanshiPage() {
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
      <main className="min-h-[60vh] bg-white">
        <section className="max-w-[1140px] mx-auto px-6 py-24 md:py-32 text-center">
          <div
            className="inline-block text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-6"
            style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
          >
            {isZh ? "电芯 / 磐石" : "CELLS / FORTICORE"}
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#0A0A0F] mb-6"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {isZh ? "磐石系列" : "FortiCore Series"}
          </h1>
          <p
            className="text-base md:text-lg text-[#3F3F46] max-w-[60ch] mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
          >
            {isZh
              ? "磐石系列面向工业级与高强度作业场景,专注于超长循环寿命与极端工况下的高安全表现。"
              : "FortiCore series targets industrial and high-intensity operation scenarios, focused on ultra-long cycle life and high safety under extreme conditions."}
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