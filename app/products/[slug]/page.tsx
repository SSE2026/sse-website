"use client";

import { useState, useEffect, useRef } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";
import Link from "next/link";
import { motion } from "framer-motion";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { products, productSeries, Product } from "@/data/products";

const messages = { en, zh };

// Series configuration
const SERIES_CONFIG = [
  {
    id: "360p",
    label: { en: "Aeroride 360-P", zh: "云驰 360-P" },
    subLabel: { en: "High Energy + High Power Cell", zh: "高能量 + 高功率型电芯" },
    color: "#2563eb",
    borderColor: "#2563eb",
  },
  {
    id: "400e",
    label: { en: "Aeroride 400-E", zh: "云驰 400-E" },
    subLabel: { en: "High Energy + Long Cycle Cell", zh: "高能量 + 长循环型电芯" },
    color: "#059669",
    borderColor: "#059669",
  },
  {
    id: "460x",
    label: { en: "Aeroride 460-X", zh: "云驰 460-X" },
    subLabel: { en: "Ultra High Energy + High Rate Cell", zh: "超高能量 + 超高倍率型电芯" },
    color: "#7c3aed",
    borderColor: "#7c3aed",
  },
] as const;

export default function ProductDetailPage() {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [activeTab, setActiveTab] = useState("360p");
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentMessages = messages[locale];
  const isZh = locale === "zh";

  // Group products by series from local data
  const getProductsBySeries = (seriesId: "360p" | "400e" | "460x"): Product[] => {
    return products.filter((p) => p.series === seriesId);
  };

  // Single video - plays once on page load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 1.25;
    video.loop = false;
    video.play().catch(() => {});
  }, []);

  // Scroll spy for tabs
  useEffect(() => {
    const handleScroll = () => {
      const blocks = ["360p", "400e", "460x", "custom"];
      const scrollPos = window.scrollY + 200;

      for (const id of blocks) {
        const el = document.getElementById(`series-${id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get tab color based on active tab
  const getActiveColor = (tabId: string) => {
    const tab = SERIES_CONFIG.find((t) => t.id === tabId);
    return tab?.color || "#2563eb";
  };

  // Get product image from product data
  const getProductImage = (product: Product) => {
    return product.image || `/images/${product.series}.png`;
  };

  // Render spec row
  const renderSpecRow = (product: Product) => {
    const spec = product.spec;
    const items: { label: string; value: string }[] = [
      { label: isZh ? "标称电压：" : "Nominal Voltage: ", value: spec.voltage },
      { label: isZh ? "额定容量：" : "Capacity: ", value: spec.capacity },
      { label: isZh ? "外形尺寸：" : "Dimensions: ", value: spec.dimensions },
      { label: isZh ? "参考重量：" : "Weight: ", value: spec.weight },
    ];

    // 460-X series uses Continuous + Peak, others use Charge/Discharge
    if (product.series === "460x") {
      return (
        <div className="grid grid-cols-3 gap-2 text-sm">
          {items.map((item, idx) => (
            <p key={idx}>
              <span style={{ color: "#64748b" }}>{item.label}</span>
              <span className="font-semibold" style={{ color: "#0f172a" }}>
                {item.value}
              </span>
            </p>
          ))}
          <div className="flex flex-col">
            <p>
              <span style={{ color: "#64748b" }}>
                {isZh ? "持续放电：" : "Continuous: "}
              </span>
              <span className="font-semibold" style={{ color: "#0f172a" }}>
                {spec.continuous || "-"}
              </span>
            </p>
            <p>
              <span style={{ color: "#64748b" }}>
                {isZh ? "峰值放电：" : "Peak: "}
              </span>
              <span className="font-semibold" style={{ color: "#0f172a" }}>
                {spec.peak || "-"}
              </span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2 text-sm">
        {items.map((item, idx) => (
          <p key={idx}>
            <span style={{ color: "#64748b" }}>{item.label}</span>
            <span className="font-semibold" style={{ color: "#0f172a" }}>
              {item.value}
            </span>
          </p>
        ))}
        <p>
          <span style={{ color: "#64748b" }}>
            {isZh ? "充放电倍率：" : "Charge/Discharge: "}
          </span>
          <span className="font-semibold" style={{ color: "#0f172a" }}>
            {spec.chargeRate && spec.dischargeRate
              ? `${spec.chargeRate} / ${spec.dischargeRate}`
              : "-"}
          </span>
        </p>
        {spec.cycleLife && (
          <p>
            <span style={{ color: "#64748b" }}>
              {isZh ? "循环寿命：" : "Cycle Life: "}
            </span>
            <span className="font-semibold" style={{ color: "#0f172a" }}>
              {spec.cycleLife}
            </span>
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <ScrollProgress color={getActiveColor(activeTab)} height="sm" />
      <CursorFollower color={`${getActiveColor(activeTab)}15`} size={500} />

      <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
          forceLightText={false}
        />

        <main>
          {/* Video Hero - Full screen with video as background */}
          <section
            className="relative overflow-hidden"
            style={{ backgroundColor: "#F5F5F7", minHeight: "100vh", marginTop: "-80px", paddingTop: "80px" }}
          >
            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(24px); filter: blur(8px); }
                to { opacity: 1; transform: translateY(0); filter: blur(0); }
              }
              @keyframes shine {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .hero-title-animate {
                opacity: 0;
                animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
              }
              .gradient-text-animated {
                background: linear-gradient(110deg, #475569 0%, #64748B 15%, #94A3B8 30%, #CBD5E1 45%, #94A3B8 60%, #64748B 75%, #475569 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: shine 5s linear infinite;
              }
            `}</style>

            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.03) 100%)",
              }}
            />

            {/* Full-screen background video */}
            <video
              ref={videoRef}
              src="/videos/product-hero-new.mp4"
              muted
              playsInline
              autoPlay
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
              }}
            />

            {/* Soft overlay for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(245,245,247,0.95) 0%, rgba(245,245,247,0.7) 50%, rgba(245,245,247,0.2) 100%)",
              }}
            />

            <div
              className="relative max-w-7xl mx-auto px-6 z-10"
              style={{
                minHeight: "calc(100vh - 80px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "80px",
                paddingBottom: "60px",
              }}
            >
              <div
                className={`flex flex-col gap-8 w-full ${
                  locale === "en" ? "max-w-5xl" : "max-w-4xl"
                }`}
              >
                {/* Text Content - centered, vertical layout */}
                <div
                  className="text-center mx-auto"
                  style={{ maxWidth: "900px" }}
                >
                  <h1
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight hero-title-animate"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "#0F172A",
                    }}
                  >
                    {locale === "zh" ? (
                      <>
                        突破能量极限
                        <br />
                        <span className="gradient-text-animated">重塑电动边界</span>
                      </>
                    ) : (
                      <>
                        Breaking Energy Limits
                        <br />
                        <span className="gradient-text-animated">
                          Reshaping Electric Future
                        </span>
                      </>
                    )}
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: "#475569" }}
                  >
                    {locale === "zh"
                      ? `专为无人机、具身智能、深海探测设备打造边界动力方案`
                      : `Boundary power solutions for UAVs, embodied AI, and deep-sea exploration devices`}
                  </motion.p>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 h-24 z-20"
              style={{
                background: "linear-gradient(to bottom, transparent, #F5F5F7 100%)",
              }}
            />
          </section>

          {/* Product Series Section */}
          <section
            style={{ backgroundColor: "#f8fafc", paddingBottom: "100px" }}
          >
            {/* Sticky Nav Tabs */}
            <div
              className="sticky top-0 z-50"
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div className="max-w-[1140px] mx-auto px-6 py-4 flex justify-center items-center gap-4 md:gap-8">
                {SERIES_CONFIG.map((series) => {
                  const isActive = activeTab === series.id;
                  return (
                    <a
                      key={series.id}
                      href={`#series-${series.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(series.id);
                        const el = document.getElementById(
                          `series-${series.id}`
                        );
                        if (el) {
                          const navHeight = 72;
                          const top = el.offsetTop - navHeight - 20;
                          window.scrollTo({ top, behavior: "smooth" });
                        }
                      }}
                      className="px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 no-underline whitespace-nowrap"
                      style={{
                        color: isActive ? series.color : "#64748b",
                        backgroundColor: isActive
                          ? `${series.color}10`
                          : "transparent",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {series.label[isZh ? "zh" : "en"]}
                    </a>
                  );
                })}
                {/* Custom tab */}
                <a
                  href="#series-custom"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("custom");
                    const el = document.getElementById("series-custom");
                    if (el) {
                      const navHeight = 72;
                      const top = el.offsetTop - navHeight - 20;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                  className="px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 no-underline whitespace-nowrap"
                  style={{
                    color: activeTab === "custom" ? "#059669" : "#64748b",
                    backgroundColor:
                      activeTab === "custom" ? "#ecfdf5" : "transparent",
                    transform: activeTab === "custom" ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {locale === "zh" ? "立即定制" : "Custom Now"}
                </a>
              </div>
            </div>

            <div className="max-w-[1140px] mx-auto px-6">
              {SERIES_CONFIG.map((series) => {
                const seriesProducts = getProductsBySeries(series.id as "360p" | "400e" | "460x");

                return (
                  <div
                    key={series.id}
                    id={`series-${series.id}`}
                    className="pt-20"
                  >
                    <div
                      className="mb-6 pl-4 border-l-4"
                      style={{ borderColor: series.borderColor }}
                    >
                      <h2
                        className="text-3xl font-extrabold mb-1"
                        style={{ color: "#0f172a" }}
                      >
                        {series.label[isZh ? "zh" : "en"]}
                      </h2>
                      <p className="text-sm" style={{ color: "#64748b" }}>
                        {series.subLabel[isZh ? "zh" : "en"]}
                      </p>
                    </div>

                    {seriesProducts.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {seriesProducts.map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ y: -3 }}
                            className="bg-white rounded-xl border flex items-center p-5 gap-6"
                            style={{
                              borderColor: "#e2e8f0",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                            }}
                          >
                            {/* Product Image */}
                            <div
                              className="w-32 h-56 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                              style={{ backgroundColor: "#f8fafc" }}
                            >
                              <img
                                src={getProductImage(product)}
                                alt={product.sku}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3
                                  className="text-xl font-extrabold"
                                  style={{ color: "#0f172a" }}
                                >
                                  {product.sku}
                                </h3>
                                <span
                                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{
                                    color: series.color,
                                    backgroundColor: `${series.color}10`,
                                  }}
                                >
                                  {product.energyDensity}
                                </span>
                              </div>
                              {renderSpecRow(product)}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 w-36 flex-shrink-0">
                              <Link href="/contact">
                                <motion.button
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-full py-2.5 rounded-md text-sm font-bold border"
                                  style={{
                                    borderColor: "#2563eb",
                                    color: "#2563eb",
                                    backgroundColor: "#ffffff",
                                  }}
                                >
                                  {isZh ? "获取样品" : "Get Sample"}
                                </motion.button>
                              </Link>
                              <Link href="/contact">
                                <motion.button
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-full py-2.5 rounded-md text-sm font-bold"
                                  style={{
                                    backgroundColor: "#2563eb",
                                    color: "#ffffff",
                                  }}
                                >
                                  {isZh ? "即刻咨询" : "Inquire Now"}
                                </motion.button>
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        {isZh ? "暂无产品" : "No products available"}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Custom Block */}
              <div id="series-custom" className="pt-20">
                <div className="w-full max-w-7xl mx-auto">
                  <div
                    className="relative rounded-lg bg-[#0a0a0c] border border-neutral-800/80 p-8 md:p-10 transition-colors duration-300 hover:border-neutral-700"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-3 max-w-2xl">
                        <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-500">
                          {"// CUSTOM SPECIFICATIONS"}
                        </div>

                        <h3 className="text-xl md:text-2xl font-light text-white tracking-tight leading-snug">
                          {isZh ? "未找到合适规格？ " : "Can't find the right specs? "}
                          <span className="text-neutral-400">
                            {isZh ? "支持全栈式参数定制" : "Full Custom Solutions"}
                          </span>
                        </h3>

                        <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
                          {isZh
                            ? "提供容量、电压、尺寸及特殊倍率特性的定制化固态/半固态电池方案。"
                            : "Custom solid-state/semi-solid-state battery solutions for capacity, voltage, dimensions and special rate characteristics."}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <Link href="/contact">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              y: {
                                duration: 1.0,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                              },
                            }}
                            className="relative inline-flex items-center gap-3 px-10 py-5 rounded bg-white hover:bg-neutral-200 text-black text-sm font-mono tracking-wider uppercase font-semibold transition-all duration-200 group"
                            style={{
                              boxShadow:
                                "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)",
                            }}
                          >
                            <span>{isZh ? "立即定制" : "Custom Now"}</span>
                            <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                              ↗
                            </span>
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer translations={currentMessages} locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}
