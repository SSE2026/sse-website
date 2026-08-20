"use client";

import { useEffect, useRef, useState } from "react";

interface ContactMapProps {
  locale: "en" | "zh";
}

// 高德地图 API Key
const AMAP_KEY = "08ab8745d0b04c1cb10666fdec0a4052";

export default function ContactMap({ locale }: ContactMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const prevLocaleRef = useRef<string>(locale);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 公司坐标（深圳市坪山区坑梓街道沙田社区坪山大道6352号2栋厂房210）
  const COMPANY_LNG = 114.402008;
  const COMPANY_LAT = 22.760216;

  // 公司名称（中英文）
  const COMPANY_NAME = locale === "zh"
    ? "深安锂能（深圳）科技有限公司"
    : "Swift Safe Energy Tech Co., Ltd.";

  // 加载高德地图 SDK
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).AMap) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError("地图加载失败，请检查网络连接");
    document.head.appendChild(script);
  }, []);

  // 初始化/更新地图
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const AMap = (window as any).AMap;
    if (!AMap) return;

    const isFirstInit = !mapRef.current;

    // 如果不是首次初始化且语言未变化，跳过
    if (!isFirstInit && prevLocaleRef.current === locale) return;

    // 销毁旧地图（如果不是首次初始化）
    if (mapRef.current) {
      mapRef.current.destroy();
    }

    // 创建新地图实例
    try {
      const map = new AMap.Map(containerRef.current, {
        zoom: 16,
        center: [COMPANY_LNG, COMPANY_LAT],
        scrollWheel: false,
        mapStyle: "amap://styles/darkblue",
        lang: locale === "zh" ? "zh_cn" : "en",
      });

      // 添加公司标记
      const marker = new AMap.Marker({
        position: [COMPANY_LNG, COMPANY_LAT],
        title: COMPANY_NAME,
        label: {
          content: `<div style="
            background: #1e293b;
            color: #38bdf8;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 1px solid #334155;
          ">${COMPANY_NAME}</div>`,
          direction: "top",
          offset: [0, -10],
        },
      });
      map.add(marker);

      // 添加工具栏
      AMap.plugin(["AMap.ToolBar"], function () {
        const toolbar = new AMap.ToolBar({
          position: "RB",
          liteStyle: true,
        });
        map.addControl(toolbar);
      });

      mapRef.current = map;
      prevLocaleRef.current = locale;
    } catch (e) {
      console.error("地图初始化失败:", e);
    }
  }, [isLoaded, locale]);

  if (error) {
    return (
      <div className="w-full h-[460px] flex items-center justify-center bg-[#1e293b] rounded-xl">
        <p className="text-white/50 text-sm">{error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[460px] flex items-center justify-center bg-[#1e293b] rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/50 text-sm">
            {locale === "zh" ? "地图加载中..." : "Loading map..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full" id="contact-map-container" />
      <div className="absolute bottom-3 left-3 bg-[#0f172a]/85 backdrop-blur-sm text-[#94a3b8] px-3 py-1.5 rounded text-xs z-10">
        {locale === "zh" ? "使用右下角 +/- 按键控制缩放" : "Use +/- buttons to zoom"}
      </div>
    </div>
  );
}
