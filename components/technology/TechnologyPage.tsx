"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { TechnologyHero } from "./TechnologyHero";
import { CoreTechCarousel } from "./CoreTechCarousel";
import { RDStrengthSection } from "./RDStrength";
import { TechnologyCTA } from "./TechnologyCTA";
import { useCmsContent } from "@/lib/cms/use-cms";

// Fixed slide imagery. The CMS owns the copy, never the pictures.
// 顺序与文件名 01–06 一致,与 messages 里 coreTech.slides 的六条文案逐条对应。
const CORE_TECH_IMAGES = [
  "/images/technology/tech/01-oxide-electrolyte.webp",
  "/images/technology/tech/02-condensed-electrolyte.webp",
  "/images/technology/tech/03-silicon-anode.webp",
  "/images/technology/tech/04-anode-free.webp",
  "/images/technology/tech/05-fast-charging.webp",
  "/images/technology/tech/06-ai-rnd.webp",
];

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";

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

  // Slide copy: CMS itemsJson wins, else the messages-level slides. The
  // two overlay each other by index, so CMS edits retarget the carousel
  // rather than silently falling back to the old list.
  let slideCopy = t.raw("coreTech.slides") as Array<{ title: string; summary: string }>;
  if (coreTechCms.itemsJson) {
    try {
      const parsed = JSON.parse(coreTechCms.itemsJson);
      if (Array.isArray(parsed) && parsed.length > 0) slideCopy = parsed as typeof slideCopy;
    } catch {
      /* keep messages fallback */
    }
  } else if (Array.isArray(coreTechCms.items) && coreTechCms.items.length > 0) {
    slideCopy = coreTechCms.items as typeof slideCopy;
  }

  const slides = slideCopy.slice(0, CORE_TECH_IMAGES.length).map((copy, i) => ({
    title: copy.title,
    summary: copy.summary,
    image: CORE_TECH_IMAGES[i],
  }));

  const coreTechProps = {
    label: coreTechCms.label || t("coreTech.label"),
    title: coreTechCms.title || t("coreTech.title"),
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

      <main className="bg-white">
        {/* SECTION 01: Hero */}
        <TechnologyHero hero={heroProps} />

        {/* SECTION 02: Core Technology */}
        <CoreTechCarousel
          label={coreTechProps.label}
          title={coreTechProps.title}
          slides={slides}
        />

        {/* SECTION 03: R&D Strength */}
        <RDStrengthSection labels={rdStrengthProps} certs={rdCerts} />

        {/* SECTION 04: CTA */}
        <TechnologyCTA cta={ctaProps} />
      </main>
    </>
  );
}

export default function TechnologyPage() {
  const [locale, setLocale] = useState<"en" | "zh">(() => resolveInitialLocale());
  const currentMessages = messages[locale];

  return (
    <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        forceLightText={false}
      />

      <TechnologyPageContent locale={locale} />

      <Footer translations={currentMessages} locale={locale} />
    </NextIntlClientProvider>
  );
}
