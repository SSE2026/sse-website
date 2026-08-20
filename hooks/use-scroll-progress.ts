"use client";

import { useState, useEffect } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollProgressOptions {
  offset?: [string, string];
}

interface ScrollProgressResult {
  progress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  scrollY: number;
  direction: "up" | "down" | null;
}

export function useScrollProgress(
  options: ScrollProgressOptions = {}
): ScrollProgressResult {
  const { offset = ["start start", "end end"] } = options;
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({
    offset: offset as any,
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setDirection(currentScrollY > lastScrollY ? "down" : "up");
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return { progress, scrollYProgress, scrollY, direction };
}

// Simple scroll position hook
export function useScrollY(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

// Check if element is in viewport
export function useIsInView(ref: React.RefObject<HTMLElement>, margin = "-50px"): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: margin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, margin]);

  return isInView;
}
