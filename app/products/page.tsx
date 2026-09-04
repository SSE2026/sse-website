"use client";

import { useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/animated/fade-in";
import { ScaleIn } from "@/components/animated/scale-in";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";
import Image from "next/image";
import { ArrowRight, Battery, Zap, Shield, Clock, Cpu, Cylinder, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCmsContent } from "@/lib/cms/use-cms";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

// 前端固定展示的系列元数据（图标/主题色/徽章）来自设计稿，数据来自后端
const seriesMeta = [
  {
    key: "power",
    slug: "cloudchi-360-p",
    badge: "高功率平台",
    badgeEn: "High Power",
    color: "#2F80FF",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
  },
  {
    key: "storage",
    slug: "cloudchi-400-e",
    badge: "高能量平台",
    badgeEn: "High Energy",
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    key: "drone",
    slug: "cloudchi-460-x",
    badge: "超高能量",
    badgeEn: "Ultra High Energy",
    color: "#A855F7",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
  },
];

// 后端 variant 数据结构（来自 /v1/products/:slug）
interface Variant {
  sku: string;
  nominalVoltage?: number | null;
  nominalCapacity?: number | null;
  energy?: number | null;
  energyDensity?: number | null;
  weight?: number | null;
  specifications?: Record<string, unknown> | null;
}

interface ProductDetail {
  id: string;
  sku: string;
  model: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  energyDensity?: number | null;
  nominalVoltage?: number | null;
  nominalCapacity?: number | null;
  weight?: number | null;
  variants?: Variant[];
}

const comparisonData = [
  { feature: "能量密度 / Energy Density", liion: "250 Wh/kg", ss: "500+ Wh/kg" },
  { feature: "安全性 / Safety", liion: "有热失控风险", ss: "本质安全" },
  { feature: "循环寿命 / Cycle Life", liion: "500-1000次", ss: "800+次" },
  { feature: "充电时间 / Charge Time", liion: "30-60分钟", ss: "10-15分钟" },
  { feature: "工作温度 / Operating Temp", liion: "-20°C~50°C", ss: "-40°C~80°C" },
];

function fmt(v: number | null | undefined, unit: string) {
  if (v === null || v === undefined) return "—";
  return `${v} ${unit}`;
}

export default function ProductsPage() {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const currentMessages = messages[locale];

  const cms = useCmsContent("products", locale) as {
    hero?: { badge?: string; title?: string; subtitle?: string };
    series?: { seriesJson?: string; items?: Array<{ key: string; title?: string; desc?: string; badge?: string; badgeEn?: string; image?: string }> };
    comparison?: { eyebrow?: string; title?: string; rowsJson?: string; rows?: Array<{ feature: string; liion: string; ss: string }> };
    cta?: { title?: string; desc?: string; button?: string };
  };
  const heroCms = cms.hero ?? {};

  // Series copy overrides from CMS (keyed by series key: power/storage/drone)
  const seriesCms = useMemo(() => {
    const raw = cms.series?.seriesJson;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const map: Record<string, { title?: string; desc?: string; badge?: string; badgeEn?: string; image?: string }> = {};
          parsed.forEach((s) => { if (s?.key) map[s.key] = s; });
          return map;
        }
      } catch { /* ignore */ }
    }
    if (Array.isArray(cms.series?.items)) {
      const map: Record<string, { title?: string; desc?: string; badge?: string; badgeEn?: string; image?: string }> = {};
      cms.series.items.forEach((s) => { if (s?.key) map[s.key] = s; });
      return map;
    }
    return {};
  }, [cms.series]);

  // Comparison table rows (CMS JSON overrides the hardcoded default)
  const comparisonRows = useMemo<typeof comparisonData>(() => {
    const raw = cms.comparison?.rowsJson;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as typeof comparisonData;
        }
      } catch { /* fall through */ }
    }
    if (Array.isArray(cms.comparison?.rows) && cms.comparison.rows.length > 0) {
      return cms.comparison.rows as typeof comparisonData;
    }
    return comparisonData;
  }, [cms.comparison]);
  const comparisonCms = cms.comparison ?? {};
  const ctaCms = cms.cta ?? {};

  const [seriesData, setSeriesData] = useState<Record<string, ProductDetail | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从后端加载 3 个系列详情（含 6 个 SKU variants）
  useEffect(() => {
    const ctl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          seriesMeta.map(async (s) => {
            const res = await fetch(`/api/products/${s.slug}?locale=${locale}`, {
              signal: ctl.signal,
            });
            if (!res.ok) return null;
            const json = await res.json();
            // 代理 /api/products/[slug] 返回 {success, data:{success, data:product}}
            const body = (json?.data?.data ?? json?.data ?? json) as ProductDetail;
            return body || null;
          }),
        );
        const map: Record<string, ProductDetail | null> = {};
        seriesMeta.forEach((s, i) => {
          map[s.slug] = results[i] ?? null;
        });
        setSeriesData(map);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctl.abort();
  }, [locale]);

  return (
    <>
      <ScrollProgress color="accent" height="sm" />
      <CursorFollower color="rgba(47, 128, 255, 0.08)" size={500} />

      <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
        />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="section-padding bg-primary relative overflow-hidden">
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute inset-0 grid-pattern-strong opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[150px]" />

            <div className="container-padding mx-auto relative">
              <FadeIn className="text-center max-w-4xl mx-auto">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6"
                >
                  <Battery className="w-4 h-4 text-accent" />
                  {heroCms.badge || (locale === "zh" ? "产品中心" : "Products")}
                </motion.span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
                  {heroCms.title || (locale === "zh" ? "云驰系列" : "Aeroride Series")}
                </h1>
                <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
                  {heroCms.subtitle || (locale === "zh"
                    ? "以任务属性定义产品，为边界场景提供差异化动力方案。覆盖无人机、具身智能、水下机器人等多领域应用。"
                    : "Mission-defined products for demanding boundary applications. Covering UAVs, embodied AI, underwater robots and more.")}
                </p>
              </FadeIn>
            </div>
          </section>

          {/* Products Grid */}
          <section className="section-padding bg-secondary/[0.02]">
            <div className="container-padding mx-auto">
              {loading && (
                <div className="flex items-center justify-center py-24 text-white/60">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  {locale === "zh" ? "加载中…" : "Loading…"}
                </div>
              )}

              {error && !loading && (
                <div className="flex items-center justify-center gap-2 py-24 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="space-y-16 md:space-y-24">
                {!loading && !error && seriesMeta.map((meta, index) => {
                  const detail = seriesData[meta.slug];
                  const isEven = index % 2 === 0;
                  const name = detail?.name || (locale === "zh" ? `云驰 ${meta.key}` : `Aeroride ${meta.key}`);
                  const variants = detail?.variants || [];
                  const seriesCopy = seriesCms[meta.key] ?? {};
                  const headline =
                    seriesCopy.title ||
                    (currentMessages.products as Record<string, { title?: string; desc?: string }>)?.[meta.key]?.title ||
                    name;
                  const desc =
                    seriesCopy.desc ||
                    detail?.shortDescription ||
                    (currentMessages.products as Record<string, { title?: string; desc?: string }>)?.[meta.key]?.desc;

                  // 系列级规格（从后端或第一个 variant 推断）
                  const seriesEnergyDensity = detail?.energyDensity ?? variants[0]?.energyDensity ?? null;
                  const seriesCapacity = detail?.nominalCapacity ?? variants[0]?.nominalCapacity ?? null;

                  const seriesSpecs = [
                    { icon: Zap, label: "能量密度", value: fmt(seriesEnergyDensity, "Wh/kg"), en: "Energy Density" },
                    { icon: Cpu, label: "容量", value: fmt(seriesCapacity, "Ah"), en: "Capacity" },
                    { icon: Shield, label: "安全性", value: "本质安全", en: "Safety" },
                    { icon: Clock, label: "SKU 规格", value: `${variants.length} 款`, en: "Configs" },
                  ];

                  return (
                    <FadeIn key={meta.slug}>
                      <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-start ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                        {/* Image */}
                        <div className={`relative ${isEven ? '' : 'lg:order-2'}`}>
                          <ScaleIn>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="relative aspect-[4/3] rounded-3xl overflow-hidden"
                            >
                              <Image
                                src={seriesCopy.image || meta.image}
                                alt={name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

                              {/* Badge */}
                              <div
                                className="absolute top-4 left-4 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
                                style={{ backgroundColor: `${meta.color}20` }}
                              >
                                <span className="text-sm font-medium" style={{ color: meta.color }}>
                                  {locale === "zh" ? (seriesCopy.badge || meta.badge) : (seriesCopy.badgeEn || meta.badgeEn)}
                                </span>
                              </div>

                              {/* Model */}
                              <div className="absolute bottom-4 left-4">
                                <h3 className="text-2xl font-heading font-bold text-white">
                                  {name}
                                </h3>
                              </div>
                            </motion.div>
                          </ScaleIn>
                        </div>

                        {/* Content */}
                        <div className={isEven ? '' : 'lg:order-1'}>
                          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                            {headline}
                          </h2>
                          <p className="text-lg text-white/60 mb-8">{desc}</p>

                          {/* Series Specs Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            {seriesSpecs.map((spec, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 rounded-xl bg-white/[0.03] border border-white/5"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <spec.icon className="w-4 h-4" style={{ color: meta.color }} />
                                  <span className="text-xs text-white/50">{spec.en}</span>
                                </div>
                                <p className="text-lg font-heading font-semibold text-white">{spec.value}</p>
                              </motion.div>
                            ))}
                          </div>

                          {/* SKU 规格表（每系列 2 款） */}
                          {variants.length > 0 && (
                            <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                                <span className="text-xs uppercase tracking-wider text-white/40">
                                  {locale === "zh" ? "电芯规格" : "Cell Configurations"}
                                </span>
                                <span className="text-xs text-white/40">{variants.length} SKU</span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-white/5 text-white/40 text-xs">
                                      <th className="text-left p-3 font-medium">SKU</th>
                                      <th className="p-3 text-right font-medium">{locale === "zh" ? "能量密度" : "Energy"}</th>
                                      <th className="p-3 text-right font-medium">{locale === "zh" ? "容量" : "Capacity"}</th>
                                      <th className="p-3 text-right font-medium">{locale === "zh" ? "重量" : "Weight"}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {variants.map((v) => (
                                      <tr key={v.sku} className="border-b border-white/5 last:border-0">
                                        <td className="p-3 text-white font-mono text-xs">{v.sku}</td>
                                        <td className="p-3 text-right text-white">{fmt(v.energyDensity, "Wh/kg")}</td>
                                        <td className="p-3 text-right text-white">{fmt(v.nominalCapacity, "Ah")}</td>
                                        <td className="p-3 text-right text-white/70">{fmt(v.weight, "g")}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          <Link href={`/${locale}/contact`}>
                            <Button className="group" style={{ backgroundColor: meta.color }}>
                              {locale === "zh" ? "了解更多" : "Learn More"}
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="section-padding bg-primary">
            <div className="container-padding mx-auto">
              <FadeIn className="text-center max-w-2xl mx-auto mb-12">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-4 tracking-wider uppercase">
                  <Cylinder className="w-4 h-4" />
                  {comparisonCms.eyebrow || (locale === "zh" ? "技术对比" : "Comparison")}
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                  {comparisonCms.title || (locale === "zh" ? "为什么选择固态电池？" : "Why Solid-State?")}
                </h2>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-2xl overflow-hidden glass-card">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/50 font-medium">
                          {locale === "zh" ? "特性" : "Feature"}
                        </th>
                        <th className="text-center p-4 text-white/60 font-medium">
                          {locale === "zh" ? "液态锂电池" : "Liquid Li-ion"}
                        </th>
                        <th className="text-center p-4 text-white font-medium" style={{ backgroundColor: "rgba(47, 128, 255, 0.1)" }}>
                          {locale === "zh" ? "固态电池" : "Solid-State"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="p-4 text-white">{row.feature}</td>
                          <td className="p-4 text-center text-white/60">{row.liion}</td>
                          <td className="p-4 text-center text-accent font-medium" style={{ backgroundColor: "rgba(47, 128, 255, 0.05)" }}>{row.ss}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 bg-gradient-to-br from-accent/10 via-primary to-cyan/10 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px]" />

            <div className="container-padding mx-auto relative text-center">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                  {ctaCms.title || (locale === "zh" ? "需要定制解决方案？" : "Need a Custom Solution?")}
                </h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  {ctaCms.desc || (locale === "zh"
                    ? "我们的工程团队可以根据您的具体需求提供定制化的固态电池解决方案。"
                    : "Our engineering team can provide customized solid-state battery solutions based on your requirements.")}
                </p>
                <Link href={`/${locale}/contact`}>
                  <Button size="lg" className="group">
                    {ctaCms.button || (locale === "zh" ? "联系我们" : "Contact Us")}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </FadeIn>
            </div>
          </section>
        </main>

        <Footer translations={currentMessages} locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}
