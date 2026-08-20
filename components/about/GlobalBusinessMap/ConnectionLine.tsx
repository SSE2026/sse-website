"use client";

import React, { useRef, useMemo, useEffect } from "react";
import type { MapRoute as Connection } from "./mapData";

/**
 * ConnectionLine Component
 *
 * Renders animated curved lines between nodes with:
 * - Bezier curves for smooth arcs
 * - Moving particles along the path
 * - Gradient stroke
 * - Glow effects
 */

interface ConnectionLineProps {
  connection: Connection;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  progress?: number; // 0-1 for animation progress
  isActive?: boolean;
  isHighlighted?: boolean;
  reducedMotion?: boolean;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  particleProgress?: number; // For animating particles
  strokeWidth?: number;
  width: number;
  height: number;
}

/**
 * Calculate bezier curve control point
 * Creates a natural-looking arc between two points
 */
function getControlPoint(
  from: { x: number; y: number },
  to: { x: number; y: number }
): { x: number; y: number } {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  // Calculate perpendicular offset for curve
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Control point offset (perpendicular to midpoint)
  const offset = Math.min(distance * 0.3, 50);

  // Determine curve direction based on positions
  const angle = Math.atan2(dy, dx) + Math.PI / 2;
  const curveDirection = from.y < to.y ? -1 : 1;

  return {
    x: midX + Math.cos(angle) * offset * curveDirection,
    y: midY + Math.sin(angle) * offset * curveDirection,
  };
}

/**
 * Get point on bezier curve at parameter t (0-1)
 */
function getBezierPoint(
  from: { x: number; y: number },
  control: { x: number; y: number },
  to: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;

  return {
    x: mt3 * from.x + 3 * mt2 * t * control.x + 3 * mt * t2 * control.y + t3 * to.x,
    y: mt3 * from.y + 3 * mt2 * t * control.y + 3 * mt * t2 * control.x + t3 * to.y,
  };
}

