"use client";

import React, { useEffect, useRef, memo, useState } from "react";
import * as echarts from "echarts";

/**
 * WorldMap Component
 *
 * 使用 ECharts 真实世界地图
 * 提供清晰可辨认的世界地图
 */

interface WorldMapProps {
  opacity?: number;
  showGrid?: boolean;
  className?: string;
  onChartReady?: (chart: echarts.ECharts) => void;
  onChartInit?: () => void;
}

const COLORS = {
  ocean: "#0a1420",
  land: "#0c1e30",
  landStroke: "rgba(30, 58, 95, 0.15)",
};

let cachedGeoJson: any = null;

async function loadWorldMapData(): Promise<any> {
  if (cachedGeoJson) return cachedGeoJson;

  const response = await fetch("/maps/world.json");
  if (!response.ok) throw new Error("Failed to load map");

  cachedGeoJson = await response.json();
  return cachedGeoJson;
}

export function geoToPixel(lat: number, lng: number, containerWidth: number, containerHeight: number): { x: number; y: number } {
  // Match ECharts geo settings: layoutCenter: ["50%", "50%"], layoutSize: "160%"
  const smallerDim = Math.min(containerWidth, containerHeight);
  const mapPixelWidth = smallerDim * 1.6;
  const mapPixelHeight = smallerDim * 1.6;

  const mapCenterX = containerWidth * 0.5;
  const mapCenterY = containerHeight * 0.5;

  const mapLeft = mapCenterX - mapPixelWidth / 2;
  const mapTop = mapCenterY - mapPixelHeight / 2;

  const normalizedX = (lng + 180) / 360;
  const normalizedY = (90 - lat) / 180;

  return {
    x: mapLeft + normalizedX * mapPixelWidth,
    y: mapTop + normalizedY * mapPixelHeight,
  };
}

export const WorldMap = memo(function WorldMap({
  opacity = 1,
  showGrid = true,
  className = "",
  onChartReady,
  onChartInit,
}: WorldMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    let isMounted = true;

    const initChart = async () => {
      try {
        const geoJson = await loadWorldMapData();
        if (!isMounted || !chartRef.current) return;

        echarts.registerMap("world", geoJson);

        const chart = echarts.init(chartRef.current, null, {
          renderer: "canvas",
          useDirtyRect: true,
        });

        if (!isMounted) {
          chart.dispose();
          return;
        }

        const option: echarts.EChartsOption = {
          backgroundColor: COLORS.ocean,
          geo: {
            type: "map",
            map: "world",
            roam: false,
            silent: true,
            itemStyle: {
              areaColor: COLORS.land,
              borderColor: COLORS.landStroke,
              borderWidth: 0.3,
            },
            emphasis: {
              disabled: true,
            },
            select: {
              disabled: true,
            },
            layoutCenter: ["50%", "50%"],
            layoutSize: "160%",
          },
          series: [],
        };

        chart.setOption(option);
        setIsLoading(false);
        onChartReady?.(chart);
        onChartInit?.();

        const handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          chart.dispose();
        };
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load map");
          setIsLoading(false);
        }
      }
    };

    initChart();

    return () => {
      isMounted = false;
    };
  }, [onChartReady, onChartInit]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={chartRef}
        className={`world-map-echarts ${className}`}
        style={{ width: "100%", height: "100%", opacity }}
      />
      {isLoading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#2563eb",
          fontSize: "14px",
        }}>
          Loading map...
        </div>
      )}
      {error && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#ef4444",
          fontSize: "12px",
        }}>
          {error}
        </div>
      )}
    </div>
  );
});

export default WorldMap;
