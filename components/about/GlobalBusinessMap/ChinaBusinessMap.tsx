/**
 * China Business Map Visualization
 *
 * 高分辨率现代专业地图可视化
 * 聚焦中国版图，展示业务布局
 */

"use client";

import React, { memo, useEffect, useState } from "react";

interface ChinaBusinessMapProps {
  locale?: "en" | "zh";
  className?: string;
}

export const ChinaBusinessMap = memo(function ChinaBusinessMap({
  locale = "zh",
  className = "",
}: ChinaBusinessMapProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const isZh = locale === "zh";

  return (
    <div className={`china-business-map ${className}`}>
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          {/* China map gradient */}
          <linearGradient id="chinaFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.2" />
          </linearGradient>

          {/* Background gradient */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Blue glow for HQ connections */}
          <filter id="blueGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Orange glow for business radiation */}
          <filter id="orangeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* City marker glow */}
          <filter id="cityGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong glow for Shenzhen HQ */}
          <filter id="hqGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Marker gradients */}
          <radialGradient id="hqGradient">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </radialGradient>

          <radialGradient id="bcGradient">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="70%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </radialGradient>

          <radialGradient id="tbGradient">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="70%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </radialGradient>

          {/* Arrow marker */}
          <marker id="blueArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
          </marker>

          <marker id="orangeArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L7,3 z" fill="#F97316" />
          </marker>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="1200" height="800" fill="url(#bgGradient)" />

        {/* Grid pattern */}
        <g className="grid" opacity="0.3">
          {Array.from({ length: 25 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="1200" y2={i * 40} stroke="#CBD5E1" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 31 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="800" stroke="#CBD5E1" strokeWidth="0.5" />
          ))}
        </g>

        {/* Simplified World Map (background context) */}
        <g className="world-context" opacity="0.15">
          {/* Asia outline */}
          <path
            d="M 200 100 L 250 80 L 320 70 L 400 80 L 480 100 L 550 130 L 600 170 L 620 220 L 600 280 L 560 320 L 500 340 L 440 330 L 380 300 L 320 260 L 260 220 L 200 180 Z"
            fill="#94A3B8"
            stroke="#64748B"
            strokeWidth="1"
          />
          {/* Europe outline */}
          <path
            d="M 420 80 L 480 60 L 540 70 L 580 100 L 560 140 L 520 160 L 480 150 L 440 120 Z"
            fill="#94A3B8"
            stroke="#64748B"
            strokeWidth="1"
          />
          {/* North America outline */}
          <path
            d="M 80 120 L 140 80 L 200 90 L 240 130 L 220 180 L 160 200 L 100 180 L 80 150 Z"
            fill="#94A3B8"
            stroke="#64748B"
            strokeWidth="1"
          />
        </g>

        {/* China Map - Main Focus */}
        <g className="china-map" transform="translate(500, 300) scale(2.2)">
          {/* China outline */}
          <path
            d="M 95 60
               L 105 50 L 120 45 L 140 48 L 160 55 L 175 65 L 180 85
               L 178 105 L 170 125 L 155 140 L 135 150 L 110 145
               L 90 135 L 80 115 L 82 95 L 90 75 Z"
            fill="url(#chinaFill)"
            stroke="#3B82F6"
            strokeWidth="2"
          />

          {/* Coastal highlight */}
          <path
            d="M 110 95 L 130 88 L 150 92 L 165 105 L 168 125 L 155 138 L 135 140 L 115 132 L 105 115 L 108 100 Z"
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#60A5FA"
            strokeWidth="1.5"
          />

          {/* Province boundaries */}
          <g className="provinces" opacity="0.6">
            {/* Guangdong */}
            <path d="M 105 95 L 120 88 L 135 95 L 140 115 L 130 130 L 110 132 L 100 120 L 103 105 Z" fill="none" stroke="#93C5FD" strokeWidth="0.8" />
            {/* Fujian */}
            <path d="M 140 95 L 155 90 L 168 100 L 165 125 L 150 135 L 138 125 L 140 108 Z" fill="none" stroke="#93C5FD" strokeWidth="0.8" />
            {/* Zhejiang */}
            <path d="M 150 70 L 165 65 L 175 80 L 170 100 L 155 108 L 148 90 L 150 70 Z" fill="none" stroke="#93C5FD" strokeWidth="0.8" />
            {/* Jiangsu/Shanghai */}
            <path d="M 160 55 L 175 52 L 180 70 L 172 85 L 158 88 L 155 70 L 160 55 Z" fill="none" stroke="#93C5FD" strokeWidth="0.8" />
          </g>
        </g>

        {/* City Markers */}
        <g className="city-markers">
          {/* Shenzhen HQ */}
          <g transform="translate(785, 545)">
            {/* Outer glow */}
            <circle r="25" fill="url(#hqGradient)" opacity="0.3" filter="url(#hqGlow)" />
            {/* Pulse ring */}
            <circle r="18" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.5">
              {isAnimating && (
                <animate attributeName="r" from="15" to="30" dur="2s" repeatCount="indefinite" />
              )}
              {isAnimating && (
                <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
              )}
            </circle>
            {/* Core */}
            <circle r="10" fill="url(#hqGradient)" filter="url(#cityGlow)" />
            <circle r="4" fill="white" opacity="0.6" />
            {/* Label */}
            <text y="-35" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="700">
              {isZh ? "总部" : "HQ"}
            </text>
            <text y="-22" textAnchor="middle" fill="#3B82F6" fontSize="11" fontWeight="600">
              SHENZHEN
            </text>
            <text y="-10" textAnchor="middle" fill="#64748B" fontSize="9">
              {isZh ? "深圳" : "Shenzhen"}
            </text>
          </g>

          {/* Shanghai BC */}
          <g transform="translate(910, 440)">
            <circle r="20" fill="url(#bcGradient)" opacity="0.25" filter="url(#blueGlow)" />
            <circle r="8" fill="url(#bcGradient)" filter="url(#cityGlow)" />
            <circle r="3" fill="white" opacity="0.5" />
            <text y="-25" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="600">
              {isZh ? "业务中心" : "BC"}
            </text>
            <text y="-14" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="500">
              SHANGHAI
            </text>
            <text y="-3" textAnchor="middle" fill="#64748B" fontSize="8">
              {isZh ? "上海" : "Shanghai"}
            </text>
          </g>

          {/* Guangzhou BC */}
          <g transform="translate(760, 560)">
            <circle r="18" fill="url(#bcGradient)" opacity="0.25" filter="url(#blueGlow)" />
            <circle r="7" fill="url(#bcGradient)" filter="url(#cityGlow)" />
            <circle r="2.5" fill="white" opacity="0.5" />
            <text y="-22" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="600">
              {isZh ? "业务中心" : "BC"}
            </text>
            <text y="-11" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="500">
              GUANGZHOU
            </text>
            <text y="0" textAnchor="middle" fill="#64748B" fontSize="8">
              {isZh ? "广州" : "Guangzhou"}
            </text>
          </g>

          {/* Shaoxing TB */}
          <g transform="translate(885, 475)">
            <circle r="16" fill="url(#tbGradient)" opacity="0.25" filter="url(#blueGlow)" />
            <circle r="6" fill="url(#tbGradient)" filter="url(#cityGlow)" />
            <circle r="2" fill="white" opacity="0.5" />
            <text y="-20" textAnchor="middle" fill="#1E40AF" fontSize="9" fontWeight="600">
              {isZh ? "智造基地" : "TB"}
            </text>
            <text y="-10" textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="500">
              SHAOXING
            </text>
            <text y="0" textAnchor="middle" fill="#64748B" fontSize="8">
              {isZh ? "绍兴" : "Shaoxing"}
            </text>
          </g>
        </g>

        {/* Blue Lines: Direct Management (Shenzhen HQ to others) */}
        <g className="hq-connections">
          {/* Shenzhen to Shanghai */}
          <line
            x1="785" y1="545"
            x2="910" y2="440"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#blueGlow)"
            opacity={isAnimating ? 0.9 : 0}
          >
            {isAnimating && (
              <animate attributeName="stroke-dasharray" from="0,300" to="300,0" dur="1s" fill="freeze" />
            )}
          </line>

          {/* Shenzhen to Guangzhou */}
          <line
            x1="785" y1="545"
            x2="760" y2="560"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#blueGlow)"
            opacity={isAnimating ? 0.8 : 0}
          />

          {/* Shenzhen to Shaoxing */}
          <line
            x1="785" y1="545"
            x2="885" y2="475"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#blueGlow)"
            opacity={isAnimating ? 0.8 : 0}
          />

          {/* Connection nodes */}
          <g className="connection-nodes" opacity={isAnimating ? 1 : 0}>
            <circle cx="847" cy="492" r="4" fill="#3B82F6" filter="url(#blueGlow)" />
            <circle cx="772" cy="552" r="3" fill="#3B82F6" filter="url(#blueGlow)" />
            <circle cx="835" cy="510" r="3" fill="#3B82F6" filter="url(#blueGlow)" />
          </g>
        </g>

        {/* Orange Lines: Business Radiation */}
        <g className="business-radiation" opacity={isAnimating ? 0.7 : 0}>
          {/* Within China - from Shanghai */}
          <line x1="910" y1="440" x2="850" y2="350" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,4" filter="url(#orangeGlow)" />
          <line x1="910" y1="440" x2="920" y2="380" stroke="#F97316" strokeWidth="1" strokeDasharray="3,3" filter="url(#orangeGlow)" />

          {/* Within China - from Guangzhou */}
          <line x1="760" y1="560" x2="700" y2="520" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,4" filter="url(#orangeGlow)" />
          <line x1="760" y1="560" x2="720" y2="600" stroke="#F97316" strokeWidth="1" strokeDasharray="3,3" filter="url(#orangeGlow)" />
          <line x1="760" y1="560" x2="680" y2="480" stroke="#F97316" strokeWidth="1" strokeDasharray="3,3" filter="url(#orangeGlow)" />

          {/* Within China - from Shaoxing */}
          <line x1="885" y1="475" x2="950" y2="420" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,4" filter="url(#orangeGlow)" />
          <line x1="885" y1="475" x2="820" y2="400" stroke="#F97316" strokeWidth="1" strokeDasharray="3,3" filter="url(#orangeGlow)" />

          {/* To Middle East */}
          <line x1="910" y1="440" x2="680" y2="350" stroke="#F97316" strokeWidth="2" strokeDasharray="6,4" filter="url(#orangeGlow)" />
          <line x1="760" y1="560" x2="620" y2="420" stroke="#F97316" strokeWidth="1.5" strokeDasharray="5,4" filter="url(#orangeGlow)" />

          {/* To Europe */}
          <line x1="910" y1="440" x2="500" y2="200" stroke="#F97316" strokeWidth="2" strokeDasharray="8,4" filter="url(#orangeGlow)" />
          <line x1="885" y1="475" x2="480" y2="180" stroke="#F97316" strokeWidth="1.5" strokeDasharray="6,4" filter="url(#orangeGlow)" />

          {/* To North America */}
          <line x1="760" y1="560" x2="200" y2="350" stroke="#F97316" strokeWidth="1.5" strokeDasharray="5,4" filter="url(#orangeGlow)" />
        </g>

        {/* Region Labels */}
        <g className="region-labels" fontSize="11" fontWeight="500">
          {/* Middle East */}
          <g transform="translate(620, 380)">
            <rect x="-40" y="-12" width="80" height="24" rx="4" fill="rgba(249, 115, 22, 0.15)" stroke="#F97316" strokeWidth="1" />
            <text textAnchor="middle" y="4" fill="#C2410C">中东</text>
          </g>

          {/* Europe */}
          <g transform="translate(450, 180)">
            <rect x="-35" y="-12" width="70" height="24" rx="4" fill="rgba(249, 115, 22, 0.15)" stroke="#F97316" strokeWidth="1" />
            <text textAnchor="middle" y="4" fill="#C2410C">欧洲</text>
          </g>

          {/* North America */}
          <g transform="translate(180, 320)">
            <rect x="-35" y="-12" width="70" height="24" rx="4" fill="rgba(249, 115, 22, 0.15)" stroke="#F97316" strokeWidth="1" />
            <text textAnchor="middle" y="4" fill="#C2410C">北美</text>
          </g>
        </g>

        {/* Legend - Top Right */}
        <g transform="translate(1020, 50)">
          <rect x="0" y="0" width="160" height="90" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1" opacity="0.95" />

          <text x="80" y="25" textAnchor="middle" fill="#1E293B" fontSize="13" fontWeight="600">
            {isZh ? "图例" : "Legend"}
          </text>

          <line x1="20" y1="45" x2="50" y2="45" stroke="#3B82F6" strokeWidth="3" />
          <circle cx="35" cy="45" r="4" fill="#3B82F6" />
          <text x="60" y="49" fill="#475569" fontSize="11">
            {isZh ? "直属管理" : "Direct Mgmt"}
          </text>

          <line x1="20" y1="70" x2="50" y2="70" stroke="#F97316" strokeWidth="2" strokeDasharray="4,3" />
          <circle cx="35" cy="70" r="3" fill="#F97316" />
          <text x="60" y="74" fill="#475569" fontSize="11">
            {isZh ? "业务辐射" : "Business Reach"}
          </text>
        </g>

        {/* Company Logo - Bottom Left */}
        <g transform="translate(50, 720)">
          <rect x="0" y="0" width="120" height="40" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1" opacity="0.9" />
          <circle cx="25" cy="20" r="12" fill="#2563EB" />
          <text x="45" y="18" fill="#1E293B" fontSize="10" fontWeight="600">深安锂能</text>
          <text x="45" y="30" fill="#64748B" fontSize="8">SWIFT SAFE ENERGY</text>
        </g>

        {/* Title */}
        <g transform="translate(600, 50)">
          <text textAnchor="middle" fill="#1E293B" fontSize="24" fontWeight="700">
            {isZh ? "全球业务布局" : "Global Business Network"}
          </text>
          <text textAnchor="middle" y="28" fill="#64748B" fontSize="14">
            {isZh ? "立足中国 · 辐射全球" : "Based in China · Reaching Globally"}
          </text>
        </g>
      </svg>
    </div>
  );
});

export default ChinaBusinessMap;
