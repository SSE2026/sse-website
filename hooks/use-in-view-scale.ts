"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

interface UseInViewScaleOptions {
  initialScale?: number;
  finalScale?: number;
  blur?: number;
  initialBlur?: number;
  threshold?: number;
  margin?: string;
}

export function useInViewScale(options: UseInViewScaleOptions = {}) {
  const {
    initialScale = 0.95,
    finalScale = 1,
    blur = 0,
    initialBlur = 10,
    threshold = 0,
    margin = "-50px",
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const scale = isInView ? finalScale : initialScale;
  const filter = isInView ? `blur(${blur}px)` : `blur(${initialBlur}px)`;

  return { ref, isInView, scale, filter };
}

// Simple scale animation on scroll
export function useScrollScale(
  minScale = 0.8,
  maxScale = 1,
  speed = 0.3
): { ref: React.RefObject<HTMLDivElement | null>; scale: number } {
  const ref = useRef<HTMLDivElement>(null);

  const calculateScale = () => {
    if (!ref.current) return 1;

    const rect = ref.current.getBoundingClientRect();
    const scrollPercent =
      1 - (rect.top / (window.innerHeight - rect.height));
    const clampedPercent = Math.max(0, Math.min(1, scrollPercent));

    return minScale + (maxScale - minScale) * clampedPercent * speed;
  };

  const [scale, setScale] = useState(maxScale);

  useEffect(() => {
    const onScroll = () => {
      const newScale = calculateScale();
      setScale(newScale);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { ref, scale };
}
