"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  className?: string;
  color?: "accent" | "cyan" | "white" | string;
  height?: "sm" | "md" | "lg";
}

export function ScrollProgress({
  className,
  color = "accent",
  height = "sm",
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const colorClasses: Record<string, string> = {
    accent: "bg-accent",
    cyan: "bg-accent-light",
    white: "bg-white",
  };

  const heightClasses = {
    sm: "h-[2px]",
    md: "h-[3px]",
    lg: "h-[4px]",
  };

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] origin-left",
        heightClasses[height],
        className
      )}
      style={{ scaleX }}
    >
      <div className={cn("h-full", colorClasses[color])} />
    </motion.div>
  );
}

interface ReadingProgressProps {
  targetId?: string;
  className?: string;
}

export function ReadingProgress({ targetId, className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (targetId) {
        const element = document.getElementById(targetId);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;

        const scrolled = windowHeight - elementTop;
        const total = windowHeight + elementHeight;
        const percentage = Math.min(Math.max(scrolled / total, 0), 1);

        setProgress(percentage * 100);
      } else {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const percentage = (scrolled / scrollHeight) * 100;
        setProgress(percentage);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  return (
    <div className={cn("fixed left-0 top-0 h-1 bg-white/10 z-[100]", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-accent to-accent-light"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />
    </div>
  );
}
