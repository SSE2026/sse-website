"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapNode } from "./mapData";
import { COLORS } from "./mapData";

/**
 * NodeInfoCard Component
 *
 * Displays detailed information about a node when hovered/clicked
 */

interface NodeInfoCardProps {
  node: MapNode | null;
  position: { x: number; y: number };
  isVisible: boolean;
  locale?: "en" | "zh";
  onClose?: () => void;
}

export function NodeInfoCard({
  node,
  position,
  isVisible,
  locale = "zh",
  onClose,
}: NodeInfoCardProps) {
  if (!node) return null;

  const isZh = locale === "zh";

  // Determine card position (avoid going off-screen)
  const cardWidth = 240;
  const cardHeight = 200;
  const padding = 20;

  let cardX = position.x + padding;
  let cardY = position.y + padding;

  // Adjust if card would go off right edge
  if (typeof window !== "undefined" && cardX + cardWidth > window.innerWidth - padding) {
    cardX = position.x - cardWidth - padding;
  }

  // Adjust if card would go off bottom edge
  if (typeof window !== "undefined" && cardY + cardHeight > window.innerHeight - padding) {
    cardY = position.y - cardHeight - padding;
  }

  // Ensure card doesn't go off left or top
  cardX = Math.max(padding, cardX);
  cardY = Math.max(padding, cardY);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="node-info-card"
          style={{
            position: "fixed",
            left: cardX,
            top: cardY,
            width: cardWidth,
            zIndex: 100,
          }}
          role="tooltip"
          aria-label={`${node.name} ${node.role}`}
        >
          {/* Card background */}
          <div
            className="relative rounded-xl p-5 backdrop-blur-xl"
            style={{
              background: "rgba(2, 8, 23, 0.95)",
              border: `1px solid ${node.color}40`,
              boxShadow: `0 0 40px ${node.glowColor}20`,
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ background: node.color }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 transition-colors"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1L11 11M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="relative mb-4">
              {/* Type badge */}
              <div
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-2"
                style={{
                  background: `${node.color}20`,
                  color: node.color,
                  border: `1px solid ${node.color}40`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mr-1.5"
                  style={{ background: node.color }}
                />
                {node.type === "hq"
                  ? isZh
                    ? "总部"
                    : "Headquarters"
                  : node.type === "business"
                    ? isZh
                      ? "业务中心"
                      : "Business Center"
                    : isZh
                      ? "智造基地"
                      : "Manufacturing"}
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold text-white mb-1"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {isZh ? node.name : node.nameEn}
              </h3>
              <p
                className="text-sm text-white/60"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {isZh ? node.role : node.roleEn}
              </p>
            </div>

            {/* Divider */}
            <div
              className="h-px w-full mb-4"
              style={{
                background: `linear-gradient(90deg, ${node.color}40, transparent)`,
              }}
            />

            {/* Description */}
            <p
              className="text-sm text-white/70 mb-4 leading-relaxed"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {isZh ? node.description : node.descriptionEn}
            </p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2">
              {(isZh ? node.keywords : node.keywordsEn)?.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: COLORS.textSecondary,
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Decorative corner */}
            <div
              className="absolute bottom-0 right-0 w-16 h-16 rounded-tr-xl overflow-hidden"
              style={{ opacity: 0.1 }}
            >
              <div
                className="absolute bottom-0 right-0 w-8 h-8"
                style={{
                  borderRight: `2px solid ${node.color}`,
                  borderBottom: `2px solid ${node.color}`,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NodeInfoCard;
