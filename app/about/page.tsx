"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import GlobalBusinessMap from "@/components/about/GlobalBusinessMap/GlobalBusinessMap";
import MilestonesSection, { type Milestone } from "@/components/about/MilestonesSection";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { resolveInitialLocale } from "@/lib/locale";
import { CHINESE_INTRO, ENGLISH_INTRO } from "@/lib/company-intro";

const messages = { en, zh };

export default function AboutPage() {
  const [locale, setLocale] = useState<"en" | "zh">(() => resolveInitialLocale());
  const currentMessages = messages[locale];
  const isZh = locale === "zh";

  // CMS content: intro body + milestones (Hero stays hardcoded per requirement).
  const [introText, setIntroText] = useState<string | null>(null);
  const [introTitle, setIntroTitle] = useState<string | null>(null);
  const [milestoneItems, setMilestoneItems] = useState<Milestone[] | undefined>(undefined);
  const [heroCms, setHeroCms] = useState<{ title?: string; subtitle?: string; auxText?: string }>({});
  const [ctaCms, setCtaCms] = useState<{ title?: string; desc?: string; button?: string }>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/content/about?locale=${locale}`, {
          next: { revalidate: 60 },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const content = (data?.content ?? {}) as {
          intro?: { body?: string; title?: string };
          milestones?: { itemsJson?: string; items?: Milestone[] };
          hero?: { title?: string; subtitle?: string; auxText?: string };
          cta?: { title?: string; desc?: string; button?: string };
        };
        const intro = content.intro;
        if (intro?.body && intro.body.trim()) {
          setIntroText(intro.body);
        }
        if (intro?.title && intro.title.trim()) {
          setIntroTitle(intro.title);
        }
        const m = content.milestones;
        if (m?.itemsJson) {
          try {
            const parsed = JSON.parse(m.itemsJson);
            if (Array.isArray(parsed) && parsed.length > 0) setMilestoneItems(parsed as Milestone[]);
          } catch {
            /* fall back to defaults */
          }
        } else if (Array.isArray(m?.items) && m.items.length > 0) {
          setMilestoneItems(m.items);
        }
        if (content.hero) setHeroCms(content.hero);
        if (content.cta) setCtaCms(content.cta);
      } catch {
        /* fall back to hardcoded intro/milestones */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <>
      <Header
        translations={currentMessages}
        locale={locale}
        onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        forceLightText={true}
      />

      <main>
        {/* Hero - Full Screen Map */}
        <section className="relative h-screen bg-[#09090B] overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-[#2563EB]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/8 rounded-full blur-[100px]" />
          </div>

          {/* Map - 上移以避免被底部文字遮挡 */}
          <div className="absolute inset-0 z-10" style={{ transform: 'translateY(-10%)' }}>
            <GlobalBusinessMap locale={locale} />
          </div>

          {/* Text - 左边中间，无背景 */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Animated heading */}
              <motion.h1
                className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {heroCms.title ? (
                  <span className="text-shimmer-light">{heroCms.title}</span>
                ) : isZh ? (
                  <>
                    <span className="text-shimmer-light">好产品，</span>
                    <span className="text-shimmer-light">要让世界知道</span>
                  </>
                ) : (
                  <span className="text-shimmer-light">Great products. Global impact.</span>
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                style={{ color: 'rgba(143, 155, 175, 0.85)' }}
              >
                {heroCms.subtitle || (isZh ? "深安锂能 · 全球研发与产业布局" : "SSE · GLOBAL R&D AND INDUSTRIAL NETWORK")}
              </motion.p>

              {/* Auxiliary text */}
              <motion.p
                className="text-xs md:text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                style={{ color: 'rgba(100, 113, 135, 0.75)' }}
              >
                {heroCms.auxText || (isZh ? "固态电池技术专家" : "Solid-State Battery Expert")}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Company Introduction — the campus picture runs full-bleed and
            dissolves into the page, with the copy sitting over its faded
            lower half. The picture is used at its own 1584:672 ratio, so
            nothing is cropped at any width; a min-height keeps the band
            tall enough to hold the copy on phones. */}
        <section className="relative w-full overflow-hidden bg-white text-[#18181B]">
          <div className="relative aspect-[1584/672] min-h-[600px] w-full">
            <Image
              src="/images/about/intro-factory.jpg"
              alt={isZh ? "深安锂能厂区俯瞰" : "Swift Safe Energy manufacturing campus"}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />

            {/* Fade the picture into the page along the bottom, leaving a
                bright even surface where the copy lands. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 40%, rgba(255,255,255,0.88) 72%, #FFFFFF 100%)",
              }}
            />
            {/* Soften the top edge so the band has no hard entry. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-20"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)",
              }}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0">
            <div className="container-padding mx-auto max-w-[1280px] pb-12 md:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px w-12 bg-[#2563EB]" />
                  <span className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">
                    {isZh ? "关于我们" : "About Us"}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-[#0A0A0A] md:text-4xl">
                  {introTitle || (isZh ? "深安锂能" : "Swift Safe Energy")}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 max-w-3xl text-sm leading-relaxed text-[#52525B] md:text-base"
              >
                {(introText ?? (isZh ? CHINESE_INTRO : ENGLISH_INTRO))
                  .split('\n\n')
                  .map((paragraph) => (
                    <p key={paragraph} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Milestones Section */}
        <MilestonesSection lang={locale === 'en' ? 'en' : 'zh'} items={milestoneItems} />

        {/* CTA Section - Explore Products */}
        <section className="py-12 bg-gradient-to-b from-[#09090B] to-[#050505] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2563EB]/10 rounded-full blur-[150px]" />
          </div>

          <div className="container-padding mx-auto relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {ctaCms.title || (isZh ? "探索我们的产品" : "Explore Our Products")}
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                {ctaCms.desc || (isZh
                  ? "了解深安锂能如何通过创新电池技术改变世界"
                  : "Discover how Swift Safe Energy is transforming the world with innovative battery technology")}
              </p>
              <Link
                href="/products/cloudchi-360-p"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {ctaCms.button || (isZh ? "查看产品中心" : "View Products")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer translations={currentMessages} locale={locale} />
    </>
  );
}
