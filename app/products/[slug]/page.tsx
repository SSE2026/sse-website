"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/animated/fade-in";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorFollower } from "@/components/ui/animations";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Check,
  Zap,
  Shield,
  Clock,
  Thermometer,
  Battery,
  Plane,
  Bot,
  Cog,
  Smartphone,
} from "lucide-react";

import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

const messages = { en, zh };

// Product data
const productsData: Record<string, {
  model: string;
  modelZh: string;
  badge: string;
  badgeEn: string;
  color: string;
  description: string;
  descriptionZh: string;
  images: string[];
  specs: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    labelEn: string;
    value: string;
  }[];
  features: { text: string; textEn: string }[];
  applications: {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    textEn: string;
  }[];
  datasheet?: string;
}> = {
  "cloudchi-360-p": {
    model: "CloudChi 360-P",
    modelZh: "云驰 360-P",
    badge: "高功率平台",
    badgeEn: "High Power Platform",
    color: "#3B82F6",
    description: "高功率平台，适用于四足机器人和多旋翼无人机等瞬时功率需求场景。独特的固态电解质技术实现快速离子传导，支持5C持续放电，峰值可达10C，为高功率应用提供澎湃动力。",
    descriptionZh: "高功率平台，适用于四足机器人和多旋翼无人机等瞬时功率需求场景。",
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
      "https://images.unsplash.com/photo-1555696952-5e6d90c66c1f?w=1200&q=80",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80",
    ],
    specs: [
      { icon: Zap, label: "能量密度", labelEn: "Energy Density", value: "360 Wh/kg" },
      { icon: Zap, label: "持续放电倍率", labelEn: "Continuous Discharge", value: "5C" },
      { icon: Zap, label: "峰值放电倍率", labelEn: "Peak Discharge", value: "10C" },
      { icon: Shield, label: "安全性", labelEn: "Safety", value: "本质安全" },
      { icon: Clock, label: "循环寿命", labelEn: "Cycle Life", value: "500+ 次" },
      { icon: Thermometer, label: "工作温度", labelEn: "Operating Temp", value: "-40°C ~ 80°C" },
    ],
    features: [
      { text: "高功率输出，支持5C持续放电和10C峰值放电", textEn: "High power output, 5C continuous and 10C peak discharge" },
      { text: "本质安全固态电解质，彻底消除热失控风险", textEn: "Intrinsically safe solid-state electrolyte, eliminates thermal runaway" },
      { text: "宽温度范围工作，适应极端环境", textEn: "Wide temperature range operation for extreme environments" },
      { text: "快速充电能力，30分钟可充至80%", textEn: "Fast charging: 80% in 30 minutes" },
      { text: "长循环寿命，500+次充放电后容量保持率>80%", textEn: "500+ cycle life with >80% capacity retention" },
    ],
    applications: [
      { icon: Cog, text: "四足机器狗", textEn: "Quadruped Robots" },
      { icon: Plane, text: "多旋翼无人机", textEn: "Multi-rotor Drones" },
      { icon: Bot, text: "人形机器人", textEn: "Humanoid Robots" },
    ],
  },
  "cloudchi-400-e": {
    model: "CloudChi 400-E",
    modelZh: "云驰 400-E",
    badge: "高能量平台",
    badgeEn: "High Energy Platform",
    color: "#10B981",
    description: "高能量平台，适用于固定翼/复合翼无人机、长航时潜航器、巡检机器人等需要长续航的应用场景。超高的能量密度大幅延长任务时间。",
    descriptionZh: "高能量平台，适用于固定翼/复合翼无人机，长航时潜航器、巡检机器人。",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1200&q=80",
    ],
    specs: [
      { icon: Zap, label: "能量密度", labelEn: "Energy Density", value: "400 Wh/kg" },
      { icon: Zap, label: "持续放电倍率", labelEn: "Continuous Discharge", value: "3C" },
      { icon: Zap, label: "峰值放电倍率", labelEn: "Peak Discharge", value: "5C" },
      { icon: Shield, label: "安全性", labelEn: "Safety", value: "本质安全" },
      { icon: Clock, label: "循环寿命", labelEn: "Cycle Life", value: "800+ 次" },
      { icon: Thermometer, label: "工作温度", labelEn: "Operating Temp", value: "-40°C ~ 80°C" },
    ],
    features: [
      { text: "超高能量密度，400 Wh/kg为行业领先水平", textEn: "Industry-leading 400 Wh/kg energy density" },
      { text: "长续航能力，延长任务时间40%以上", textEn: "40%+ longer endurance for extended missions" },
      { text: "超低自放电率，静置一年容量保持率>90%", textEn: "Ultra-low self-discharge: >90% capacity after 1 year" },
      { text: "本质安全设计，通过严苛安全测试", textEn: "Intrinsically safe design, passes rigorous safety tests" },
      { text: "800+次循环寿命，大幅降低使用成本", textEn: "800+ cycle life reduces total cost of ownership" },
    ],
    applications: [
      { icon: Plane, text: "固定翼无人机", textEn: "Fixed-wing UAVs" },
      { icon: Battery, text: "水下潜航器", textEn: "Underwater AUVs" },
      { icon: Cog, text: "巡检机器人", textEn: "Inspection Robots" },
    ],
  },
  "cloudchi-460-x": {
    model: "CloudChi 460-X",
    modelZh: "云驰 460-X",
    badge: "超高能量",
    badgeEn: "Ultra High Energy",
    color: "#8B5CF6",
    description: "超高能量平台，适用于极限续航需求或需要同时满足高能量和高功率输出的复合任务场景。突破能量密度极限，460+ Wh/kg为行业最高水平。",
    descriptionZh: "超高能量平台，适用于极限续航或10C高功率输出场景。",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
    ],
    specs: [
      { icon: Zap, label: "能量密度", labelEn: "Energy Density", value: "460+ Wh/kg" },
      { icon: Zap, label: "持续放电倍率", labelEn: "Continuous Discharge", value: "1C" },
      { icon: Zap, label: "峰值放电倍率", labelEn: "Peak Discharge", value: "10C" },
      { icon: Shield, label: "安全性", labelEn: "Safety", value: "本质安全" },
      { icon: Clock, label: "循环寿命", labelEn: "Cycle Life", value: "300+ 次" },
      { icon: Thermometer, label: "工作温度", labelEn: "Operating Temp", value: "-40°C ~ 80°C" },
    ],
    features: [
      { text: "行业最高能量密度，460+ Wh/kg突破极限", textEn: "Highest-in-industry 460+ Wh/kg energy density" },
      { text: "同时支持高能量和高功率输出", textEn: "Supports both high energy and high power output" },
      { text: "专为极端任务设计，满足特殊应用需求", textEn: "Designed for extreme missions and special applications" },
      { text: "本质安全固态技术，无燃烧爆炸风险", textEn: "Solid-state safety: no fire or explosion risk" },
      { text: "先进材料体系，确保长期性能稳定", textEn: "Advanced materials ensure long-term performance stability" },
    ],
    applications: [
      { icon: Plane, text: "长航时无人机", textEn: "Long-endurance UAVs" },
      { icon: Plane, text: "eVTOL飞行器", textEn: "eVTOL Aircraft" },
      { icon: Cog, text: "特种作业机器人", textEn: "Special Purpose Robots" },
    ],
  },
};

