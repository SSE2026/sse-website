'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useBusinessMapTimeline, generateEChartsOption } from './useBusinessMapTimeline';

interface GlobalBusinessMapProps {
  locale?: 'zh' | 'en';
  className?: string;
}

// 等待外部 ECharts 实例
declare global {
  interface Window {
    echarts: any;
    mapController?: any;
  }
}

export default function GlobalBusinessMap({ locale = 'zh', className = '' }: GlobalBusinessMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 加载 ECharts 和地图
  useEffect(() => {
    if (!containerRef.current) return;

    let echarts: any;
    let mounted = true;

    async function initChart() {
      try {
        // 加载 ECharts
        if (!window.echarts) {
          await loadScript('https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js');
        }
        // 加载 world 地图
        if (!window.echarts?.getMap('world')) {
          await loadScript('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/js/world.js');
        }

        if (!mounted || !containerRef.current) return;

        echarts = window.echarts;
        const chart = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
        chartRef.current = chart;

        // 初始配置
        chart.setOption({
          backgroundColor: 'transparent',
        });

        setIsReady(true);
      } catch (e: any) {
        console.error('Failed to init chart:', e);
        setLoadError(e.message);
      }
    }

    initChart();

    return () => {
      mounted = false;
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, []);

  // GSAP Timeline
  const handleUpdate = useCallback((state: any) => {
    if (!chartRef.current || !isReady) return;
    const option = generateEChartsOption(state, locale);
    chartRef.current.setOption(option, { notMerge: false });
  }, [isReady, locale]);

  const { play, pause } = useBusinessMapTimeline({
    totalDuration: 20,
    onUpdate: handleUpdate,
    paused: !isVisible || !isReady,
  });

  // Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause();
      } else {
        play();
      }
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [play, pause]);

  // 启动动画
  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => play(), 500);
    return () => clearTimeout(timer);
  }, [isReady, play]);

  if (loadError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-red-900/20 ${className}`}>
        <p className="text-red-400">地图加载失败: {loadError}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{
        background: 'radial-gradient(ellipse at center, #101923 0%, #060A0F 55%, #030507 100%)',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
}

// 辅助函数：加载脚本
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}