export function ConnectionLine({
  connection,
  fromPosition,
  toPosition,
  progress = 1,
  isActive = false,
  isHighlighted = false,
  reducedMotion = false,
  particleProgress = 0,
  width,
  height,
}: ConnectionLineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate control point for bezier curve
  const controlPoint = useMemo(
    () => getControlPoint(fromPosition, toPosition),
    [fromPosition, toPosition]
  );

  // Create SVG path
  const pathD = useMemo(
    () =>
      `M ${fromPosition.x} ${fromPosition.y} Q ${controlPoint.x} ${controlPoint.y} ${toPosition.x} ${toPosition.y}`,
    [fromPosition, controlPoint, toPosition]
  );

  // Calculate path length for animation
  const pathLength = useMemo(() => {
    if (pathRef.current) {
      return pathRef.current.getTotalLength();
    }
    // Approximate length
    const dx = toPosition.x - fromPosition.x;
    const dy = toPosition.y - fromPosition.y;
    return Math.sqrt(dx * dx + dy * dy) * 1.3;
  }, [fromPosition, toPosition]);

  // Calculate stroke opacity based on state and connection type
  // HQ connections are more prominent, global connections are thinner
  const baseOpacity = isHighlighted
    ? 0.95
    : isActive
      ? 0.7
      : 0.25;

  // Different stroke widths based on route type
  const strokeWidth = connection.type === 'domestic'
    ? 3  // Domestic routes: wider
    : connection.type === 'manufacturing'
      ? 2.5 // Manufacturing routes: medium
      : 2;      // International routes: thin

  // Generate gradient ID
  const gradientId = `line-gradient-${connection.id}`;

  return (
    <g className="connection-line">
      {/* Defs for gradients and filters */}
      <defs>
        {/* Gradient for the line */}
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={fromPosition.x} y1={fromPosition.y} x2={toPosition.x} y2={toPosition.y}>
          <stop offset="0%" stopColor={connection.color} stopOpacity={baseOpacity} />
          <stop offset="50%" stopColor={connection.color} stopOpacity={baseOpacity * 0.7} />
          <stop offset="100%" stopColor={connection.color} stopOpacity={baseOpacity * 0.4} />
        </linearGradient>

        {/* Glow filter - stronger for HQ connections */}
        <filter id={`glow-${connection.id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={isHighlighted ? "3" : "2"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated dash for flowing effect */}
        <linearGradient id={`flow-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Base line (static, dim) - always visible */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={baseOpacity * 0.35}
        vectorEffect="non-scaling-stroke"
      />

      {/* Domestic connection - special glow effect */}
      {connection.type === 'domestic' && (
        <path
          d={pathD}
          fill="none"
          stroke={connection.color}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          opacity={baseOpacity * 0.15}
          filter={`url(#glow-${connection.id})`}
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* Animated line (progress-based reveal) */}
      {progress < 1 && (
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={baseOpacity}
          filter={`url(#glow-${connection.id})`}
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - progress)}
          vectorEffect="non-scaling-stroke"
          style={{
            transition: "stroke-dashoffset 0.1s linear",
          }}
        />
      )}

      {/* Full line when complete */}
      {progress >= 1 && (
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={baseOpacity}
          filter={isHighlighted || connection.type === 'domestic' ? `url(#glow-${connection.id})` : undefined}
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* Moving particle - only 1-2 per line */}
      {!reducedMotion && progress >= 1 && (isActive || connection.type === 'domestic') && (
        <MovingParticle
          fromPosition={fromPosition}
          controlPoint={controlPoint}
          toPosition={toPosition}
          color={connection.color}
          progress={particleProgress}
          size={1}
        />
      )}

      {/* Flow animation overlay for HQ connections */}
      {!reducedMotion && progress >= 1 && (isActive || connection.type === 'domestic') && (
        <path
          d={pathD}
          fill="none"
          stroke={`url(#flow-${connection.id})`}
          strokeWidth={strokeWidth * 1.5}
          strokeLinecap="round"
          opacity={0.6}
          strokeDasharray="8 20"
          vectorEffect="non-scaling-stroke"
          style={{
            animation: `flowAnimation ${connection.type === 'domestic' ? 1.5 : 2.5}s linear infinite`,
          }}
        />
      )}
    </g>
  );
}

/**
 * MovingParticle Component
 *
 * A single particle that travels along the bezier curve
 */
interface MovingParticleProps {
  fromPosition: { x: number; y: number };
  controlPoint: { x: number; y: number };
  toPosition: { x: number; y: number };
  color: string;
  progress: number;
  size?: number; // scale factor for particle size
}

function MovingParticle({
  fromPosition,
  controlPoint,
  toPosition,
  color,
  progress,
  size = 1,
}: MovingParticleProps) {
  // Calculate particle position on the curve
  const position = getBezierPoint(fromPosition, controlPoint, toPosition, progress);

  // Calculate angle for direction
  const nextPosition = getBezierPoint(fromPosition, controlPoint, toPosition, Math.min(progress + 0.01, 1));
  const angle = Math.atan2(nextPosition.y - position.y, nextPosition.x - position.x);

  const baseSize = size * 1;
  const glowRadius = baseSize * 3;
  const coreRadius = baseSize * 1.5;

  return (
    <g className="moving-particle">
      {/* Particle glow */}
      <circle
        cx={position.x}
        cy={position.y}
        r={glowRadius}
        fill={color}
        opacity="0.25"
        filter="blur(3px)"
      />

      {/* Particle core */}
      <circle
        cx={position.x}
        cy={position.y}
        r={coreRadius}
        fill={color}
      />

      {/* Particle highlight */}
      <circle
        cx={position.x - coreRadius * 0.3}
        cy={position.y - coreRadius * 0.3}
        r={coreRadius * 0.4}
        fill="rgba(255, 255, 255, 0.7)"
      />

      {/* Particle trail */}
      <ellipse
        cx={position.x - Math.cos(angle) * glowRadius * 2}
        cy={position.y - Math.sin(angle) * glowRadius * 2}
        rx={glowRadius * 1.5}
        ry={glowRadius * 0.5}
        fill={color}
        opacity="0.2"
        transform={`rotate(${-angle * (180 / Math.PI)} ${position.x - Math.cos(angle) * glowRadius * 2} ${position.y - Math.sin(angle) * glowRadius * 2})`}
      />
    </g>
  );
}

/**
 * Canvas-based particle system for better performance
 */
export function ConnectionLineCanvas({
  connection,
  fromPosition,
  toPosition,
  progress = 1,
  isActive = false,
  isHighlighted = false,
  reducedMotion = false,
  particleProgress = 0,
}: Omit<ConnectionLineProps, "width" | "height" | "canvasRef" | "strokeWidth"> & {
  canvasWidth: number;
  canvasHeight: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate stroke width based on connection type
  const strokeWidth = connection.type === 'domestic'
    ? 3
    : connection.type === 'manufacturing'
      ? 2.5
      : 2;

  // Calculate control point for bezier curve
  const controlPoint = useMemo(
    () => getControlPoint(fromPosition, toPosition),
    [fromPosition, toPosition]
  );

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate opacity
    const strokeOpacity = isHighlighted
      ? 0.9
      : isActive
        ? 0.6
        : 0.2;

    if (progress < 0.01) return;

    // Create gradient
    const gradient = ctx.createLinearGradient(
      fromPosition.x,
      fromPosition.y,
      toPosition.x,
      toPosition.y
    );
    gradient.addColorStop(0, `${connection.color}`);
    gradient.addColorStop(1, `${connection.color}`);

    // Draw path
    ctx.beginPath();
    ctx.moveTo(fromPosition.x, fromPosition.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, toPosition.x, toPosition.y);
    ctx.strokeStyle = connection.color;
    ctx.lineWidth = strokeWidth;
    ctx.globalAlpha = strokeOpacity;
    ctx.stroke();

    // Draw glow
    if (isHighlighted || isActive) {
      ctx.shadowColor = connection.color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw particle
    if (!reducedMotion && progress >= 1 && isActive) {
      const position = getBezierPoint(fromPosition, controlPoint, toPosition, particleProgress);

      // Glow
      ctx.beginPath();
      ctx.arc(position.x, position.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = connection.color;
      ctx.globalAlpha = 0.3;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(position.x, position.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = connection.color;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Highlight
      ctx.beginPath();
      ctx.arc(position.x - 1, position.y - 1, 1, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0.8;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }, [
    fromPosition,
    controlPoint,
    toPosition,
    connection.color,
    strokeWidth,
    progress,
    isActive,
    isHighlighted,
    reducedMotion,
    particleProgress,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={960}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

export default ConnectionLine;
