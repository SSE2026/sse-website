/**
 * ChinaMap Component
 *
 * 简化的中国地图 SVG 组件
 * 聚焦东南沿海，清晰展示深圳、广州、绍兴、上海
 */

"use client";

import React, { memo } from "react";

interface ChinaMapProps {
  opacity?: number;
  className?: string;
}

/**
 * Simplified China outline path data
 * Focus on southeastern coast where our key cities are located
 */
const CHINA_OUTLINE_PATH = `
M 580 180
L 620 160 L 680 140 L 740 130 L 800 140 L 850 150 L 880 180
L 900 220 L 920 260 L 910 300 L 880 340
L 850 380 L 820 420 L 780 450 L 740 470
L 700 480 L 660 490 L 620 485 L 580 470
L 540 450 L 520 420 L 510 380 L 520 340
L 540 300 L 560 260 L 580 220 L 580 180
Z
`.trim();

// Key coastal region path (where our cities are) - highlighted area
const COASTAL_REGION_PATH = `
M 600 340
L 640 310 L 700 290 L 760 300 L 820 320 L 860 350 L 870 400 L 850 450
L 800 470 L 740 465 L 680 450 L 640 420 L 610 380 L 600 340
Z
`.trim();

// Province boundaries for the key region
const PROVINCE_PATHS = [
  // Guangdong
  {
    id: "guangdong",
    path: `M 600 340 L 650 310 L 700 320 L 720 360 L 710 410 L 670 440 L 620 440 L 590 410 L 580 370 L 600 340 Z`,
  },
  // Fujian
  {
    id: "fujian",
    path: `M 720 360 L 760 340 L 810 355 L 830 400 L 815 450 L 770 465 L 720 450 L 700 410 L 720 360 Z`,
  },
  // Zhejiang
  {
    id: "zhejiang",
    path: `M 770 290 L 820 275 L 865 300 L 870 350 L 845 395 L 800 410 L 760 390 L 755 340 L 770 290 Z`,
  },
  // Shanghai
  {
    id: "shanghai",
    path: `M 835 285 L 870 275 L 890 300 L 880 340 L 850 355 L 830 330 L 835 285 Z`,
  },
  // Jiangsu
  {
    id: "jiangsu",
    path: `M 815 250 L 870 240 L 900 265 L 885 300 L 850 315 L 810 300 L 815 250 Z`,
  },
  // Jiangxi
  {
    id: "jiangxi",
    path: `M 680 320 L 730 295 L 780 310 L 800 360 L 785 410 L 740 435 L 690 420 L 670 370 L 680 320 Z`,
  },
  // Hunan
  {
    id: "hunan",
    path: `M 580 330 L 630 305 L 680 320 L 720 360 L 735 410 L 710 460 L 660 475 L 610 460 L 580 420 L 565 370 L 580 330 Z`,
  },
];

export const ChinaMap = memo(function ChinaMap({
  opacity = 1,
  className = "",
}: ChinaMapProps) {
  return (
    <svg
      className={`china-map-svg ${className}`}
      style={{ width: "100%", height: "100%", opacity }}
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Main map fill gradient */}
        <linearGradient id="chinaMapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(37, 99, 235, 0.25)" />
          <stop offset="50%" stopColor="rgba(37, 99, 235, 0.35)" />
          <stop offset="100%" stopColor="rgba(37, 99, 235, 0.2)" />
        </linearGradient>

        {/* Coastal region highlight */}
        <linearGradient id="coastalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.35)" />
          <stop offset="100%" stopColor="rgba(37, 99, 235, 0.25)" />
        </linearGradient>

        {/* Province fill */}
        <linearGradient id="provinceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
        </linearGradient>

        {/* Grid pattern */}
        <pattern id="chinaGridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="0.5" />
        </pattern>

        {/* Glow filter for coastal highlight */}
        <filter id="coastalGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background grid */}
      <rect x="0" y="0" width="1000" height="600" fill="url(#chinaGridPattern)" />

      {/* Main China outline */}
      <path
        d={CHINA_OUTLINE_PATH}
        fill="url(#chinaMapGradient)"
        stroke="rgba(59, 130, 246, 0.5)"
        strokeWidth="2"
      />

      {/* Highlighted coastal region (where our cities are) */}
      <path
        d={COASTAL_REGION_PATH}
        fill="url(#coastalGradient)"
        stroke="rgba(59, 130, 246, 0.7)"
        strokeWidth="1.5"
        filter="url(#coastalGlow)"
      />

      {/* Province boundaries */}
      {PROVINCE_PATHS.map((province) => (
        <g key={province.id}>
          <path
            d={province.path}
            fill="url(#provinceGradient)"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Major city markers */}
      <g className="city-markers">
        {/* Beijing */}
        <circle cx="840" cy="200" r="4" fill="rgba(59, 130, 246, 0.6)" />
        <text x="840" y="185" textAnchor="middle" fill="rgba(59, 130, 246, 0.7)" fontSize="10" fontWeight="500">北京</text>

        {/* Wuhan */}
        <circle cx="720" cy="350" r="3" fill="rgba(59, 130, 246, 0.5)" />
        <text x="720" y="335" textAnchor="middle" fill="rgba(59, 130, 246, 0.6)" fontSize="9">武汉</text>

        {/* Chengdu */}
        <circle cx="560" cy="400" r="3" fill="rgba(59, 130, 246, 0.5)" />
        <text x="560" y="385" textAnchor="middle" fill="rgba(59, 130, 246, 0.6)" fontSize="9">成都</text>
      </g>
    </svg>
  );
});

export default ChinaMap;
