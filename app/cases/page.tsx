"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CaseHero } from "@/components/cases/CaseHero";
import { CaseSection } from "@/components/cases/CaseSection";
import { EngineeringProcess } from "@/components/cases/EngineeringProcess";
import { FinalCTA } from "@/components/cases/FinalCTA";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

interface Case01Translations {
  highlight: string;
}

interface CasesPageTranslations {
  nav: {
    home: string;
    about: string;
    products: string;
    technology: string;
    cases: string;
    industries: string;
    news: string;
    contact: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    products: string;
    technology: string;
    about: string;
    contact: string;
    legal: string;
    privacy: string;
    terms: string;
    copyright: string;
    getInTouch: string;
    newsletter: string;
    newsletterDesc: string;
  };
  [key: string]: any;
  casesPage: {
    case01: Case01Translations;
    case02: Case01Translations;
    case03: Case01Translations;
    case04: Case01Translations;
  };
}

function CasesPageContent({ translations }: { translations: CasesPageTranslations }) {
  return (
    <main className="bg-[#050505]">
      {/* Hero */}
      <CaseHero />

      {/* Case 01 */}
      <CaseSection
        id="case-1"
        highlight={translations.casesPage.case01.highlight}
        videoPath="/images/technology/视频/大型复合翼（无水印）.mp4"
        locale="en"
      />

      {/* Case 02 */}
      <CaseSection
        id="case-2"
        highlight={translations.casesPage.case02.highlight}
        videoPath="/images/technology/视频/中型复合翼（无水印）.mp4"
        locale="en"
      />

      {/* Case 03 */}
      <CaseSection
        id="case-3"
        highlight={translations.casesPage.case03.highlight}
        videoPath="/images/technology/视频/大型载重（无水印）.mp4"
        locale="en"
      />

      {/* Case 04 */}
      <CaseSection
        id="case-4"
        highlight={translations.casesPage.case04.highlight}
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
  const currentMessages = messages[locale] as CasesPageTranslations;

  return (
    <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        forceLightText={true}
      />

      <CasesPageContent translations={currentMessages} />

      <Footer
        translations={currentMessages}
        locale={locale}
      />
    </NextIntlClientProvider>
  );
}
