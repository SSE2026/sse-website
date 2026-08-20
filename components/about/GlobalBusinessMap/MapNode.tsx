"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { COLORS, MapNode as MapNodeType, getNodeSize } from "./mapData";

/**
 * MapNode Component
 *
 * Represents a single location node on the map with:
 * - Animated pulse rings
 * - Glowing core
 * - Hover interactions
 * - Info tooltip
 */

interface MapNodeProps {
  node: MapNodeType;
  position: { x: number; y: number };
  isActive?: boolean;
  isHovered?: boolean;
  reducedMotion?: boolean;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  locale?: "en" | "zh";
}

/**
 * Convert geographic coordinates to SVG position
 * Simplified equirectangular projection
 */
export function geoToPosition(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

export function MapNode({
  node,
  position,
  isActive = false,
  isHovered = false,
  reducedMotion = false,
  onHover,
  onClick,
  locale = "zh",
}: MapNodeProps) {
  const size = getNodeSize(node.type);
  const isZh = locale === "zh";

  // Pulse animation settings based on node type
  const pulseSettings = useMemo(() => {
    switch (node.type) {
      case "hq":
        return {
          scale: [1, 2],
          opacity: [0.8, 0],
          duration: 2,
          delay: 0,
        };
      case "business":
        return {
          scale: [1, 1.8],
          opacity: [0.6, 0],
          duration: 2.5,
          delay: 0.3,
        };
      case "manufacturing":
        return {
          scale: [1, 1.6],
          opacity: [0.5, 0],
          duration: 3,
          delay: 0.6,
        };
      default:
        return {
          scale: [1, 1.5],
          opacity: [0.4, 0],
          duration: 2,
          delay: 0,
        };
    }
  }, [node.type]);

  return (
    <g
      className="map-node"
      style={{ cursor: "pointer" }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onClick={onClick}
      role="button"
      aria-label={`${node.name} ${node.role}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Outer glow */}
      <motion.circle
        cx={position.x}
        cy={position.y}
        r={size.glow}
        fill={node.glowColor}
        opacity={isActive ? 0.4 : 0.2}
        filter="blur(10px)"
        animate={{
          opacity: isHovered ? [0.4, 0.6, 0.4] : isActive ? 0.4 : 0.2,
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{
          opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.3 },
        }}
      />

      {/* Pulse rings (outermost) */}
      {!reducedMotion && (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={size.pulse}
          fill="none"
          stroke={node.color}
          strokeWidth={1}
          opacity={0}
          animate={{
            scale: [1, pulseSettings.scale[0]],
            opacity: [pulseSettings.opacity[0], pulseSettings.opacity[1]],
          }}
          transition={{
            duration: pulseSettings.duration,
            delay: pulseSettings.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* Second pulse ring (slightly smaller) */}
      {!reducedMotion && (
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={size.pulse * 0.7}
          fill="none"
          stroke={node.color}
          strokeWidth={0.8}
          opacity={0}
          animate={{
            scale: [1, pulseSettings.scale[0] * 0.8],
            opacity: [pulseSettings.opacity[0] * 0.8, 0],
          }}
          transition={{
            duration: pulseSettings.duration * 0.8,
            delay: pulseSettings.delay + 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* Main core circle */}
      <motion.circle
        cx={position.x}
        cy={position.y}
        r={size.core}
        fill={node.color}
        animate={{
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Inner highlight */}
      <circle
        cx={position.x - size.core * 0.3}
        cy={position.y - size.core * 0.3}
        r={size.core * 0.3}
        fill="rgba(255, 255, 255, 0.4)"
      />

      {/* Node label */}
      <motion.g
        className="node-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive || isHovered ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
      >
        {/* Label background */}
        <rect
          x={position.x - 40}
          y={position.y + size.core + 8}
          width="80"
          height="36"
          rx="4"
          fill="rgba(2, 8, 23, 0.8)"
          stroke={node.color}
          strokeWidth="0.5"
          strokeOpacity="0.5"
        />

        {/* Node name */}
        <text
          x={position.x}
          y={position.y + size.core + 22}
          textAnchor="middle"
          fill={COLORS.textPrimary}
          fontSize={node.type === "hq" ? 11 : 10}
          fontWeight="600"
          fontFamily="system-ui, sans-serif"
        >
          {isZh ? node.name : node.nameEn}
        </text>

        {/* Node role */}
        <text
          x={position.x}
          y={position.y + size.core + 34}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontSize={8}
          fontFamily="system-ui, sans-serif"
        >
          {isZh ? node.role : node.roleEn}
        </text>
      </motion.g>

      {/* Hover interaction area (larger for easier clicking) */}
      <circle
        cx={position.x}
        cy={position.y}
        r={Math.max(size.glow, 40)}
        fill="transparent"
        stroke="transparent"
        style={{ cursor: "pointer" }}
      />
    </g>
  );
}

export default MapNode;
