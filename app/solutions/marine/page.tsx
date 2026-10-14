"use client";

import { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";

import { IndustryDetailHero } from "@/components/solutions/IndustryDetailHero";
import { IndustryChallenge } from "@/components/solutions/IndustryChallenge";
import { CaseBlock, type CaseBlockItem } from "@/components/solutions/CaseBlock";
import { IndustryHighlight } from "@/components/solutions/IndustryHighlight";
import { DevelopmentFlow } from "@/components/solutions/DevelopmentFlow";
import { BusinessCTA } from "@/components/solutions/BusinessCTA";

const messages = { en, zh };

type Locale = "en" | "zh";

function IndustryPageContent({ locale }: { locale: Locale }) {
  const t = messages[locale].solutions.marine;
  const isZh = locale === "zh";

  const cases: CaseBlockItem[] = t.cases.items.map((c) => ({
    scene: c.scene,
    applications: c.applications,
    challenges: c.challenges,
    configs: c.configs,
    image: c.image,
    imageAlt: c.imageAlt ?? c.scene,
  }));

  const flowSteps = isZh
    ? ["需求沟通", "方案设计", "系统定制", "样品验证", "量产导入"]
    : ["Requirements", "Solution design", "System customisation", "Sample validation", "Production ramp"];

  return (
    <main className="bg-white">
      <IndustryDetailHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        bgSrc="/images/solutions/marine-hero.jpg"
      />

      <IndustryChallenge title={t.painPoints.title} items={t.painPoints.items} />

      <section className="bg-[#FAFAFC] py-12 lg:py-16 px-6 md:px-10 lg:px-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <div
              className="text-[11px] tracking-[0.32em] uppercase text-[#71717A] mb-4"
              style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
            >
              {"// 03 VALUE"}
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#0A0A0F] leading-tight"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {t.value.title}
            </h2>
            <div className="mt-6 h-px w-12 bg-[#0A0A0F]" />
          </div>
          <div className="lg:col-span-8">
            <p
              className="text-[16px] md:text-[17px] text-[#0A0A0F] leading-[1.85]"
              style={{ fontFamily: "var(--font-noto-sc, sans-serif)" }}
            >
              {t.value.desc}
            </p>
          </div>
        </div>
      </section>

      <IndustryHighlight title={t.highlights.title} items={t.highlights.items} />

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
        title={isZh ? "把场景告诉我们,我们做工程化反馈。" : "Tell us your scenario. We respond with engineering."}
        desc={
          isZh
            ? "提交您的平台类型、续航/功率目标与边界条件,工程团队 48 小时内给出可行方案。"
            : "Submit your platform type, endurance/power targets and boundary conditions. Our engineering team responds within 48 hours."
        }
        buttonLabel={isZh ? "项目咨询" : "Start a Project"}
        href="/contact"
      />
    </main>
  );
}

export default function MarinePage() {
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