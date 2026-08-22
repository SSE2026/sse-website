"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

// Types - matching backend API response
interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  nominalVoltage?: number;
  nominalCapacity?: number;
  energyDensity?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  cycleLife?: number;
}

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  sku: string;
  model: string;
  slug: string;
  categoryId?: string;
  shortDescription?: string;
  description?: string;
  energyDensity?: number;
  dischargeRate?: number;
  peakDischargeRate?: number;
  cycleLife?: number;
  operatingTempMin?: number;
  operatingTempMax?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  nominalVoltage?: number;
  nominalCapacity?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  published: boolean;
}

interface ProductsResponse {
  items: Product[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// Series configuration
const SERIES_CONFIG = [
  {
    id: "360p",
    slug: "cloudchi-360-p",
    label: { en: "Aeroride 360-P", zh: "云驰 360-P" },
    subLabel: { en: "High Energy + High Power Cell", zh: "高能量 + 高功率型电芯" },
    color: "#2563eb",
    borderColor: "#2563eb",
  },
  {
    id: "400e",
    slug: "cloudchi-400-e",
    label: { en: "Aeroride 400-E", zh: "云驰 400-E" },
    subLabel: { en: "High Energy + Long Cycle Cell", zh: "高能量 + 长循环型电芯" },
    color: "#059669",
    borderColor: "#059669",
  },
  {
    id: "460x",
    slug: "cloudchi-460-x",
    label: { en: "Aeroride 460-X", zh: "云驰 460-X" },
    subLabel: { en: "Ultra High Energy + High Rate Cell", zh: "超高能量 + 超高倍率型电芯" },
    color: "#7c3aed",
    borderColor: "#7c3aed",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [activeTab, setActiveTab] = useState("360p");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentMessages = messages[locale];
  const isZh = locale === "zh";

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const targetLocale = locale === "zh" ? "zh-CN" : "en";
      const response = await fetch(
        `/api/products?locale=${targetLocale}&limit=100`,
        { next: { revalidate: 60 } }
      );
      const data: ProductsResponse = await response.json();

      if (data.items) {
        // Filter published products only
        setProducts(data.items.filter((p) => p.published));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Video autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.6;
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

  // Group products by series
  const getProductsBySeries = (seriesId: string) => {
    // Map series ID to potential model patterns
    const patterns: Record<string, RegExp> = {
      "360p": /360/i,
      "400e": /400/i,
      "460x": /460/i,
    };

    const pattern = patterns[seriesId];
    if (!pattern) return [];

    // Also check category/slug
    return products.filter((p) => {
      const modelMatch = pattern.test(p.model || "");
      const slugMatch = pattern.test(p.slug || "");
      return modelMatch || slugMatch;
    });
  };

  // Get primary image for product
  const getProductImage = (product: Product) => {
    return product.images?.[0]?.url || `/images/${slug}.png`;
  };

  // Format spec value
  const formatSpec = (value: number | undefined, unit: string) => {
    if (value === undefined || value === null) return "-";
    return `${value} ${unit}`;
  };

  // Get tab color based on active tab
  const getActiveColor = (tabId: string) => {
    const tab = SERIES_CONFIG.find((t) => t.id === tabId);
    return tab?.color || "#2563eb";
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

        <main className="pt-20">
          {/* Video Hero */}
          <section
            className="relative overflow-hidden"
            style={{ backgroundColor: "#F5F5F7", minHeight: "100vh" }}
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

            <div
              className="max-w-7xl mx-auto px-6"
              style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full ${
                  locale === "en" ? "max-w-6xl" : "max-w-4xl"
                }`}
              >
                {/* Text Content */}
                <div
                  className={`text-left order-2 lg:order-1 flex-shrink-0 ${
                    locale === "en" ? "lg:w-1/2" : "lg:w-auto"
                  }`}
                >
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight hero-title-animate"
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
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: "#64748b" }}
                  >
                    {locale === "zh"
                      ? `专为无人机、具身智能、深海探测设备打造边界动力方案`
                      : `Boundary power solutions for UAVs, embodied AI, and deep-sea exploration devices`}
                  </motion.p>
                </div>

                {/* Video Container */}
                <div className="flex justify-center items-center order-1 lg:order-2">
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: "380px",
                      aspectRatio: "9/16",
                    }}
                  >
                    <video
                      ref={videoRef}
                      src="/videos/product-carousel.mp4"
                      muted
                      playsInline
                      loop
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 h-16"
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
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
                </div>
              ) : (
                SERIES_CONFIG.map((series) => {
                  const seriesProducts = getProductsBySeries(series.id);

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
                                  alt={product.model}
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
                                    {product.sku || product.model}
                                  </h3>
                                  {product.energyDensity && (
                                    <span
                                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                                      style={{
                                        color: series.color,
                                        backgroundColor: `${series.color}10`,
                                      }}
                                    >
                                      {product.energyDensity} Wh/kg
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                  <p>
                                    <span style={{ color: "#64748b" }}>
                                      {isZh ? "标称电压：" : "Nominal Voltage: "}
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#0f172a" }}
                                    >
                                      {formatSpec(product.nominalVoltage, "V")}
                                    </span>
                                  </p>
                                  <p>
                                    <span style={{ color: "#64748b" }}>
                                      {isZh ? "额定容量：" : "Capacity: "}
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#0f172a" }}
                                    >
                                      {formatSpec(product.nominalCapacity, "Ah")}
                                    </span>
                                  </p>
                                  <p>
                                    <span style={{ color: "#64748b" }}>
                                      {isZh ? "外形尺寸：" : "Dimensions: "}
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#0f172a" }}
                                    >
                                      {product.length && product.width && product.height
                                        ? `${product.length}×${product.width}×${product.height} mm`
                                        : "-"}
                                    </span>
                                  </p>
                                  <p>
                                    <span style={{ color: "#64748b" }}>
                                      {isZh ? "参考重量：" : "Weight: "}
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#0f172a" }}
                                    >
                                      {product.weight
                                        ? `${(product.weight * 1000).toFixed(0)} g`
                                        : "-"}
                                    </span>
                                  </p>
                                  <p>
                                    <span style={{ color: "#64748b" }}>
                                      {isZh ? "充放电倍率：" : "Charge/Discharge: "}
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#0f172a" }}
                                    >
                                      {product.dischargeRate
                                        ? `1C / ${product.dischargeRate}C`
                                        : "-"}
                                    </span>
                                  </p>
                                  <p>
                                    <span style={{ color: "#64748b" }}>
                                      {isZh ? "循环寿命：" : "Cycle Life: "}
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: "#0f172a" }}
                                    >
                                      {product.cycleLife
                                        ? `${product.cycleLife}+`
                                        : "-"}
                                    </span>
                                  </p>
                                </div>
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
                })
              )}

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
