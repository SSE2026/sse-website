"use client";

import React, { useEffect, useState, useCallback, useId } from "react";

interface EChartsBusinessMapProps {
  locale?: "en" | "zh";
}

export function EChartsBusinessMap({ locale = "zh" }: EChartsBusinessMapProps) {
  // Use React's useId() for stable IDs between server and client
  const generatedId = useId();
  const containerId = `echarts-${generatedId.replace(/:/g, '')}`;
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initChart = useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.log("[Map] Container not found:", containerId);
      return false;
    }

    // Check if already initialized
    if (container.querySelector("canvas")) {
      return true;
    }

    try {
      // Load ECharts if needed
      if (!window.echarts) {
        console.log("[Map] Loading ECharts...");
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js";
        script.async = true;
        script.onload = () => {
          console.log("[Map] ECharts loaded, creating chart...");
          createChartInstance();
        };
        script.onerror = () => setError("Failed to load ECharts");
        document.body.appendChild(script);
      } else {
        createChartInstance();
      }

      function createChartInstance() {
        const c = document.getElementById(containerId);
        if (!c || !window.echarts) return;

        console.log("[Map] Creating chart...");
        const chart = window.echarts.init(c);
        const isZh = locale === "zh";

        const option = {
          backgroundColor: "#FFFFFF",
          title: {
            text: isZh ? "全球业务布局" : "Global Business Network",
            left: "center",
            top: 10,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "18%",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            min: 60,
            max: 140,
            show: false,
          },
          yAxis: {
            type: "value",
            min: 15,
            max: 55,
            show: false,
          },
          series: [
            // HQ Node - Shenzhen
            {
              type: "effectScatter",
              coordinateSystem: "grid",
              data: [{ value: [114.07, 22.54], name: isZh ? "深圳总部" : "Shenzhen HQ" }],
              symbolSize: 40,
              showEffectOn: "render",
              rippleEffect: { brushType: "stroke", scale: 4, period: 3 },
              itemStyle: {
                color: {
                  type: "radial",
                  colorStops: [
                    { offset: 0, color: "#93C5FD" },
                    { offset: 0.5, color: "#3B82F6" },
                    { offset: 1, color: "#2563EB" },
                  ],
                },
              },
              label: {
                show: true,
                formatter: "{b}",
                position: "bottom",
                backgroundColor: "white",
                borderColor: "#3B82F6",
                borderWidth: 1,
                borderRadius: 4,
                padding: [6, 10],
              },
            },
            // BC Nodes
            {
              type: "effectScatter",
              coordinateSystem: "grid",
              data: [
                { value: [121.47, 31.23], name: isZh ? "上海业务中心" : "Shanghai BC" },
                { value: [113.26, 23.13], name: isZh ? "广州业务中心" : "Guangzhou BC" },
              ],
              symbolSize: 28,
              showEffectOn: "render",
              rippleEffect: { brushType: "stroke", scale: 3, period: 4 },
              itemStyle: { color: "#60A5FA" },
              label: {
                show: true,
                formatter: "{b}",
                position: "bottom",
                backgroundColor: "white",
                borderColor: "#60A5FA",
                borderWidth: 1,
                borderRadius: 4,
                padding: [4, 8],
              },
            },
            // TB Node
            {
              type: "effectScatter",
              coordinateSystem: "grid",
              data: [{ value: [120.58, 29.99], name: isZh ? "绍兴智造基地" : "Shaoxing TB" }],
              symbolSize: 22,
              showEffectOn: "render",
              rippleEffect: { brushType: "stroke", scale: 3, period: 4 },
              itemStyle: { color: "#93C5FD" },
              label: {
                show: true,
                formatter: "{b}",
                position: "bottom",
                backgroundColor: "white",
                borderColor: "#93C5FD",
                borderWidth: 1,
                borderRadius: 4,
                padding: [4, 8],
              },
            },
            // Domestic targets
            {
              type: "effectScatter",
              coordinateSystem: "grid",
              data: [
                { value: [116.46, 39.92], name: "北京" },
                { value: [104.06, 30.67], name: "成都" },
                { value: [108.95, 34.27], name: "西安" },
                { value: [114.31, 30.52], name: "武汉" },
              ],
              symbolSize: 14,
              itemStyle: { color: "#F97316" },
              label: { show: true, formatter: "{b}", position: "right" },
            },
            // Overseas targets
            {
              type: "effectScatter",
              coordinateSystem: "grid",
              data: [
                { value: [55.27, 25.2], name: "Dubai" },
                { value: [-0.13, 51.51], name: "London" },
                { value: [8.68, 50.11], name: "Frankfurt" },
                { value: [-74, 40.71], name: "New York" },
                { value: [-118.24, 34.05], name: "Los Angeles" },
              ],
              symbolSize: 12,
              showEffectOn: "render",
              rippleEffect: { brushType: "stroke", scale: 3, period: 5 },
              itemStyle: { color: "#F97316" },
              label: { show: true, formatter: "{b}", position: "right" },
            },
            // HQ Connection Lines
            {
              type: "lines",
              coordinateSystem: "grid",
              effect: { show: true, period: 4, trailLength: 0.4, symbol: "circle", symbolSize: 6, color: "#3B82F6" },
              lineStyle: { color: "#3B82F6", width: 3, opacity: 0.85, curveness: 0.25 },
              data: [
                { coords: [[114.07, 22.54], [121.47, 31.23]] },
                { coords: [[114.07, 22.54], [113.26, 23.13]] },
                { coords: [[114.07, 22.54], [120.58, 29.99]] },
              ],
            },
            // Domestic Radiation Lines
            {
              type: "lines",
              coordinateSystem: "grid",
              effect: { show: true, period: 5, trailLength: 0.3, symbol: "circle", symbolSize: 4, color: "#F97316" },
              lineStyle: { color: "#F97316", width: 1.5, opacity: 0.5, curveness: 0.2, type: "dashed" },
              data: [
                { coords: [[121.47, 31.23], [116.46, 39.92]] },
                { coords: [[121.47, 31.23], [104.06, 30.67]] },
                { coords: [[113.26, 23.13], [108.95, 34.27]] },
                { coords: [[120.58, 29.99], [114.31, 30.52]] },
              ],
            },
            // Overseas Radiation Lines
            {
              type: "lines",
              coordinateSystem: "grid",
              effect: { show: true, period: 8, trailLength: 0.5, symbol: "circle", symbolSize: 5, color: "#FB923C" },
              lineStyle: { color: "#F97316", width: 2, opacity: 0.7, curveness: 0.5 },
              data: [
                { coords: [[114.07, 22.54], [55.27, 25.2]] },
                { coords: [[114.07, 22.54], [-0.13, 51.51]] },
                { coords: [[121.47, 31.23], [8.68, 50.11]] },
                { coords: [[113.26, 23.13], [-74, 40.71]] },
                { coords: [[120.58, 29.99], [-118.24, 34.05]] },
              ],
            },
          ],
        };

        chart.setOption(option);
        setIsReady(true);
        console.log("[Map] Chart ready!");

        // Handle resize
        window.addEventListener("resize", () => chart.resize());
      }

      return true;
    } catch (e) {
      console.error("[Map] Error:", e);
      setError(String(e));
      return false;
    }
  }, [locale, containerId]);

  useEffect(() => {
    // Try to init after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const success = initChart();
      if (!success) {
        // Retry
        setTimeout(initChart, 300);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [initChart]);

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      id={containerId}
      className="w-full h-[600px] bg-white rounded-2xl shadow-lg border border-slate-100"
    />
  );
}

declare global {
  interface Window {
    echarts: any;
  }
}

export default EChartsBusinessMap;
