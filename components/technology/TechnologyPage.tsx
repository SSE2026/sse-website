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

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

function TechnologyPageContent() {
  const t = useTranslations("techPage");

  const heroProps = {
    badge: t("hero.badge"),
    title: t("hero.title"),
    subtitle: t("hero.subtitle"),
    stats: {
      patents: t("hero.stats.patents"),
      papers: t("hero.stats.papers"),
      production: t("hero.stats.production"),
      samples: t("hero.stats.samples"),
    },
  };

  const coreTechProps = {
    label: t("coreTech.label"),
    title: t("coreTech.title"),
    subtitle: t("coreTech.subtitle"),
    items: t.raw("coreTech.items") as Array<{
      title: string;
      summary: string;
      details: string[];
    }>,
  };

  const rdStrengthProps = {
    label: t("rdStrength.label"),
    title: t("rdStrength.title"),
  };

  const ctaProps = {
    title: t("cta.title"),
    titleEn: t("cta.titleEn"),
    buttonText: t("cta.button"),
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
        <RDStrengthSection labels={rdStrengthProps} />

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

      <TechnologyPageContent />

      <Footer translations={currentMessages} locale={locale} />
    </NextIntlClientProvider>
  );
}
