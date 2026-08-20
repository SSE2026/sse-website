"use client";

import { useState } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CaseHero } from "@/components/cases/CaseHero";
import { CaseSection } from "@/components/cases/CaseSection";
import { EngineeringProcess } from "@/components/cases/EngineeringProcess";
import { FinalCTA } from "@/components/cases/FinalCTA";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

function CasesPageContent() {
  const t = useTranslations("casesPage");

  return (
    <main className="bg-[#050505]">
      {/* Hero */}
      <CaseHero />

      {/* Case 01 */}
      <CaseSection
        id="case-1"
        highlight={t("case01.highlight")}
        videoPath="/images/technology/视频/大型复合翼（无水印）.mp4"
        locale="en"
      />

      {/* Case 02 */}
      <CaseSection
        id="case-2"
        highlight={t("case02.highlight")}
        videoPath="/images/technology/视频/中型复合翼（无水印）.mp4"
        locale="en"
      />

      {/* Case 03 */}
      <CaseSection
        id="case-3"
        highlight={t("case03.highlight")}
        videoPath="/images/technology/视频/大型载重（无水印）.mp4"
        locale="en"
      />

      {/* Case 04 */}
      <CaseSection
        id="case-4"
        highlight={t("case04.highlight")}
        videoPath="/images/technology/视频/中型旋转翼（无水印）.mp4"
        locale="en"
      />

      {/* Engineering Process */}
      <EngineeringProcess />

      {/* Final CTA */}
      <FinalCTA />
    </main>
  );
}

export default function CasesPage() {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const currentMessages = messages[locale];

  return (
    <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        forceLightText={true}
      />

      <CasesPageContent />

      <Footer
        translations={currentMessages}
        locale={locale}
      />
    </NextIntlClientProvider>
  );
}
