"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { TechnologyHero } from "./TechnologyHero";
import { CoreTechnologySection } from "./CoreTechnology";
import { RDStrengthSection } from "./RDStrength";
import { TechnologyCTA } from "./TechnologyCTA";
import { useCmsContent } from "@/lib/cms/use-cms";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

function TechnologyPageContent({ locale }: { locale: string }) {
  const t = useTranslations("techPage");
  const cms = useCmsContent("technology", locale) as {
    hero?: { badge?: string; title?: string; subtitle?: string };
    coreTech?: { label?: string; title?: string; subtitle?: string; itemsJson?: string; items?: Array<{ title: string; summary: string; details: string[] }> };
    cta?: { title?: string; titleEn?: string; button?: string };
    rdStrength?: { label?: string; title?: string; certsJson?: string; certs?: Array<{ src: string; alt: string }> };
  };
  const heroCms = cms.hero ?? {};
  const coreTechCms = cms.coreTech ?? {};
  const ctaCms = cms.cta ?? {};
  const rdStrengthCms = cms.rdStrength ?? {};

  const heroProps = {
    badge: heroCms.badge || t("hero.badge"),
    title: heroCms.title || t("hero.title"),
    subtitle: heroCms.subtitle || t("hero.subtitle"),
    stats: {
      patents: t("hero.stats.patents"),
      papers: t("hero.stats.papers"),
      production: t("hero.stats.production"),
      samples: t("hero.stats.samples"),
    },
  };

  // coreTech items: prefer CMS itemsJson (parsed), else messages.
  let coreItems = t.raw("coreTech.items") as Array<{ title: string; summary: string; details: string[] }>;
  if (coreTechCms.itemsJson) {
    try {
      const parsed = JSON.parse(coreTechCms.itemsJson);
      if (Array.isArray(parsed) && parsed.length > 0) coreItems = parsed as typeof coreItems;
    } catch {
      /* keep messages fallback */
    }
  } else if (Array.isArray(coreTechCms.items) && coreTechCms.items.length > 0) {
    coreItems = coreTechCms.items as typeof coreItems;
  }

  const coreTechProps = {
    label: coreTechCms.label || t("coreTech.label"),
    title: coreTechCms.title || t("coreTech.title"),
    subtitle: coreTechCms.subtitle || t("coreTech.subtitle"),
    items: coreItems,
  };

  const rdStrengthProps = {
    label: rdStrengthCms.label || t("rdStrength.label"),
    title: rdStrengthCms.title || t("rdStrength.title"),
  };

  // Certification images: prefer CMS certsJson, else messages-level certs array.
  let rdCerts: Array<{ src: string; alt: string }> | undefined;
  if (rdStrengthCms.certsJson) {
    try {
      const parsed = JSON.parse(rdStrengthCms.certsJson);
      if (Array.isArray(parsed) && parsed.length > 0) rdCerts = parsed as Array<{ src: string; alt: string }>;
    } catch {
      /* keep undefined */
    }
  } else if (Array.isArray(rdStrengthCms.certs) && rdStrengthCms.certs.length > 0) {
    rdCerts = rdStrengthCms.certs;
  }

  const ctaProps = {
    title: ctaCms.title || t("cta.title"),
    titleEn: ctaCms.titleEn || t("cta.titleEn"),
    buttonText: ctaCms.button || t("cta.button"),
  };

  return (
    <>
      <ScrollProgress color="#7DAEFF" height="sm" />

      <main className="pt-20 bg-[#050B14]">
        {/* SECTION 01: Hero */}
        <TechnologyHero hero={heroProps} />

        {/* SECTION 02: Core Technology */}
        <CoreTechnologySection labels={coreTechProps} items={coreTechProps.items} />

        {/* SECTION 03: R&D Strength */}
        <RDStrengthSection labels={rdStrengthProps} certs={rdCerts} />

        {/* SECTION 04: CTA */}
        <TechnologyCTA cta={ctaProps} />
      </main>
    </>
  );
}

export default function TechnologyPage() {
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

      <TechnologyPageContent locale={locale} />

      <Footer translations={currentMessages} locale={locale} />
    </NextIntlClientProvider>
  );
}
