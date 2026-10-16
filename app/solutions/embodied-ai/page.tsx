"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";

import { IndustryDetailHero } from "@/components/solutions/IndustryDetailHero";
import { IndustryChallengeSolution } from "@/components/solutions/IndustryChallengeSolution";
import { pairChallengesWithCapabilities } from "@/data/solutionPairing";
import { CaseBlock, type CaseBlockItem } from "@/components/solutions/CaseBlock";
import { DevelopmentFlow } from "@/components/solutions/DevelopmentFlow";
import { BusinessCTA } from "@/components/solutions/BusinessCTA";

const messages = { en, zh };

type Locale = "en" | "zh";

function IndustryPageContent({ locale }: { locale: Locale }) {
  const t = messages[locale].solutions.embodiedAI;
  const isZh = locale === "zh";

  const cases: CaseBlockItem[] = (t.cases.items as CaseBlockItem[]).map((c) => ({
    scene: c.scene,
    applications: c.applications,
    value: c.value,
    metrics: c.metrics,
    comparison: c.comparison,
    image: c.image,
    imageAlt: c.imageAlt ?? c.scene,
  }));

  const flowSteps = messages[locale].solutions.flow.steps;

  return (
    <main className="bg-white">
      <IndustryDetailHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        bgSrc="/images/solutions/embodied-ai-hero.jpg"
      />

      <IndustryChallengeSolution
        eyebrow="CHALLENGES"
        title={t.highlights.title}
        intro={t.value.desc}
        challengeColumnLabel={t.painPoints.title}
        solutionColumnLabel={isZh ? "深安能力" : "SSE Capability"}
        rows={pairChallengesWithCapabilities("embodiedAI", t.painPoints.items, t.highlights.items)}
      />

      <CaseBlock title={t.cases.title} cases={cases} />

      <DevelopmentFlow
        title={isZh ? "项目开发流程" : "Project development flow"}
        subtitle={
          isZh
            ? "从需求到量产,合作路径透明。"
            : "From needs to mass production, transparent collaboration path."
        }
        steps={flowSteps}
        footnote={
          isZh
            ? "实际流程以商务协议为准。"
            : "Actual workflow is governed by the commercial agreement."
        }
      />

      <BusinessCTA
        title={isZh ? "获取您的专属动力方案" : "Get your dedicated power solution"}
        desc={
          isZh
            ? "提交平台类型、续航与功率目标，工程团队将根据整机工况给出可行方案。"
            : "Send us your platform type, endurance and power targets — our engineering team will respond with an actionable proposal."
        }
        buttonLabel={isZh ? "立即咨询" : "Talk to Engineering"}
        href="/contact"
      />
    </main>
  );
}

export default function EmbodiedAIPage() {
  const [locale, setLocale] = useState<Locale>(() => resolveInitialLocale());
  const currentMessages = messages[locale];

  return (
    <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as Locale)}
        forceLightText={false}
      />
      <IndustryPageContent locale={locale} />
      <Footer translations={currentMessages} locale={locale} />
    </NextIntlClientProvider>
  );
}