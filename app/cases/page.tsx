"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CaseHero } from "@/components/cases/CaseHero";
import { CaseSection } from "@/components/cases/CaseSection";
import { EngineeringProcess } from "@/components/cases/EngineeringProcess";
import { useCmsContent } from "@/lib/cms/use-cms";

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

function CasesPageContent({ translations, locale }: { translations: CasesPageTranslations; locale: string }) {
  const cms = useCmsContent("cases", locale) as {
    hero?: { title?: string; subtitle?: string };
    case01?: { highlight?: string; platform?: string; battery?: string; highlightLabel?: string; videoUrl?: string };
    case02?: { highlight?: string; platform?: string; battery?: string; highlightLabel?: string; videoUrl?: string };
    case03?: { highlight?: string; platform?: string; battery?: string; highlightLabel?: string; videoUrl?: string };
    case04?: { highlight?: string; platform?: string; battery?: string; highlightLabel?: string; videoUrl?: string };
    workflow?: { title?: string; subtitle?: string; stepsJson?: string; steps?: Array<{ title: string }>; keywordsJson?: string; keywords?: string[] };
  };
  const heroCms = cms.hero ?? {};
  const c1 = cms.case01 ?? {};
  const c2 = cms.case02 ?? {};
  const c3 = cms.case03 ?? {};
  const c4 = cms.case04 ?? {};
  const wf = cms.workflow ?? {};

  // Parse workflow steps/keywords (CMS JSON) with fallback to messages.
  let wfSteps: Array<{ title: string }> | undefined;
  if (wf.stepsJson) {
    try {
      const parsed = JSON.parse(wf.stepsJson);
      if (Array.isArray(parsed) && parsed.length > 0) wfSteps = parsed as Array<{ title: string }>;
    } catch { /* keep undefined */ }
  } else if (Array.isArray(wf.steps) && wf.steps.length > 0) {
    wfSteps = wf.steps;
  }
  let wfKeywords: string[] | undefined;
  if (wf.keywordsJson) {
    try {
      const parsed = JSON.parse(wf.keywordsJson);
      if (Array.isArray(parsed) && parsed.length > 0) wfKeywords = parsed as string[];
    } catch { /* keep undefined */ }
  } else if (Array.isArray(wf.keywords) && wf.keywords.length > 0) {
    wfKeywords = wf.keywords;
  }

  return (
    <main className="bg-[#050505]">
      {/* Hero */}
      <CaseHero title={heroCms.title} subtitle={heroCms.subtitle} />

      {/* Case 01 */}
      <CaseSection
        id="case-1"
        highlight={c1.highlight || translations.casesPage.case01.highlight}
        videoPath={c1.videoUrl || "/images/technology/视频/大型复合翼（无水印）.mp4"}
        locale="en"
        platform={c1.platform}
        battery={c1.battery}
        highlightLabel={c1.highlightLabel}
      />

      {/* Case 02 */}
      <CaseSection
        id="case-2"
        highlight={c2.highlight || translations.casesPage.case02.highlight}
        videoPath={c2.videoUrl || "/images/technology/视频/中型复合翼（无水印）.mp4"}
        locale="en"
        platform={c2.platform}
        battery={c2.battery}
        highlightLabel={c2.highlightLabel}
      />

      {/* Case 03 */}
      <CaseSection
        id="case-3"
        highlight={c3.highlight || translations.casesPage.case03.highlight}
        videoPath={c3.videoUrl || "/images/technology/视频/大型载重（无水印）.mp4"}
        locale="en"
        platform={c3.platform}
        battery={c3.battery}
        highlightLabel={c3.highlightLabel}
      />

      {/* Case 04 */}
      <CaseSection
        id="case-4"
        highlight={c4.highlight || translations.casesPage.case04.highlight}
        videoPath={c4.videoUrl || "/images/technology/视频/中型旋转翼（无水印）.mp4"}
        locale="en"
        platform={c4.platform}
        battery={c4.battery}
        highlightLabel={c4.highlightLabel}
      />

      {/* Engineering Process */}
      <EngineeringProcess title={wf.title} subtitle={wf.subtitle} steps={wfSteps} keywords={wfKeywords} />
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

      <CasesPageContent translations={currentMessages} locale={locale} />

      <Footer
        translations={currentMessages}
        locale={locale}
      />
    </NextIntlClientProvider>
  );
}