const defaultProduct = productsData["cloudchi-360-p"];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("360p");
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const currentMessages = messages[locale];

  // Video switch logic: 2 -> 3 -> 2 -> 3 loop
  useEffect(() => {
    const video2 = videoRef2.current;
    const video3 = videoRef3.current;
    if (!video2 || !video3) return;

    video2.playbackRate = 0.6;
    video3.playbackRate = 0.6;

    // Start with video 2
    video2.style.opacity = "1";
    video3.style.opacity = "0";
    video2.play().catch(() => console.log("video2 play failed"));

    let current = 2;

    // Check video progress every 100ms
    const checkVideo = setInterval(() => {
      if (!video2 || !video3) return;

      if (current === 2 && video2.currentTime >= video2.duration - 0.2) {
        // Switch to video 3
        current = 3;
        video2.style.opacity = "0";
        video3.style.opacity = "1";
        video3.currentTime = 0;
        video3.play().catch(() => console.log("video3 play failed"));
      } else if (current === 3 && video3.currentTime >= video3.duration - 0.2) {
        // Switch back to video 2
        current = 2;
        video3.style.opacity = "0";
        video2.style.opacity = "1";
        video2.currentTime = 0;
        video2.play().catch(() => console.log("video2 play failed"));
      }
    }, 100);

    return () => clearInterval(checkVideo);
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

  // Get product data by slug or use default
  const product = productsData[slug] || defaultProduct;

  return (
    <>
      <ScrollProgress color={product.color} height="sm" />
      <CursorFollower color={`${product.color}15`} size={500} />

      <NextIntlClientProvider messages={currentMessages as any} locale={locale}>
        <Header
          translations={currentMessages}
          locale={locale}
          onLocaleChange={(newLocale) => setLocale(newLocale as "en" | "zh")}
          forceLightText={false}
        />

        <main className="pt-20">
          {/* Video Hero - Apple/DJI Style */}
          <section className="relative overflow-hidden" style={{ backgroundColor: "#F5F5F7", minHeight: "100vh" }}>
            {/* CSS Keyframes for animations */}
            <style>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(24px);
                  filter: blur(8px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                  filter: blur(0);
                }
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
                background: linear-gradient(
                  110deg,
                  #475569 0%,
                  #64748B 15%,
                  #94A3B8 30%,
                  #CBD5E1 45%,
                  #94A3B8 60%,
                  #64748B 75%,
                  #475569 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: shine 5s linear infinite;
              }
            `}</style>

            {/* Unified subtle gradient overlay for depth */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.03) 100%)"
            }} />

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-6" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full ${locale === "en" ? "max-w-6xl" : "max-w-4xl"}`}>

                {/* Left: Text Content */}
                <div className={`text-left order-2 lg:order-1 flex-shrink-0 ${locale === "en" ? "lg:w-1/2" : "lg:w-auto"}`}>
                  {/* Main Title */}
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight hero-title-animate"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "#0F172A" }}
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
                        <span className="gradient-text-animated">Reshaping Electric Future</span>
                      </>
                    )}
                  </h1>

                  {/* Description */}
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

                {/* Right: Video Container */}
                <div className="flex justify-center items-center order-1 lg:order-2">
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: "380px",
                      aspectRatio: "9/16",
                    }}
                  >
                    {/* Video 1 */}
                    <video
                      ref={videoRef2}
                      src="/videos/product-center-1.webm"
                      muted
                      playsInline
                      loop
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 1 }}
                    />
                    {/* Video 2 */}
                    <video
                      ref={videoRef3}
                      src="/videos/product-center-2.webm"
                      muted
                      playsInline
                      loop
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16" style={{
              background: "linear-gradient(to bottom, transparent, #F5F5F7 100%)"
            }} />
          </section>

          {/* CATL Style B2B Mall Section */}
          <section style={{ backgroundColor: "#f8fafc", paddingBottom: "100px" }}>
            {/* Sticky Nav Tabs */}
            <div className="sticky top-0 z-50" style={{ backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div className="max-w-[1140px] mx-auto px-6 py-4 flex justify-center items-center gap-4 md:gap-8">
                {[
                  { id: "360p", label: locale === "zh" ? "云驰 360-P" : "Aeroride 360-P" },
                  { id: "400e", label: locale === "zh" ? "云驰 400-E" : "Aeroride 400-E" },
                  { id: "460x", label: locale === "zh" ? "云驰 460-X" : "Aeroride 460-X" },
                  { id: "custom", label: locale === "zh" ? "立即定制" : "Custom Now", custom: true },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <a
                      key={tab.id}
                      href={`#series-${tab.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(tab.id);
                        const el = document.getElementById(`series-${tab.id}`);
                        if (el) {
                          const navHeight = 72;
                          const top = el.offsetTop - navHeight - 20;
                          window.scrollTo({ top, behavior: "smooth" });
                        }
                      }}
                      className="px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 no-underline whitespace-nowrap"
                      style={{
                        color: isActive ? (tab.custom ? "#059669" : "#2563eb") : "#64748b",
                        backgroundColor: isActive ? (tab.custom ? "#ecfdf5" : "#eff6ff") : "transparent",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = tab.custom ? "#059669" : "#2563eb";
                          e.currentTarget.style.backgroundColor = tab.custom ? "#ecfdf5" : "#eff6ff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "#64748b";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {tab.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="max-w-[1140px] mx-auto px-6">

              {/* Series 360-P */}
              <div id="series-360p" className="pt-20">
                <div className="mb-6 pl-4 border-l-4" style={{ borderColor: "#2563eb" }}>
                  <h2 className="text-3xl font-extrabold mb-1" style={{ color: "#0f172a" }}>{locale === "zh" ? "云驰 360-P 系列" : "Aeroride 360-P Series"}</h2>
                  <p className="text-sm" style={{ color: "#64748b" }}>{locale === "zh" ? "高能量 + 高功率型电芯" : "High Energy + High Power Cell"}</p>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Model 1 */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl border flex items-center p-5 gap-6"
                    style={{ borderColor: "#e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-32 h-56 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
                      <img src="/images/360-p.png" alt="SSE10570163" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>SSE10570163</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: "#2563eb", backgroundColor: "#eff6ff" }}>358 Wh/kg</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "标称电压：" : "Nominal Voltage: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>3.5 V</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "额定容量：" : "Capacity: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>25 Ah</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "外形尺寸：" : "Dimensions: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>10.5×70×163 mm</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "参考重量：" : "Weight: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>244 g</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "充放电倍率：" : "Charge/Discharge: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>2C / 5C</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "循环寿命：" : "Cycle Life: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>1000+ (0.5C/1C)</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-36 flex-shrink-0">
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold border"
                          style={{ borderColor: "#2563eb", color: "#2563eb", backgroundColor: "#ffffff" }}
                        >
                          {locale === "zh" ? "获取样品" : "Get Sample"}
                        </motion.button>
                      </Link>
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold"
                          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        >
                          {locale === "zh" ? "即刻咨询" : "Inquire Now"}
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                  {/* Model 2 */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl border flex items-center p-5 gap-6"
                    style={{ borderColor: "#e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-32 h-56 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
                      <img src="/images/360-p.png" alt="SSE10014315" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>SSE10014315</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: "#2563eb", backgroundColor: "#eff6ff" }}>356 Wh/kg</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "标称电压：" : "Nominal Voltage: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>3.5 V</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "额定容量：" : "Capacity: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>44 Ah</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "外形尺寸：" : "Dimensions: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>10.0×143×154 mm</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "参考重量：" : "Weight: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>433 g</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "充放电倍率：" : "Charge/Discharge: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>2C / 5C</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "循环寿命：" : "Cycle Life: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>1000+ (0.5C/1C)</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-36 flex-shrink-0">
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold border"
                          style={{ borderColor: "#2563eb", color: "#2563eb", backgroundColor: "#ffffff" }}
                        >
                          {locale === "zh" ? "获取样品" : "Get Sample"}
                        </motion.button>
                      </Link>
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold"
                          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        >
                          {locale === "zh" ? "即刻咨询" : "Inquire Now"}
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Series 400-E */}
              <div id="series-400e" className="pt-20">
                <div className="mb-6 pl-4 border-l-4" style={{ borderColor: "#059669" }}>
                  <h2 className="text-3xl font-extrabold mb-1" style={{ color: "#0f172a" }}>{locale === "zh" ? "云驰 400-E 系列" : "Aeroride 400-E Series"}</h2>
                  <p className="text-sm" style={{ color: "#64748b" }}>{locale === "zh" ? "高能量 + 长循环型电芯" : "High Energy + Long Cycle Cell"}</p>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Model 1 */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl border flex items-center p-5 gap-6"
                    style={{ borderColor: "#e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-32 h-56 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
                      <img src="/images/400-E.png" alt="SSE10588187" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>SSE10588187</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: "#059669", backgroundColor: "#ecfdf5" }}>391 Wh/kg</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "标称电压：" : "Nominal Voltage: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>3.5 V</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "额定容量：" : "Capacity: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>41 Ah</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "外形尺寸：" : "Dimensions: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>10.5×88×187 mm</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "参考重量：" : "Weight: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>367 g</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "充放电倍率：" : "Charge/Discharge: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>1C / 3C</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-36 flex-shrink-0">
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold border"
                          style={{ borderColor: "#2563eb", color: "#2563eb", backgroundColor: "#ffffff" }}
                        >
                          {locale === "zh" ? "获取样品" : "Get Sample"}
                        </motion.button>
                      </Link>
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold"
                          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        >
                          {locale === "zh" ? "即刻咨询" : "Inquire Now"}
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                  {/* Model 2 */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl border flex items-center p-5 gap-6"
                    style={{ borderColor: "#e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-32 h-56 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
                      <img src="/images/400-E.png" alt="SSE855897" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>SSE855897</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: "#059669", backgroundColor: "#ecfdf5" }}>368 Wh/kg</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "标称电压：" : "Nominal Voltage: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>3.7 V</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "额定容量：" : "Capacity: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>25 Ah</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "外形尺寸：" : "Dimensions: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>8.5×58×97 mm</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "参考重量：" : "Weight: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>95 g</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "充放电倍率：" : "Charge/Discharge: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>1C / 3C</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-36 flex-shrink-0">
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold border"
                          style={{ borderColor: "#2563eb", color: "#2563eb", backgroundColor: "#ffffff" }}
                        >
                          {locale === "zh" ? "获取样品" : "Get Sample"}
                        </motion.button>
                      </Link>
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold"
                          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        >
                          {locale === "zh" ? "即刻咨询" : "Inquire Now"}
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Series 460-X */}
              <div id="series-460x" className="pt-20">
                <div className="mb-6 pl-4 border-l-4" style={{ borderColor: "#7c3aed" }}>
                  <h2 className="text-3xl font-extrabold mb-1" style={{ color: "#0f172a" }}>{locale === "zh" ? "云驰 460-X 系列" : "Aeroride 460-X Series"}</h2>
                  <p className="text-sm" style={{ color: "#64748b" }}>{locale === "zh" ? "超高能量 + 超高倍率型电芯" : "Ultra High Energy + High Rate Cell"}</p>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Model 1 */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl border flex items-center p-5 gap-6"
                    style={{ borderColor: "#e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-32 h-56 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
                      <img src="/images/400-X.png" alt="SSE8088187" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>SSE8088187</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: "#7c3aed", backgroundColor: "#f5f3ff" }}>460 Wh/kg</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "标称电压：" : "Nominal Voltage: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>3.8 V</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "额定容量：" : "Capacity: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>39 Ah</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "外形尺寸：" : "Dimensions: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>8.0×88×187 mm</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "参考重量：" : "Weight: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>332 g</span></p>
                        <div className="flex flex-col">
                          <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "持续放电：" : "Continuous: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>8C</span></p>
                          <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "峰值放电：" : "Peak: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>10C</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-36 flex-shrink-0">
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold border"
                          style={{ borderColor: "#2563eb", color: "#2563eb", backgroundColor: "#ffffff" }}
                        >
                          {locale === "zh" ? "获取样品" : "Get Sample"}
                        </motion.button>
                      </Link>
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold"
                          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        >
                          {locale === "zh" ? "即刻咨询" : "Inquire Now"}
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                  {/* Model 2 */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl border flex items-center p-5 gap-6"
                    style={{ borderColor: "#e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-32 h-56 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
                      <img src="/images/400-X.png" alt="SSE5556100" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>SSE5556100</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: "#7c3aed", backgroundColor: "#f5f3ff" }}>453 Wh/kg</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "标称电压：" : "Nominal Voltage: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>3.8 V</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "额定容量：" : "Capacity: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>11.5 Ah</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "外形尺寸：" : "Dimensions: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>5.5×56×100 mm</span></p>
                        <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "参考重量：" : "Weight: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>100 g</span></p>
                        <div className="flex flex-col">
                          <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "持续放电：" : "Continuous: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>10C</span></p>
                          <p><span style={{ color: "#64748b" }}>{locale === "zh" ? "峰值放电：" : "Peak: "}</span><span className="font-semibold" style={{ color: "#0f172a" }}>12C</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-36 flex-shrink-0">
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold border"
                          style={{ borderColor: "#2563eb", color: "#2563eb", backgroundColor: "#ffffff" }}
                        >
                          {locale === "zh" ? "获取样品" : "Get Sample"}
                        </motion.button>
                      </Link>
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="w-full py-2.5 rounded-md text-sm font-bold"
                          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                        >
                          {locale === "zh" ? "即刻咨询" : "Inquire Now"}
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Custom Block - Minimal Style */}
              <div id="series-custom" className="pt-20">
                <div className="w-full max-w-7xl mx-auto">
                  {/* 极简 1px 细线框 + 纯暗色背景 + 极平缓的 Hover 质感 */}
                  <div className="relative rounded-lg bg-[#0a0a0c] border border-neutral-800/80 p-8 md:p-10 transition-colors duration-300 hover:border-neutral-700">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

                      {/* 左侧：排版为主，字号对比与极致留白 */}
                      <div className="space-y-3 max-w-2xl">
                        {/* 顶部分类：等宽英文微字，冷峻低调 */}
                        <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-500">
                          {"// CUSTOM SPECIFICATIONS"}
                        </div>

                        {/* 主标题：纯白 + 暗灰字对比，无彩色渐变 */}
                        <h3 className="text-xl md:text-2xl font-light text-white tracking-tight leading-snug">
                          {locale === "zh" ? "未找到合适规格？ " : "Can't find the right specs? "}
                          <span className="text-neutral-400">{locale === "zh" ? "支持全栈式参数定制" : "Full Custom Solutions"}</span>
                        </h3>

                        {/* 副标题：低对比度冷灰色 */}
                        <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
                          {locale === "zh"
                            ? "提供容量、电压、尺寸及特殊倍率特性的定制化固态/半固态电池方案。"
                            : "Custom solid-state/semi-solid-state battery solutions for capacity, voltage, dimensions and special rate characteristics."}
                        </p>
                      </div>

                      {/* 右侧：纯白黑字高反差按钮 + 45° 极简斜箭头 */}
                      <div className="flex-shrink-0">
                        <Link href="/contact">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={{
                              y: [0, -8, 0],
                            }}
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
                              boxShadow: "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)",
                            }}
                          >
                            <span>{locale === "zh" ? "立即定制" : "Custom Now"}</span>
                            <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
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
